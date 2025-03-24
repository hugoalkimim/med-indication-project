from db.mongo_client import insert_mapping
from core.map_icd10 import load_icd10_from_txt, map_conditions_to_icd10
from typing import List, Dict

if __name__ == "__main__":
    print("Loading ICD-10 codes...")
    icd10_codes = load_icd10_from_txt("./data/icd10cm-codes-April-2025.txt")
    print(f"Loaded {len(icd10_codes)} ICD-10 codes")
    conditions = ["asthma", "diabetes", "hypertension", "hyperlipidemia", "anemia"]
    mappings = map_conditions_to_icd10(conditions, icd10_codes,  similarity_threshold=0.5)
    print(mappings)
    insert_mapping(mappings[0])
    for mapping in mappings:
        print(f"{mapping['condition']} -> {mapping['icd10']}")