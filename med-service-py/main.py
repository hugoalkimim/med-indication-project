from db.mongo_client import insert_mapping, insert_program
from core.map_icd10 import load_icd10_from_txt, map_conditions_to_icd10
from core.parse_eligibility import parse_copay_program
from core.extract_indications import get_med_page_url, extract_indications_section
from core.ai_condition_extraction import extract_conditions_with_gpt
from typing import List, Dict
import json


def enrich_with_description(mappings: List[Dict[str, str]], icd10_codes: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Add ICD-10 descriptions to the mapped conditions."""
    lookup = {entry["code"]: entry["description"] for entry in icd10_codes}
    for mapping in mappings:
        raw_code = mapping["icd10"].replace(".", "")
        mapping["description"] = lookup.get(raw_code, "Not Found")
    return mappings


if __name__ == "__main__":
    print("Loading ICD-10 codes...")
    icd10_codes = load_icd10_from_txt("./data/icd10cm-codes-April-2025.txt")
    print(f"Loaded {len(icd10_codes)} ICD-10 codes")

    med_name = "Dupixent"
    med_page_url = get_med_page_url(med_name)
    indications = extract_indications_section(med_page_url)
    print(f"INDICATIONS AND USAGE for {med_name}:\n\n{indications}")

    conditions = extract_conditions_with_gpt(indications)
    print(f"Extracted conditions: {conditions}")

    mappings = map_conditions_to_icd10(conditions, icd10_codes)
    mappings = enrich_with_description(mappings, icd10_codes)

    document = {
        "drug": med_name.lower(),
        "indications": [
            { "condition": m["condition"], "icd10": m["icd10"] }
            for m in mappings
        ]
    }

    print(f"Inserting combined document:\n{json.dumps(document, indent=2)}")
    insert_mapping(document)
