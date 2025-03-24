from fastapi import FastAPI
from pydantic import BaseModel
from core.map_icd10 import load_icd10_from_txt, map_conditions_to_icd10
from core.extract_indications import get_med_page_url, extract_indications_section
from core.parse_eligibility import parse_copay_program

app = FastAPI()

class MappingRequest(BaseModel):
    conditions: list[str]

@app.post("/map")
def map_conditions(request: MappingRequest):
    icd10 = load_icd10_from_txt("data/icd10cm-codes-April-2025.txt")
    mappings = map_conditions_to_icd10(request.conditions, icd10)
    return {"mappings": mappings}

@app.get("/indications/{med_name}")
def extract_indications(med_name: str):
    med_url = get_med_page_url(med_name)
    indications = extract_indications_section(med_url)
    return {"indications": indications}

@app.post("/parse")
def parse_program(raw: dict):
    parsed = parse_copay_program(raw)
    print(f"parsed: {parsed}")
    return parsed
    

