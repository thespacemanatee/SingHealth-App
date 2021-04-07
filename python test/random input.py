from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from random import choice, randint
import time
import random

def random_input():
    links = driver.find_element_by_xpath("//input[@type='text']")
    links.append(driver.find_element_by_xpath("//input[@type='email']"))
    links.append(driver.find_element_by_xpath("//input[@type='password']"))
    for i in links:
        i.send_keys(fuzzer())
    

def fuzzer(max_length=10, char_start=33, char_range=96):
    string_length = random.randrange(0, max_length + 1)
    out = ""
    for i in range(0, string_length):
        out += chr(random.randrange(char_start, char_start + char_range))
    return out

if __name__ == "__main__":
    driver = webdriver.Chrome()
    driver.get('http://localhost:19006/Auth')   
    while True:
        random_input()