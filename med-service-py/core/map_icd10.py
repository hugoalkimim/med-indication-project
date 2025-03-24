from typing import List, Dict
import difflib

def load_icd10_from_txt(path: str) -> List[Dict[str, str]]:
    """
    Load ICD-10-CM codes from a space-separated .txt file.

    Each line is expected to be: CODE DESCRIPTION
    e.g. A011    Paratyphoid fever A
    """
    codes = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(maxsplit=1)
            if len(parts) == 2:
                code, description = parts
                codes.append({"code": code, "description": description})
    return codes


def map_conditions_to_icd10(
    conditions: List[str],
    icd10_codes: List[Dict[str, str]],
    similarity_threshold: float = 0.75
) -> List[Dict[str, str]]:
    """
    Fuzzy match each condition to an ICD-10 description and return the best matches.

    Args:
        conditions: list of condition strings (e.g., ['asthma'])
        icd10_codes: list of ICD-10 code dicts with 'code' and 'description'
        similarity_threshold: minimum match ratio to accept a match

    Returns:
        List of dicts: { condition, icd10 }
    """
    mappings = []

    for condition in conditions:
        best_match = None
        best_score = 0.0

        for entry in icd10_codes:
            description = entry["description"].lower()
            score = difflib.SequenceMatcher(None, condition.lower(), description).ratio()
            
            if condition.lower() in description or description in condition.lower():
                score += 0.2

            if score > best_score:
                best_score = score
                best_match = entry
        
        if best_match and best_score >= similarity_threshold:
            mappings.append({
                "condition": condition,
                "icd10": best_match["code"],
            })
        else:
            mappings.append({
                "condition": condition,
                "icd10": "Not Found",
            })

    return mappings

if __name__ == "__main__":
    print("Loading ICD-10 codes...")
    icd10_codes = load_icd10_from_txt("../data/icd10cm-codes-April-2025.txt")
    print(f"Loaded {len(icd10_codes)} ICD-10 codes")
    conditions = ["asthma", "diabetes", "hypertension", "hyperlipidemia", "anemia"]
    mappings = map_conditions_to_icd10(conditions, icd10_codes,  similarity_threshold=0.5)
    print(mappings)
    for mapping in mappings:
        print(f"{mapping['condition']} -> {mapping['icd10']}")