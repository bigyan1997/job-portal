from django.urls import path
from .views import JobListView, JobDetailView, ApplicationView, ApplicationDetailView, AnalyseResumeView, MyJobsView, SuggestResumeImprovementsView, BookmarkView

urlpatterns = [
    path('', JobListView.as_view()),               # GET all jobs / POST new job
    path('my-jobs/', MyJobsView.as_view()), 
    path('<int:pk>/', JobDetailView.as_view()),    # GET / PUT / DELETE single job
    path('applications/', ApplicationView.as_view()),  # GET / POST applications
    path('applications/<int:pk>/', ApplicationDetailView.as_view()),
    path('analyse/', AnalyseResumeView.as_view()),
    path('suggest-improvements/', SuggestResumeImprovementsView.as_view()),
    path('bookmarks/', BookmarkView.as_view()),

]