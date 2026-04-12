from rest_framework import serializers
from .models import Job, Application
from accounts.serializers import UserSerializer

class JobSerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)  # shows full employer info
    employer_id = serializers.IntegerField(source='employer.id', read_only=True)
    application_count = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)
    job_type = serializers.ChoiceField(choices=[
        'full_time', 'part_time', 'casual', 'contract', 'internship', 'remote'
    ])

    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'employer_id', 'title', 'company', 'location',
            'job_type', 'description', 'requirements',
            'salary_min', 'salary_max', 'status',
            'application_count', 'created_at', 'expires_at', 'is_expired'
        ]

    def get_application_count(self, obj):
        return obj.applications.count()


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), source='job', write_only=True
    )

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_id', 'applicant', 'resume',
            'cover_letter', 'matching_skills','missing_skills', 'match_score', 'status', 'applied_at'
        ]
        read_only_fields = ['cover_letter', 'matching_skills','missing_skills', 'match_score', 'status']