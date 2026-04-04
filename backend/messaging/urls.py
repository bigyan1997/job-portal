from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListView.as_view()),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view()),
    path('conversations/start/', views.StartConversationView.as_view()),
    path('unread/', views.UnreadCountView.as_view()),
]