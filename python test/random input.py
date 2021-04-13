from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from random import choice, randint
from selenium.webdriver.common.keys import Keys
import time
import random

def random_input():
    while True:
        try:
            links = driver.find_elements_by_xpath("//input[@type='text' or @type='password' or @type='email']")
            for i in links:
                i.send_keys(fuzzer())
            time.sleep(10)
            for i in links:
                for j in range(10):
                    i.send_keys(Keys.BACKSPACE)
        except:
            break
            

         

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
        