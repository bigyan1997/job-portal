from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'company_name', 'role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'company_name', 'role', 'avatar',
            'resume', 'phone', 'bio', 'address', 'city',
            'state', 'country', 'linkedin', 'portfolio', 'ai_analyses_used', 'is_pro', 'pro_since', 'date_joined'
        ]