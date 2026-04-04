from django.db import models
from accounts.models import User
from django.core.exceptions import ValidationError

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    )

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    description = models.TextField()
    requirements = models.TextField()  # what skills/experience are needed
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company}"


class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/')  # stores the uploaded PDF
    cover_letter = models.TextField(blank=True)      # AI will generate this later
    match_score = models.IntegerField(null=True, blank=True)  # AI match score 0-100
    matching_skills = models.TextField(blank=True)  
    missing_skills = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['job', 'applicant']  # can't apply to same job twice

    def __str__(self):
        return f"{self.applicant.email} → {self.job.title}"
    
    def clean(self):
        # make sure applicant is always a jobseeker
        if self.applicant.role != 'jobseeker':
            raise ValidationError('Only jobseekers can apply to jobs.')

    def save(self, *args, **kwargs):
        self.clean()  # runs the check every time an application is saved
        super().save(*args, **kwargs)