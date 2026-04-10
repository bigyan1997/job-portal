import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_verification_email(user_email, user_name, verification_token, frontend_url):
    verification_url = f"{frontend_url}/verify-email/{verification_token}"

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F7F4; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
    <div style="background: #0F1923; padding: 32px; text-align: center;">
      <span style="color: #F1F5F9; font-size: 20px; font-weight: 700;">JobPortal <span style="color: #3B82F6;">AI</span></span>
    </div>
    <div style="padding: 40px 32px;">
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 12px;">Verify your email</h1>
      <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Hi {user_name or 'there'},<br><br>
        Thanks for signing up to JobPortal AI! Please verify your email address to activate your account.
      </p>
      <a href="{verification_url}" style="display: block; background: #111827; color: #fff; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; text-decoration: none; margin-bottom: 24px;">
        Verify Email Address →
      </a>
      <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
        Or copy and paste this link:<br>
        <a href="{verification_url}" style="color: #2563EB; word-break: break-all;">{verification_url}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
      <p style="color: #9CA3AF; font-size: 12px;">
        If you didn't create an account, you can safely ignore this email. This link will expire in 24 hours.
      </p>
    </div>
  </div>
</body>
</html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_email, "name": user_name or "User"}],
        sender={"email": "karkibigyan05@gmail.com", "name": "JobPortal AI"},
        subject="Verify your email — JobPortal AI",
        html_content=html_content,
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Verification email sent to {user_email}")
        return True
    except ApiException as e:
        print(f"Failed to send verification email: {e}")
        return False