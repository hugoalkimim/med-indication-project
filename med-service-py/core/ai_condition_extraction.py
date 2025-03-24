from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def extract_conditions_with_gpt(indication_text: str) -> list:
    """
    Extracts medical conditions from the INDICATIONS AND USAGE section of a drug label using GPT-4o.
    """
    
    prompt = f"""
    Here is the INDICATIONS AND USAGE section of a drug label:

    {indication_text}

    Return a comma-separated list of diseases this drug treats.
    Use standard medical terms (e.g. use 'hypertension' instead of 'high blood pressure').
    Do NOT include duplicates or symptoms.
    Do NOT include any information that is not a medical condition. If there are no conditions, return ''.
    """

    response = client.responses.create(
        model="gpt-4o",
        instructions="You are a medical assistant extracting medical conditions from drug label text.",
        input=prompt,
    )

    content = response.output_text
    conditions = content.split(",")
    conditions = [condition.strip() for condition in conditions if condition.strip() != ""]
    return conditions
