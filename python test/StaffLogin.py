from selenium import webdriver
from random import choice, randint
import time

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/')
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='email']").send_keys("12345678@gmail.com")
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='password']").send_keys("12345678")
    time.sleep(1)
    driver.find_element_by_xpath('//div[text()="Login as Tenant"]').click()
    time.sleep(1)
    links = driver.find_elements_by_xpath('//div[text()="Login"]')
    links[-1].click()
    links = driver.find_elements_by_xpath('//div[text()="+"]')
    links[-1].click()
     
        