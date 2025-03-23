from typing import Any, Dict
import json

def parse_copay_program(raw: dict) -> dict:
    return {
        "program_name": raw.get("ProgramName"),
        "coverage_eligibilities": raw.get("CoverageEligibilities", []),
        "program_type": raw.get("AssistanceType", "Coupon"),
        "requirements": [
            {"name": "us_residency", "value": "true"},
            {"name": "minimum_age", "value": "18"},
            {"name": "insurance_coverage", "value": "true"},
            {"name": "eligibility_length", "value": "12m"},
        ],
        "benefits": [
            {
                "name": "max_annual_savings",
                "value": raw.get("AnnualMax", "$0").replace("$", ""),
            },
            {
                "name": "min_out_of_pocket",
                "value": "0.00",
            },
        ],
        "forms": [
            {
                "name": "Enrollment Form",
                "link": raw.get("EnrollmentURL") or raw.get("ProgramURL"),
            }
        ],
        "funding": {
            "evergreen": str(raw.get("OfferRenewable", False)).lower(),
            # TODO: Implement actual funding level extraction
            "current_funding_level": "Data Not Available",
        },
        "details": [
            {
                "eligibility": raw.get("EligibilityDetails"),
                "program": raw.get("ProgramDetails", "").split("\n")[0],
                "renewal": raw.get("AddRenewalDetails"),
                "income": "Not required" if not raw.get("IncomeReq") else "Required",
            }
        ],
    }
    
if __name__ == "__main__":
    with open("../data/dupixent_sample.json") as f:
        raw = json.load(f)
        print(json.dumps(parse_copay_program(raw), indent=2))