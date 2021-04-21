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
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="SUBMIT"]').click()
    time.sleep(1)
    Alert(driver).accept()
    time.sleep(5)
    # end of ban main test
    '''
    driver.get('http://localhost:19006/StaffNavigator/StaffModalStack/StaffTabNavigator/StaffDashboardStack/StaffDashboard')
    links = driver.find_elements_by_xpath("//div[contains(@class, 'css-cursor-18t94o4') and contains(@class, 'css-view-1dbjc4n') and contains(@class, 'r-borderRadius-a1yn9n') and contains(@class, 'r-cursor-1loqt21') and contains(@class, 'r-overflow-1udh08x') and contains(@class, 'r-position-bnwqim')]")
    links[0].click()
    time.sleep(2)
    links = driver.find_elements_by_xpath('//div[text()="BAN MAIN FISH SOUP"]')
    links[-1].click()
    time.sleep(2)
    #class="css-view-1dbjc4n r-alignItems-1awozwy r-cursor-1loqt21 r-flexDirection-18u37iz r-outlineWidth-10paoce r-touchAction-1otgn73 r-transitionProperty-1i6wzkk r-userSelect-lrvibr"
    links = driver.find_elements_by_xpath("//div[contains(@class, 'css-view-1dbjc4n') and contains(@class, 'r-alignItems-1awozwy') and contains(@class, 'r-cursor-1loqt21') and contains(@class, 'r-flexDirection-18u37iz') and contains(@class, 'r-outlineWidth-10paoce') and contains(@class, 'r-touchAction-1otgn73') and contains(@class, 'r-transitionProperty-1i6wzkk') and contains(@class, 'r-userSelect-lrvibr')]")
    links[-5].click()
    time.sleep(3)
    links[0].click()
    url = driver.current_url
    driver.find_element_by_xpath('//div[text()="Food is stored in appropriate conditions and at an appropriate temperature."]').click()
    # css-view-1dbjc4n r-cursor-1loqt21 r-outlineWidth-10paoce r-touchAction-1otgn73 r-transitionProperty-1i6wzkk r-userSelect-lrvibr
    links2 = driver.find_elements_by_xpath("//div[contains(@class, 'css-view-1dbjc4n') and contains(@class, 'r-cursor-1loqt21') and contains(@class, 'r-outlineWidth-10paoce') and contains(@class, ' r-touchAction-1otgn73') and contains(@class, 'r-transitionProperty-1i6wzkk') and contains(@class, 'r-userSelect-lrvibr')]")
    links2[-6].click()
    handle_upload_file_dialog("test.bmp")
    time.sleep(5)
    driver.find_element_by_xpath("//textarea").send_keys("test")
    #css-view-1dbjc4n r-cursor-1loqt21 r-outlineWidth-10paoce r-touchAction-1otgn73 r-transitionProperty-1i6wzkk r-userSelect-lrvibr
    time.sleep(2)
    driver.find_element_by_xpath('//div[text()="Details"]').click()
    time.sleep(3)
    driver.get(url)
    time.sleep(3)
    driver.find_element_by_xpath('//div[text()="SUBMIT"]').click()
    time.sleep(1)
    Alert(driver).accept()
    time.sleep(10)
    #end of second test
'''
