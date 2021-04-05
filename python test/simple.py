from selenium import webdriver
from random import choice, randint
import time

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/StaffNavigator/StaffModalStack/StaffTabNavigator/StaffDashboardStack/StaffDashboard')
    #class="css-cursor-18t94o4 css-view-1dbjc4n r-borderRadius-a1yn9n r-cursor-1loqt21 r-overflow-1udh08x r-position-bnwqim"
    links = driver.find_elements_by_xpath("//div[contains(@class, 'css-cursor-18t94o4') and contains(@class, 'css-view-1dbjc4n') and contains(@class, 'r-borderRadius-a1yn9n') and contains(@class, 'r-cursor-1loqt21') and contains(@class, 'r-overflow-1udh08x') and contains(@class, 'r-position-bnwqim')]")
    links[2].click()