from selenium import webdriver
import requests
import re


def check_title(hyper_link):
    print(f"checking link: {hyper_link}")
    try:
        raw_html = requests.get(hyper_link).text
        match = re.search('<title>(.*?)</title>', raw_html)
        title = match.group(1) if match else None
        print(title)
        if title is not None:
            return True
        else:
            return False
    except:
        return False


if __name__ == "__main__":
    driver = webdriver.Chrome()

    try:
        driver.get(
            'C:\\ps3\\index.html'
        )
        links = driver.find_elements_by_xpath("//a[@href]")
        count = 0
        for link in links:
            print(link.get_attribute("href"))
            print(link)
            count += check_title(link.get_attribute("href"))

        print(
            f'RESULT: {count}/{len(links)} links have titles'
        )
    except:
        pass
    finally:
        driver.close()