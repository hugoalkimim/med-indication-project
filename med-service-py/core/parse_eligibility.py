from typing import Any, Dict
import json
import re
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def extract_list_with_gpt(text: str, list_type: str) -> list:
    prompt = f"""
You are a helpful assistant that extracts structured data from patient assistance program descriptions.
Given the following text:

{text}

Extract a list of {list_type}. Each item should be a dictionary with 'name' and 'value' keys. Return a JSON array.
"""

    response = client.responses.create(
        model="gpt-4o",
        instructions="You are a medical assistant extracting structured information from program descriptions.",
        input=prompt,
    )
    
    print("GPT response:", response.output_text)
    try:
        text = response.output_text
        clean_text = text.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean_text)
    except Exception as e:
        print("GPT parsing error:", e)
        return []

def extract_savings(raw_value: str) -> str:
    return raw_value.replace("$", "").replace(",", "") if raw_value else "0.00"

def extract_eligibility(text: str) -> str:
    lines = text.split("\n")
    filtered = [
        line.strip("- ") for line in lines
        if "insurance" in line.lower() or "resident" in line.lower()
    ]
    return " and ".join(filtered) if filtered else "Not specified"

def extract_program_details(text: str) -> str:
    for line in text.split("\n"):
        if "$0" in line:
            return line.strip("- ")
    return "Not specified"

def extract_renewal(text: str) -> str:
    match = re.search(r"automatically re-enrolled.*?January 1st.*?\.?", text, re.IGNORECASE)
    return match.group(0).strip() if match else text.strip()

def parse_copay_program(raw: dict) -> dict:
    eligibility_text = raw.get("EligibilityDetails", "")
    program_details_text = raw.get("ProgramDetails", "")

    return {
        "program_name": raw.get("ProgramName"),
        "coverage_eligibilities": raw.get("CoverageEligibilities", []),
        "program_type": raw.get("AssistanceType", "Coupon"),
        "requirements": extract_list_with_gpt(eligibility_text, "requirements"),
        "benefits": extract_list_with_gpt(program_details_text, "benefits"),
        "forms": [
            {
                "name": "Enrollment Form",
                "link": raw.get("EnrollmentURL") or raw.get("ProgramURL"),
            }
        ],
        "funding": {
            "evergreen": str(raw.get("OfferRenewable", False)).lower(),
            "current_funding_level": "Data Not Available",
        },
        "details": [
            {
                "eligibility": extract_eligibility(eligibility_text),
                "program": extract_program_details(program_details_text),
                "renewal": extract_renewal(raw.get("AddRenewalDetails", "")),
                "income": "Not required" if not raw.get("IncomeReq") else "Required",
            }
        ]
    }