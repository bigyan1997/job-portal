from django import forms
from django.contrib import admin
from .models import Job, Application
from accounts.models import User


class JobAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # only show employers in the employer dropdown
        self.fields['employer'].queryset = User.objects.filter(role='employer')

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # only show jobseekers in the applicant dropdown
        self.fields['applicant'].queryset = User.objects.filter(role='jobseeker')

    class Meta:
        model = Application
        fields = '__all__'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    form = JobAdminForm  # ← add this
    list_display = ['title', 'company', 'employer', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type']
    search_fields = ['title', 'company']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    form = ApplicationAdminForm
    list_display = ['applicant', 'job', 'status', 'match_score', 'applied_at']
    list_filter = ['status']
    search_fields = ['applicant__email', 'job__title']