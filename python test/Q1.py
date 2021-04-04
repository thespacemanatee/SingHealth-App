from selenium import webdriver
from random import choice, randint
import time

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/')
    while True:
        links = driver.find_element_by_xpath('//div[text()="Login"]')
        links.click()
        print(links)
        #for i in range(0,len(links)-1):
        #    links[i].click()
        

