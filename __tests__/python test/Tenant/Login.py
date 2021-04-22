from selenium import webdriver
from random import choice, randint
import time

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='email']").send_keys("cheekit.chong98@outlook.com")
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='password']").send_keys("btsbtsbts")
    time.sleep(1)
    links = driver.find_elements_by_xpath('//div[text()="LOGIN"]')
    links[-1].click()
    