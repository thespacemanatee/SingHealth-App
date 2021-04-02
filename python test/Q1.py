from selenium import webdriver
from random import choice

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('https://istd.sutd.edu.sg/')
    links = driver.find_elements_by_xpath("//a[@href]")
    while (links):
        random_link = choice(links)
        print(random_link.get_attribute("href"))
        driver.get(random_link.get_attribute("href"))
        links = driver.find_elements_by_xpath("//a[@href]")
    driver.close()