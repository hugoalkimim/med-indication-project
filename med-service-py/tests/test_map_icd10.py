import pytest
from core.map_icd10 import load_icd10_from_txt, map_conditions_to_icd10

@pytest.mark.map_icd10
def test_load_icd10_from_txt():
    """Loads ICD-10 codes from a text file into a list of dicts."""
    icd10_codes = load_icd10_from_txt("tests/fixtures/icd10-codes.txt")
    assert len(icd10_codes) == 4
    assert icd10_codes[0] == {"code": "Z98891", "description": "History of uterine scar from previous surgery"}
    assert icd10_codes[1] == {"code": "Z990", "description": "Dependence on aspirator"}
    assert icd10_codes[2] == {"code": "Z9911", "description": "Dependence on respirator [ventilator] status"}
    assert icd10_codes[3] == {"code": "Z9912", "description": "Encounter for respirator [ventilator] dependence during power failure"}
    

@pytest.mark.map_icd10
def test_map_conditions_to_icd10_exact_match():
    """Returns exact match if condition exactly matches ICD-10 description."""
    icd10 = [{"code": "A123", "description": "asthma"}]
    conditions = ["asthma"]
    result = map_conditions_to_icd10(conditions, icd10)
    assert result == [{'condition': 'asthma', 'icd10': 'A123'}]


@pytest.mark.map_icd10
def test_map_conditions_to_icd10_fuzzy_match():
    """
    Finds best fuzzy match above the threshold and returns formatted ICD-10.
    """
    icd10 = [
        {"code": "Q062", "description": "Diastematomyelia"},
        {"code": "R7303", "description": "Prediabetes"},
        {"code": "H5703", "description": "Miosis"}
    ]
    conditions = ["asthmatic", "diabetic", "sinus"]
    result = map_conditions_to_icd10(conditions, icd10, similarity_threshold=0.5)

    assert {'condition': 'asthmatic', 'icd10': 'Q062'} in result
    assert {'condition': 'diabetic', 'icd10': 'R7303'} in result
    assert {'condition': 'sinus', 'icd10': 'H5703'} in result


@pytest.mark.map_icd10
def test_map_conditions_to_icd10_no_match_below_threshold():
    """
    Sets ICD-10 to 'Not Found' if no match is found above the similarity threshold.
    """
    icd10 = [{"code": "Z999", "description": "random unrelated condition that should not match"}]
    conditions = ["completely different term"]
    result = map_conditions_to_icd10(conditions, icd10, similarity_threshold=0.9)
    assert result == [{'condition': 'completely different term', 'icd10': 'Not Found'}]
    