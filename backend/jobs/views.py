from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.conf import settings
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from .ai_service import analyze_resume
import threading
import os

FREE_ANALYSIS_LIMIT = 3 

class AnalyseResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_id = request.data.get('job_id')

        if not job_id:
            return Response({'error': 'job_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.resume:
            return Response({'error': 'Please upload your resume first'}, status=status.HTTP_400_BAD_REQUEST)

        # check analysis limit
        if not request.user.is_pro and request.user.ai_analyses_used >= FREE_ANALYSIS_LIMIT:
            return Response({
                'error': 'limit_reached',
                'message': f'You have used all {FREE_ANALYSIS_LIMIT} free AI analyses. Upgrade to Pro for unlimited analyses.',
                'analyses_used': request.user.ai_analyses_used,
            }, status=status.HTTP_402_PAYMENT_REQUIRED)

        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        resume_url = request.user.resume
        result = analyze_resume(
            resume_file_path=resume_url,
            job_title=job.title,
            job_description=job.description,
            job_requirements=job.requirements,
            user_name=request.user.full_name,
            user_email=request.user.email,
            user_phone=request.user.phone,
        )

        if not result:
            return Response({'error': 'AI analysis failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # increment usage counter
        request.user.ai_analyses_used += 1
        request.user.save()

        return Response({
            'match_score': result.get('match_score'),
            'matching_skills': result.get('matching_skills', []),
            'missing_skills': result.get('missing_skills', []),
            'cover_letter': result.get('cover_letter', ''),
            'analyses_remaining': max(0, FREE_ANALYSIS_LIMIT - request.user.ai_analyses_used) if not request.user.is_pro else 'unlimited',
        })
    
def run_ai_analysis(application):
    """Runs in background after application is submitted"""
    try:
        # Use Cloudinary URL if available, otherwise local path
        if application.resume:
            resume_url = application.resume.url
        else:
            from django.conf import settings
            resume_url = os.path.join(settings.MEDIA_ROOT, str(application.applicant.resume))

        result = analyze_resume(
            resume_file_path=resume_url,
            job_title=application.job.title,
            job_description=application.job.description,
            job_requirements=application.job.requirements,
            user_name=application.applicant.full_name,
            user_email=application.applicant.email,
            user_phone=application.applicant.phone,
        )

        if result:
            application.match_score = result.get('match_score')
            application.cover_letter = result.get('cover_letter', '')
            application.matching_skills = ', '.join(result.get('matching_skills', []))
            application.missing_skills = ', '.join(result.get('missing_skills', []))
            application.save()

    except Exception as e:
        print(f'AI analysis failed: {e}')


class JobListView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        jobs = Job.objects.filter(status='active').order_by('-created_at')

        search = request.query_params.get('search')
        if search:
            terms = search.split()
            query = Q()
            for term in terms:
                query &= (
                    Q(title__icontains=term) |
                    Q(company__icontains=term) |
                    Q(location__icontains=term)
                )
            jobs = jobs.filter(query)

        job_type = request.query_params.get('job_type')
        if job_type:
            jobs = jobs.filter(job_type=job_type)

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'employer':
            return Response(
                {'error': 'Only employers can post jobs'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return None

    def get(self, request, pk):
        job = self.get_object(pk)
        if not job:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(JobSerializer(job).data)

    def put(self, request, pk):
        job = self.get_object(pk)
        if not job:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        if job.employer != request.user:
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job = self.get_object(pk)
        if not job:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        if job.employer != request.user:
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MyJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'employer':
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        jobs = Job.objects.filter(employer=request.user).order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
class ApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'jobseeker':
            return Response(
                {'error': 'Only jobseekers can apply'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.resume:
            return Response(
                {'error': 'Please upload your resume first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        job_id = request.data.get('job_id')
        cover_letter = request.data.get('cover_letter', '')
        match_score = request.data.get('match_score')
        matching_skills = request.data.get('matching_skills', '')
        missing_skills = request.data.get('missing_skills', '')

        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response({'error': 'You have already applied to this job'}, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.create(
            job=job,
            applicant=request.user,
            resume=request.user.resume,
            cover_letter=cover_letter,
            match_score=match_score if match_score is not None else None,
            matching_skills=matching_skills,
            missing_skills=missing_skills,
        )

        # only run background AI if no analysis was already done
        if match_score is None:
            thread = threading.Thread(target=run_ai_analysis, args=(application,))
            thread.daemon = True
            thread.start()

        return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        if request.user.role == 'jobseeker':
            applications = Application.objects.filter(applicant=request.user)
        else:
            applications = Application.objects.filter(job__employer=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApplicationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        # only the employer who owns the job can update status
        if application.job.employer != request.user:
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)

        application.status = request.data.get('status', application.status)
        application.save()
        return Response(ApplicationSerializer(application).data)