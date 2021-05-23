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

def login_as_staff():
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
    time.sleep(8)

def login_as_tenant():
    driver.find_element_by_xpath('//div[text()="Login"]').click()
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='email']").send_keys("cheekit.chong98@outlook.com")
    time.sleep(1)
    driver.find_element_by_xpath("//input[@type='password']").send_keys("btsbtsbts")
    time.sleep(1)
    links = driver.find_elements_by_xpath('//div[text()="LOGIN"]')
    links[-1].click()
    time.sleep(8)


if __name__ == "__main__":
    
    #staff add NC
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    login_as_staff()
    driver.get('https://esc-group-10.netlify.app/staff/new-audit')
    time.sleep(2)
    driver.find_element_by_xpath('//div[text()="SUTD"]').click()
    time.sleep(1)
    links = driver.find_elements_by_xpath("//div[contains(@class, 'css-1dbjc4n') and contains(@class, 'r-1awozwy') and contains(@class, 'r-z80fyv')and contains(@class, 'r-1777fci')and contains(@class, 'r-19wmn03')]")
    links[-1].click()
    time.sleep(1)
    links[0].click()
    url = driver.current_url
    driver.find_element_by_xpath('//div[text()="Adequate and regular pest control. Pest control record."]').click()
    time.sleep(3)
    links2 = driver.find_elements_by_xpath("//div/div[1]/div[3]/div[2]/div")
    driver.find_element_by_xpath("//textarea").send_keys("test")
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="Details"]').click()
    driver.back()
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="SUBMIT"]').click()
    time.sleep(1)
    Alert(driver).accept()
    time.sleep(10)
    driver.close()
    #end of staff add NC

    #start of tenant REC
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    login_as_tenant()
    links = driver.find_elements_by_xpath('//div[@tabindex="0"]')
    links[-9].click()
    #links[-9].click()
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="Adequate and regular pest control. Pest control record."]').click()
    driver.find_element_by_xpath('//div[text()="RECTIFY NOW"]').click()
    time.sleep(3)
    driver.find_element_by_xpath("//textarea").send_keys("test")
    driver.find_element_by_xpath('//div[text()="SUBMIT FOR APPROVAL"]').click()
    time.sleep(3)
    driver.close()
    #end of tenant REC

    #start of Staff verification
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    login_as_staff()
    links = driver.find_elements_by_xpath('//div[text()="SUTD"]')
    links[-1].click()
    time.sleep(3)
    driver.find_elements_by_xpath('//div[text()="CHECK STATUS"]').click()
    time.sleep(3)
    driver.find_elements_by_xpath('//div[text()="APPROVE"]').click()
    time.sleep(1)
    Alert(driver).accept()
    #end of Staff verification