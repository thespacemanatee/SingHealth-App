from selenium import webdriver
from random import choice, randint
import time

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/Auth')
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='email']").send_keys("caocao@gmail.com")
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='password']").send_keys("bts")
    time.sleep(1)
    links = driver.find_elements_by_xpath('//div[text()="Login"]')
    links[-1].click()
    driver.get('http://localhost:19006/StaffNavigator/AddTenantNavigator/ManageTenantAccounts')
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="Create Tenant Account"]').click()
    time.sleep(2)
    driver.find_element_by_xpath("//input[@type='text']").send_keys("Test")
    driver.find_element_by_xpath("//input[@type='email']").send_keys("Test@test.com")
    driver.find_element_by_xpath("//input[@type='password']").send_keys("testtest")
    driver.find_element_by_xpath('//div[text()="NEXT"]').click()
    time.sleep(2)
    links = driver.find_elements_by_xpath("//input[@type='text']")
    links[-4].send_keys("Beautiful Food")
    links[-3].send_keys("SUTD CO")
    links[-2].send_keys("SUTD")
    links[-1].send_keys("55")
    links = driver.find_elements_by_xpath("//input[@type='email']")
    links[-1].send_keys("beautifulfood@gmail.com")
    time.sleep(1)
    driver.find_element_by_xpath('//div[text()="SUBMIT"]').click()
    # todo: add successfully;
    driver.get('http://localhost:19006/StaffNavigator/StaffModalStack/StaffTabNavigator/StaffDashboardStack/StaffDashboard')
        