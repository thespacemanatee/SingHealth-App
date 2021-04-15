from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from random import choice, randint
import win32com.client as comclt
import win32gui
import win32con
import time

def handle_upload_file_dialog(file_path):
    sleep = 1
    windowsShell = comclt.Dispatch("WScript.Shell")
    time.sleep(sleep)
    windowsShell.SendKeys(file_path)
    time.sleep(sleep)
    windowsShell.SendKeys("{TAB}{TAB}")
    time.sleep(sleep)
    windowsShell.SendKeys("{ENTER}{ENTER}")

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/Auth')
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='email']").send_keys("cheekit.chong98@gmail.com")
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='password']").send_keys("bts")
    time.sleep(1)
    driver.find_element_by_xpath('//div[text()="Login as Tenant"]').click()
    time.sleep(1)
    links = driver.find_elements_by_xpath('//div[text()="LOGIN"]')
    links[-1].click()
    time.sleep(10)
    driver.get('http://localhost:19006/manage-tenants/create')
    time.sleep(3)
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