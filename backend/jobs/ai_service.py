from google import genai
from google.genai import types
import PyPDF2
import os
import json
import urllib.request
import tempfile

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

def get_resume_path(resume_field):
    """Handle both Cloudinary URLs and local file paths"""
    resume_url = str(resume_field)
    if resume_url.startswith('http'):
        # Download from Cloudinary to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            urllib.request.urlretrieve(resume_url, tmp.name)
            return tmp.name
    else:
        # Local file path
        from django.conf import settings
        import os
        return os.path.join(settings.MEDIA_ROOT, resume_url)
    
def extract_text_from_pdf(resume_file_path):
    """Extract plain text from a PDF resume file"""
    text = ''
    try:
        with open(resume_file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ''
    except Exception as e:
        print(f'PDF extraction error: {e}')
    return text.strip()


def extract_contact_info(resume_text):
    """Ask Gemini to extract name, email and phone from resume text"""
    prompt = f"""
Extract the candidate's contact information from this resume. Return ONLY raw JSON, no markdown.

RESUME:
{resume_text[:2000]}

Return ONLY this JSON:
{{
    "name": "<full name or empty string>",
    "email": "<email address or empty string>",
    "phone": "<phone number or empty string>"
}}
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
            ),
        )
        result = json.loads(response.text.strip())
        print(f"Extracted contact: {result}")
        return result
    except Exception as e:
        print(f"Contact extraction error: {e}")
        return {'name': '', 'email': '', 'phone': ''}


def analyze_resume(resume_file_path, job_title, job_description, job_requirements, user_name='', user_email='', user_phone=''):
    """
    Send resume + job info to Gemini and get back:
    - match score (0-100)
    - matching skills
    - missing skills
    - cover letter
    """

    actual_path = get_resume_path(resume_file_path)
    resume_text = extract_text_from_pdf(actual_path)
    
    if not resume_text:
        print('No text extracted from PDF')
        return None

    # always extract from resume first
    contact = extract_contact_info(resume_text)
    print(f"Extracted contact: {contact}")

    # profile fields take priority — fall back to extracted if empty
    final_name = user_name.strip() if user_name and user_name.strip() else contact.get('name', '')
    final_email = user_email.strip() if user_email and user_email.strip() else contact.get('email', '')
    final_phone = user_phone.strip() if user_phone and user_phone.strip() else contact.get('phone', '')

    print(f"Sign-off — Name: {final_name}, Email: {final_email}, Phone: {final_phone}")

    prompt = f"""
You are an expert HR assistant and career coach. Analyze the resume against the job posting below and return a JSON response only — no extra text, no markdown, just raw JSON.

JOB TITLE: {job_title}

JOB DESCRIPTION:
{job_description}

JOB REQUIREMENTS:
{job_requirements}

CANDIDATE RESUME:
{resume_text}

CRITICAL INSTRUCTION: The cover letter MUST end exactly like this — do not change the name, email or phone:

Yours sincerely,

{final_name}
{final_email}
{final_phone}

Return ONLY this JSON structure:
{{
    "match_score": <integer 0-100>,
    "matching_skills": [<list of skills the candidate has that match the job>],
    "missing_skills": [<list of skills required but missing from the resume>],
    "cover_letter": "<3-4 paragraph professional cover letter ending with exactly: Yours sincerely,\\n\\n{final_name}\\n{final_email}\\n{final_phone}>"
}}
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
            ),
        )

        raw = response.text.strip()
        print(f'Gemini raw response: {raw[:200]}')

        result = json.loads(raw)

        # force correct sign-off even if Gemini ignores the instruction
        cover_letter = result.get('cover_letter', '')
        if final_name and 'Yours sincerely' in cover_letter:
            # remove everything after "Yours sincerely," and replace with our sign-off
            parts = cover_letter.split('Yours sincerely')
            cover_letter = parts[0] + f"Yours sincerely,\n\n{final_name}\n{final_email}\n{final_phone}"
            result['cover_letter'] = cover_letter

        print(f'Match score: {result.get("match_score")}')
        return result

    except Exception as e:
        print(f'Gemini error: {e}')
        return None