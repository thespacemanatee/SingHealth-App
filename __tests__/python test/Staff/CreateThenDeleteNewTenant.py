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

def login():
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
    time.sleep(5)

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    time.sleep(5)
    login()
    driver.get('https://esc-group-10.netlify.app/staff/manage-tenants/create')
    time.sleep(3)
    links = driver.find_elements_by_xpath("//input[@type='text']")
    links[-1].send_keys("TEST")
    links[-2].send_keys("TEST")
    driver.find_element_by_xpath("//input[@type='email']").send_keys("Test@test.com")
    driver.find_element_by_xpath("//input[@type='password']").send_keys("testtest")
    driver.find_element_by_xpath('//div[text()="CREATE ACCOUNT"]').click()
    time.sleep(2)
    driver.get('https://esc-group-10.netlify.app/staff/manage-tenants/delete')
    time.sleep(2)
    driver.find_element_by_xpath('//div[text()="Sengkang General Hospital"]').click()
    time.sleep(1)
    driver.find_element_by_xpath('//div[text()="TEST"]').click()
    time.sleep(1)
    driver.find_element_by_xpath('//div[text()="DELETE TENANT"]').click()
    time.sleep(1)
    Alert(driver).accept()
    time.sleep(3)
    driver.close()
