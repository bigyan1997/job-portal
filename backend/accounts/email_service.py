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
  
def send_password_reset_email(user_email, user_name, reset_url):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F7F4; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
    <div style="background: #0F1923; padding: 32px; text-align: center;">
      <span style="color: #F1F5F9; font-size: 20px; font-weight: 700;">JobPortal <span style="color: #3B82F6;">AI</span></span>
    </div>
    <div style="padding: 40px 32px;">
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 12px;">Reset your password</h1>
      <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Hi {user_name or 'there'},<br><br>
        We received a request to reset your password. Click the button below to choose a new one.
      </p>
      <a href="{reset_url}" style="display: block; background: #111827; color: #fff; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; text-decoration: none; margin-bottom: 24px;">
        Reset Password →
      </a>
      <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
        Or copy and paste this link:<br>
        <a href="{reset_url}" style="color: #2563EB; word-break: break-all;">{reset_url}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
      <p style="color: #9CA3AF; font-size: 12px;">
        If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.
      </p>
    </div>
  </div>
</body>
</html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_email, "name": user_name or "User"}],
        sender={"email": "karkibigyan05@gmail.com", "name": "JobPortal AI"},
        subject="Reset your password — JobPortal AI",
        html_content=html_content,
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Password reset email sent to {user_email}")
        return True
    except Exception as e:
        print(f"Failed to send password reset email: {e}")
        return False
  
def send_application_status_email(user_email, user_name, job_title, company, new_status):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    STATUS_CONFIG = {
        'reviewed': {
            'emoji': '👀',
            'heading': 'Your application has been reviewed',
            'message': f'Good news! {company} has reviewed your application for <strong>{job_title}</strong>. They are currently evaluating candidates.',
            'color': '#1D4ED8',
            'bg': '#DBEAFE',
        },
        'shortlisted': {
            'emoji': '🎉',
            'heading': "You've been shortlisted!",
            'message': f'Congratulations! {company} has shortlisted your application for <strong>{job_title}</strong>. You are one step closer to landing this role!',
            'color': '#15803D',
            'bg': '#DCFCE7',
        },
        'rejected': {
            'emoji': '😔',
            'heading': 'Application update',
            'message': f'Thank you for applying to <strong>{job_title}</strong> at {company}. Unfortunately, they have decided to move forward with other candidates. Keep applying — the right role is out there!',
            'color': '#B91C1C',
            'bg': '#FEE2E2',
        },
    }

    config = STATUS_CONFIG.get(new_status)
    if not config:
        return False

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F7F4; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
    <div style="background: #0F1923; padding: 32px; text-align: center;">
      <span style="color: #F1F5F9; font-size: 20px; font-weight: 700;">JobPortal <span style="color: #3B82F6;">AI</span></span>
    </div>
    <div style="padding: 40px 32px;">
      <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">{config['emoji']}</div>
      <h1 style="color: #111827; font-size: 22px; font-weight: 700; margin-bottom: 12px; text-align: center;">{config['heading']}</h1>

      <div style="background: {config['bg']}; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="color: {config['color']}; font-size: 14px; line-height: 1.6; margin: 0;">
          {config['message']}
        </p>
      </div>

      <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">
        Hi {user_name or 'there'},<br><br>
        Log in to your JobPortal AI dashboard to view your application details and next steps.
      </p>

      <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard" 
         style="display: block; background: #111827; color: #fff; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; text-decoration: none; margin-bottom: 24px;">
        View My Applications →
      </a>

      <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
      <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
        You're receiving this because you applied for a job on JobPortal AI.
      </p>
    </div>
  </div>
</body>
</html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": user_email, "name": user_name or "User"}],
        sender={"email": "karkibigyan05@gmail.com", "name": "JobPortal AI"},
        subject=f"{config['emoji']} Application update — {job_title}",
        html_content=html_content,
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Status email sent to {user_email} — {new_status}")
        return True
    except Exception as e:
        print(f"Failed to send status email: {e}")
        return False
  
def send_application_withdrawn_email(employer_email, employer_name, applicant_name, job_title):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    html_content = f"""
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F7F4; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
    <div style="background: #0F1923; padding: 32px; text-align: center;">
      <span style="color: #F1F5F9; font-size: 20px; font-weight: 700;">JobPortal <span style="color: #3B82F6;">AI</span></span>
    </div>
    <div style="padding: 40px 32px;">
      <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">📋</div>
      <h1 style="color: #111827; font-size: 22px; font-weight: 700; margin-bottom: 12px; text-align: center;">Application Withdrawn</h1>
      <div style="background: #FEF9C3; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="color: #A16207; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>{applicant_name}</strong> has withdrawn their application for <strong>{job_title}</strong>.
        </p>
      </div>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">
        Hi {employer_name or 'there'},<br><br>
        This is to let you know that the above candidate has withdrawn their application. You may want to review your remaining applicants.
      </p>
      <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/employer" 
         style="display: block; background: #111827; color: #fff; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; text-decoration: none; margin-bottom: 24px;">
        View Applicants →
      </a>
      <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
      <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
        You're receiving this because you posted a job on JobPortal AI.
      </p>
    </div>
  </div>
</body>
</html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": employer_email, "name": employer_name or "Employer"}],
        sender={"email": "karkibigyan05@gmail.com", "name": "JobPortal AI"},
        subject=f"Application withdrawn — {job_title}",
        html_content=html_content,
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Withdrawal email sent to {employer_email}")
        return True
    except Exception as e:
        print(f"Failed to send withdrawal email: {e}")
        return False