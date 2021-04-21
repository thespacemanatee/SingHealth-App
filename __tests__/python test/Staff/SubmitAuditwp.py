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
    time.sleep(8)

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('https://esc-group-10.netlify.app/')
    login()
    # ban mian test
    #class="css-cursor-18t94o4 css-view-1dbjc4n r-borderRadius-a1yn9n r-cursor-1loqt21 r-overflow-1udh08x r-position-bnwqim""
    driver.get('https://esc-group-10.netlify.app/staff/new-audit')
    time.sleep(2)
    driver.find_element_by_xpath('//div[text()="SUTD"]').click()
    time.sleep(1)
    #css-1dbjc4n r-1awozwy r-z80fyv r-1777fci r-19wmn03
    links = driver.find_elements_by_xpath("//div[contains(@class, 'css-1dbjc4n') and contains(@class, 'r-1awozwy') and contains(@class, 'r-z80fyv')and contains(@class, 'r-1777fci')and contains(@class, 'r-19wmn03')]")
    links[-1].click()
    time.sleep(1)
    links[0].click()
    url = driver.current_url
    driver.find_element_by_xpath('//div[text()="Adequate and regular pest control. Pest control record."]').click()
    time.sleep(3)
    links2 = driver.find_elements_by_xpath("//div/div[1]/div[3]/div[2]/div")
    #links2[5].click()

    #handle_upload_file_dialog("test.bmp")
    #time.sleep(5)
    driver.find_element_by_xpath("//textarea").send_keys("test")
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="Details"]').click()
    # css-1dbjc4n r-1loqt21 r-1ybube5 r-10paoce r-1otgn73 r-1i6wzkk r-lrvibr
    driver.back()
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="SUBMIT"]').click()
    time.sleep(1)
    Alert(driver).accept()
    time.sleep(10)
    #end of second test