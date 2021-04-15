from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from random import choice, randint
import time
import random

def fuzz_test(email, password):
    driver.get('http://localhost:19006/Auth')
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    driver.find_element_by_xpath("//input[@type='email']").send_keys(email)
    driver.find_element_by_xpath("//input[@type='password']").send_keys(password)
    driver.find_element_by_xpath('//div[text()="Login as Tenant"]').click()
    links = driver.find_elements_by_xpath('//div[text()="LOGIN"]')
    links[-1].click()

    if driver.current_url == "http://localhost:19006/StaffNavigator/StaffModalStack/StaffTabNavigator/StaffDashboardStack/StaffDashboard":
        return True
    return False

def fuzzer(max_length=10, char_start=33, char_range=96):
    string_length = random.randrange(0, max_length + 1)
    out = ""
    for i in range(0, string_length):
        out += chr(random.randrange(char_start, char_start + char_range))
    return out

if __name__ == "__main__":
    driver = webdriver.Chrome()
    while True:
        email = fuzzer(20,33,96)
        password = fuzzer(20,33,96)
        if(fuzz_test(email, password)):
            print(email,password)
            break
    
    
    