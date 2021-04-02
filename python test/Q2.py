import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class Search(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_invalid_1(self):
        driver = self.driver
        driver.get("https://statcounter.com/login/")
        username = driver.find_element_by_id("username")
        password = driver.find_element_by_id("password")

        username.send_keys("innovative")
        password.send_keys("whatever")

        driver.find_element_by_class_name("submit").click()
        assert "No results found." not in driver.page_source

    def test_invalid_2(self):
        driver = self.driver
        driver.get("https://statcounter.com/login/")
        username = driver.find_element_by_id("username")
        password = driver.find_element_by_id("password")

        username.send_keys("aboutthe")
        password.send_keys("whatever")

        driver.find_element_by_class_name("submit").click()
        assert "No results found." not in driver.page_source

    def test_invalid_3(self):
        driver = self.driver
        driver.get("https://statcounter.com/login/")
        username = driver.find_element_by_id("username")
        password = driver.find_element_by_id("password")

        username.send_keys("username")
        password.send_keys("whatever")

        driver.find_element_by_class_name("submit").click()
        assert "No results found." not in driver.page_source

    def test_valid(self):
        driver = self.driver
        driver.get("https://statcounter.com/login/")
        username = driver.find_element_by_id("username")
        password = driver.find_element_by_id("password")

        username.send_keys("account1029")
        password.send_keys("Dispostable12")

        driver.find_element_by_class_name("submit").click()
        assert "menu-log-out" in driver.page_source

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()