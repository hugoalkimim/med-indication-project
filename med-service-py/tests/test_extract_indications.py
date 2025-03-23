import pytest
from unittest.mock import patch, Mock
from urllib.parse import urljoin

from core.extract_indications import get_med_page_url, extract_indications_section, BASE_URL

@pytest.fixture
def mock_session_get():
    with patch('requests.Session.get') as mock_get:
        yield mock_get

@pytest.fixture
def mock_requests_get():
    with patch('requests.get') as mock_get:
        yield mock_get

@pytest.mark.web_scraping
def test_get_med_page_url_redirect(mock_session_get):
    """
    Should return the redirected med info URL when search goes directly to a med page.
    """ 
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=123"
    mock_response.text = ""
    mock_session_get.return_value = mock_response

    url = get_med_page_url("minoxidil")
    assert "setid=123" in url

@pytest.mark.web_scraping
def test_get_med_page_url_from_search(mock_session_get):
    """
    Should extract the correct med page URL from the search result HTML.
    """
    html = """
    <html>
        <body>
            <a class="drug-info-link" href="/dailymed/drugInfo.cfm?setid=456">Minoxidil</a>
        </body>
    </html>
    """
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=minoxidil"
    mock_response.text = html
    mock_session_get.return_value = mock_response

    url = get_med_page_url("minoxidil")
    assert url == urljoin(BASE_URL, "/dailymed/drugInfo.cfm?setid=456")

@pytest.mark.web_scraping
def test_get_med_page_url_not_found(mock_session_get):
    """
    Should raise an exception if no med-info link is found in the search result.
    """
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=notfound"
    mock_response.text = "<html><body>No results</body></html>"
    mock_session_get.return_value = mock_response

    with pytest.raises(Exception, match="No matching med found"):
        get_med_page_url("notfound")

@pytest.mark.web_scraping
def test_extract_indications_section_found(mock_requests_get):
    """
    Should extract and return the text from the INDICATIONS AND USAGE section if found.
    """
    html = """
    <div class='drug-label-sections'>
        <ul>
            <li>
                <a>INDICATIONS AND USAGE</a>
                <div>Use to treat something.</div>
            </li>
        </ul>
    </div>
    """
    mock_response = Mock()
    mock_response.text = html
    mock_requests_get.return_value = mock_response

    result = extract_indications_section("http://example.com")
    assert "Use to treat something." in result

@pytest.mark.web_scraping
def test_extract_indications_section_not_found(mock_requests_get):
    """
    Should return a default message when INDICATIONS section is not present.
    """
    html = "<div class='drug-label-sections'><ul><li><a>WARNINGS</a><div>Be careful.</div></li></ul></div>"
    mock_response = Mock()
    mock_response.text = html
    mock_requests_get.return_value = mock_response

    result = extract_indications_section("http://example.com")
    assert result == "INDICATIONS AND USAGE section not found"

@pytest.mark.web_scraping
def test_get_med_page_url_empty_input(mock_session_get):
    """Should still attempt a request even if med_name is empty (not ideal, but test behavior)."""
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query="
    mock_response.text = "<html><body></body></html>"
    mock_session_get.return_value = mock_response

    with pytest.raises(Exception, match="No matching med found"):
        get_med_page_url("")


@pytest.mark.web_scraping
def test_get_med_page_url_special_characters(mock_session_get):
    """Should correctly handle meds names with special characters."""
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tylenol%2Bextra%26strong"
    mock_response.text = """
    <html>
        <body>
            <a class="drug-info-link" href="/dailymed/drugInfo.cfm?setid=789">Tylenol Extra</a>
        </body>
    </html>
    """
    mock_session_get.return_value = mock_response

    url = get_med_page_url("tylenol+extra&strong")
    assert "setid=789" in url


@pytest.mark.web_scraping
def test_get_med_page_url_multiple_links(mock_session_get):
    """Should pick the first .drug-info-link if multiple are present."""
    mock_response = Mock()
    mock_response.url = "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=minoxidil"
    mock_response.text = """
    <html>
        <body>
            <a class="drug-info-link" href="/dailymed/drugInfo.cfm?setid=111">First</a>
            <a class="drug-info-link" href="/dailymed/drugInfo.cfm?setid=222">Second</a>
        </body>
    </html>
    """
    mock_session_get.return_value = mock_response

    url = get_med_page_url("minoxidil")
    assert url.endswith("setid=111")
