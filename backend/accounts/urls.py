from django.urls import path
from .views import RegisterView, LoginView, GoogleLoginView, MeView, ResumeUploadView, ProfileUpdateView
from .stripe_views import CreateCheckoutSessionView, CancelSubscriptionView, SubscriptionStatusView, StripeWebhookView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('google/', GoogleLoginView.as_view()),
    path('me/', MeView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('resume/', ResumeUploadView.as_view()),
    path('profile/', ProfileUpdateView.as_view()),
    path('subscription/', SubscriptionStatusView.as_view()),
    path('subscription/create-checkout/', CreateCheckoutSessionView.as_view()),
    path('subscription/cancel/', CancelSubscriptionView.as_view()),
    path('stripe/webhook/', StripeWebhookView.as_view()),
]