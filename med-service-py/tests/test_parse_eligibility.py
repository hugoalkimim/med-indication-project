import pytest
from core.parse_eligibility import parse_copay_program


@pytest.fixture
def sample_raw_json():
    return {
        "ProgramName": "Dupixent MyWay Copay Card",
        "CoverageEligibilities": ["Commercially insured"],
        "AssistanceType": "Coupon",
        "AnnualMax": "$13000.00",
        "EnrollmentURL": "https://www.dupixent.com/support-savings/copay-card",
        "OfferRenewable": True,
        "EstAppTime": None,
        "EligibilityDetails": "Patient must have commercial insurance and be a legal resident of the US",
        "ProgramDetails": "Patients may pay as little as $0 for every month of Dupixent\nSome other line",
        "AddRenewalDetails": "Automatically re-enrolled every January 1st if used within 18 months",
        "IncomeReq": False,
    }

@pytest.mark.parse_eligibility
def test_parse_copay_program_structure(sample_raw_json):
    """
    Validates correct transformation of a complete and well-formed raw JSON input.
    """
    parsed = parse_copay_program(sample_raw_json)

    assert parsed["program_name"] == "Dupixent MyWay Copay Card"
    assert parsed["coverage_eligibilities"] == ["Commercially insured"]
    assert parsed["program_type"] == "Coupon"

    assert parsed["forms"][0]["link"] == "https://www.dupixent.com/support-savings/copay-card"

    assert parsed["funding"]["evergreen"] == "true"
    assert parsed["funding"]["current_funding_level"] == "Data Not Available"

    details = parsed["details"][0]
    assert "commercial insurance" in details["eligibility"]
    assert details["program"].startswith("Patients may pay as little as $0")
    assert details["income"] == "Not required"

@pytest.mark.parse_eligibility
def test_parse_copay_program_with_missing_fields():
    """
    Ensures function handles missing or empty input fields gracefully with fallback defaults.
    """
    raw = {}
    parsed = parse_copay_program(raw)

    assert parsed["coverage_eligibilities"] == []
    assert parsed["program_type"] == "Coupon"
    assert parsed["funding"]["current_funding_level"] == "Data Not Available"
    assert parsed["details"][0]["income"] == "Not required"
