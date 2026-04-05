from django.shortcuts import render
import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from .models import User
import requests
import cloudinary.uploader

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')
        role = request.data.get('role', 'jobseeker')  # ← get role from request
        
        if not access_token:
            return Response({'error': 'Access token required'}, status=status.HTTP_400_BAD_REQUEST)

        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if google_response.status_code != 200:
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)

        google_data = google_response.json()
        email = google_data.get('email')
        full_name = google_data.get('name', '')
        avatar = google_data.get('picture', '')

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': full_name,
                'avatar': avatar,
                'role': role  # ← pass role
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'created': created
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

def extract_public_id(cloudinary_url):
    """Extract public_id from Cloudinary URL for deletion"""
    # URL format: https://res.cloudinary.com/cloud/raw/upload/v123/user_resumes/filename.pdf
    try:
        parts = cloudinary_url.split('/upload/')
        public_id_with_version = parts[1]
        # remove version number (v1234567/)
        if public_id_with_version.startswith('v'):
            public_id = '/'.join(public_id_with_version.split('/')[1:])
        else:
            public_id = public_id_with_version
        # remove file extension
        public_id = public_id.rsplit('.', 1)[0]
        return public_id
    except Exception as e:
        print(f"Could not extract public_id: {e}")
        return None

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume = request.FILES.get('resume')
        if not resume:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        if not resume.name.endswith('.pdf'):
            return Response({'error': 'Only PDF files are allowed'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete old resume from Cloudinary if exists
        if request.user.resume:
            public_id = extract_public_id(str(request.user.resume))
            if public_id:
                try:
                    cloudinary.uploader.destroy(public_id, resource_type='raw')
                    print(f"Deleted old resume: {public_id}")
                except Exception as e:
                    print(f"Could not delete old resume: {e}")

        try:
            result = cloudinary.uploader.upload(
                resume,
                resource_type='raw',
                folder='user_resumes',
                use_filename=True,
                unique_filename=True,
                access_mode='public',
                type='upload',
                invalidate=True,
            )
            cloudinary_url = result['secure_url']
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return Response({'error': f'Upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        request.user.resume = cloudinary_url
        request.user.save()
        return Response(UserSerializer(request.user).data)

    def delete(self, request):
        if request.user.resume:
            # Delete from Cloudinary
            public_id = extract_public_id(str(request.user.resume))
            if public_id:
                try:
                    cloudinary.uploader.destroy(public_id, resource_type='raw')
                    print(f"Deleted resume: {public_id}")
                except Exception as e:
                    print(f"Could not delete resume: {e}")
            request.user.resume = None
            request.user.save()
        return Response({'message': 'Resume deleted'})