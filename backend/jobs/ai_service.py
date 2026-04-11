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
    print(f"get_resume_path called with: {resume_url}")
    
    if resume_url.startswith('http'):
        try:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            print(f"Downloading from: {resume_url}")
            urllib.request.urlretrieve(resume_url, tmp.name)
            tmp.close()
            print(f"Downloaded to: {tmp.name}")
            return tmp.name
        except Exception as e:
            print(f"Failed to download resume: {e}")
            return None
    else:
        from django.conf import settings
        path = os.path.join(settings.MEDIA_ROOT, resume_url)
        print(f"Local path: {path}")
        return path


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
    if not actual_path:
        print('Could not get resume path')
        return None
    resume_text = extract_text_from_pdf(actual_path)

    if not resume_text:
        print('No text extracted from PDF')
        return None

    contact = extract_contact_info(resume_text)
    print(f"Extracted contact: {contact}")

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

        cover_letter = result.get('cover_letter', '')
        if final_name and 'Yours sincerely' in cover_letter:
            parts = cover_letter.split('Yours sincerely')
            cover_letter = parts[0] + f"Yours sincerely,\n\n{final_name}\n{final_email}\n{final_phone}"
            result['cover_letter'] = cover_letter

        print(f'Match score: {result.get("match_score")}')
        return result

    except Exception as e:
        print(f'Gemini error: {e}')
        return None

def suggest_resume_improvements(resume_file_path, missing_skills, job_title):
    """
    Send resume + missing skills to Gemini and get specific suggestions
    on how to incorporate those skills into the resume
    """
    actual_path = get_resume_path(resume_file_path)
    if not actual_path:
        print('Could not get resume path')
        return None

    resume_text = extract_text_from_pdf(actual_path)
    if not resume_text:
        print('No text extracted from PDF')
        return None

    missing_skills_str = ', '.join(missing_skills) if isinstance(missing_skills, list) else missing_skills

    prompt = f"""
You are an expert resume writer, career coach, and HR specialist. A candidate is applying for a {job_title} role.

Their resume is missing these skills: {missing_skills_str}

Here is their current resume:
{resume_text}

For each missing skill, provide a specific, actionable suggestion on how to add it to their resume.
Consider their existing experience and suggest where exactly it would fit naturally.

Return ONLY raw JSON, no markdown:
{{
    "suggestions": [
        {{
            "skill": "<missing skill name>",
            "where_to_add": "<which section of their resume, e.g. Skills, Work Experience at Company X>",
            "suggested_text": "<exact bullet point or sentence they can copy-paste>",
            "tip": "<brief explanation of why this helps>"
        }}
    ],
    "general_tips": "<2-3 sentences of general advice for this candidate>"
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
        print(f'Resume suggestions response: {raw[:200]}')
        return json.loads(raw)
    except Exception as e:
        print(f'Resume suggestions error: {e}')
        return None