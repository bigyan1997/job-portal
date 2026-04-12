import stripe
import json
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User
from .serializers import UserSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

FREE_ANALYSIS_LIMIT = 3


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != 'jobseeker':
            return Response(
                {'error': 'Only jobseekers can subscribe'},
                status=status.HTTP_403_FORBIDDEN
            )

        if user.is_pro:
            return Response(
                {'error': 'You are already on the Pro plan'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # create or get stripe customer
            if not user.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.full_name,
                    metadata={'user_id': user.id}
                )
                user.stripe_customer_id = customer.id
                user.save()

            # create checkout session
            session = stripe.checkout.Session.create(
                customer=user.stripe_customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': settings.STRIPE_PRO_PRICE_ID,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f"{settings.FRONTEND_URL}/subscription/success",
                cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
                metadata={'user_id': user.id}
            )

            return Response({'checkout_url': session.url})

        except stripe.error.StripeError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CancelSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not user.is_pro or not user.stripe_subscription_id:
            return Response(
                {'error': 'No active subscription found'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # cancel at period end — user keeps Pro until billing cycle ends
            stripe.Subscription.modify(
                user.stripe_subscription_id,
                cancel_at_period_end=True
            )
            return Response({'message': 'Subscription will be cancelled at end of billing period'})

        except stripe.error.StripeError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        analyses_remaining = max(0, FREE_ANALYSIS_LIMIT - user.ai_analyses_used)

        return Response({
            'is_pro': user.is_pro,
            'ai_analyses_used': user.ai_analyses_used,
            'ats_analyses_used': user.ats_analyses_used,
            'analyses_remaining': analyses_remaining if not user.is_pro else 'unlimited',
            'free_limit': FREE_ANALYSIS_LIMIT,
            'pro_since': user.pro_since,
        })


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # ← disable DRF authentication for webhook

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        print(f"Webhook received — sig header: {sig_header[:20] if sig_header else 'MISSING'}")
        print(f"Webhook secret configured: {'Yes' if settings.STRIPE_WEBHOOK_SECRET else 'NO - MISSING!'}")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            print(f"Invalid payload: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            print(f"Invalid signature: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        print(f"Event verified: {event['type']}")

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            # new Stripe SDK returns StripeObject — access like attributes not dict
            try:
                user_id = session['metadata']['user_id']
            except (KeyError, TypeError):
                user_id = None

            try:
                subscription_id = session['subscription']
            except (KeyError, TypeError):
                subscription_id = None

            print(f"User ID: {user_id}, Subscription: {subscription_id}")

            if not user_id:
                print("ERROR: No user_id in metadata")
                return Response({'status': 'ok'})

            try:
                user = User.objects.get(id=int(user_id))
                user.is_pro = True
                user.pro_since = timezone.now()
                user.stripe_subscription_id = subscription_id or ''
                user.save()
                print(f"SUCCESS: {user.email} upgraded to Pro!")
            except User.DoesNotExist:
                print(f"ERROR: User {user_id} not found")
            except Exception as e:
                print(f"ERROR: {e}")

        elif event['type'] in ['customer.subscription.deleted', 'invoice.payment_failed']:
            subscription = event['data']['object']
            subscription_id = subscription.get('id') or subscription.get('subscription')
            try:
                user = User.objects.get(stripe_subscription_id=subscription_id)
                user.is_pro = False
                user.stripe_subscription_id = ''
                user.save()
                print(f"User {user.email} downgraded from Pro")
            except User.DoesNotExist:
                print(f"No user found with subscription {subscription_id}")

        return Response({'status': 'ok'})