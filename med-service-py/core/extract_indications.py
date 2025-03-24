import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://dailymed.nlm.nih.gov"

def get_med_page_url(med_name: str) -> str:
    query = med_name.replace(' ', '+')
    search_url = f"{BASE_URL}/dailymed/search.cfm?labeltype=all&query={query}"

    session = requests.Session()
    resp = session.get(search_url, allow_redirects=True)

    if 'drugInfo.cfm' in resp.url and 'setid=' in resp.url:
        print(f"Redirected to {resp.url}")
        return resp.url

    soup = BeautifulSoup(resp.text, 'html.parser')
    link = soup.select_one('a.drug-info-link')
    if not link:
        raise Exception("No matching med found")
    
    href = link['href']
    return urljoin(BASE_URL, href)

def extract_indications_section(med_url: str) -> str:
    resp = requests.get(med_url)
    soup = BeautifulSoup(resp.text, 'html.parser')

    container = soup.find('div', class_='drug-label-sections')
    if not container:
        raise Exception("Could not find drug-label-sections container")

    ul = container.find('ul', recursive=False)
    if not ul:
        raise Exception("Could not find top-level <ul>")

    for li in ul.find_all('li', recursive=False):
        link = li.find('a')
        if link and ("INDICATIONS AND USAGE" in link.get_text(strip=True).upper() or "INDICATIONS" in link.get_text(strip=True).upper()):
            divs = li.find_all('div', recursive=False)
            content_div = divs[-1]
            return content_div.get_text(separator='\n', strip=True)

    return "INDICATIONS AND USAGE section not found"
