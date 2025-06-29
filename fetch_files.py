import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

URL = "https://www.eurex.com/ex-en/data/trading-files/t7-entry-service-parameters"

#save .csv files to data_files
DOWNLOAD_FOLDER = "data_files"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def get_full_csv_url():
    response = requests.get(URL, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    #print(soup)
    
    csv_links = []

    for link in soup.find_all("a", href=True):
        href = link["href"]
        if "Hist_T7_TES_Time_and_Sales" in href and href.endswith(".csv"):
            full_url = urljoin(URL, href)
            #print(full_url)
            csv_links.append(full_url)
            

    return csv_links


def download_file(url):
    filename = url.split("/")[-1]
    #print(filename)
    path = os.path.join(DOWNLOAD_FOLDER, filename)

    if os.path.exists(path):
        print(f"File '{filename}' has alerady been downloaded")
        return

    print(f"Downloading: {filename}")
    

def main():
    links = get_full_csv_url()

    if not links:
        print("No .csv links found")
        return

    for url in links:
        download_file(url)
        

if __name__ == "__main__":
    main()
