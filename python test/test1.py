from selenium.common.exceptions import UnexpectedAlertPresentException

from function import *

"""Case 1: login and logout"""

# login normal
options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
# options.add_argument('headless')
options.add_argument('--no-sandbox')
options.add_argument('-disable-dev-shm-usage')
driver = webdriver.Chrome(executable_path="/Users/home/PyCharm/FrontEndTest//chromedriver", options=options)
driver.get("http://localhost:3000")
input_text(driver, "text", "1004515")
input_text(driver, "password", "pass1234")
click_btn(driver, "loginbtn")
time.sleep(2)
if driver.current_url == "http://localhost:3000/":
    print("Logged in without error")
# logout
click_btn(driver, "logout")
time.sleep(1)
if driver.current_url == "http://localhost:3000/login":
    print("Logged out without error")
time.sleep(1)

# login abnormally
input_text(driver, "text", "1004515")
input_text(driver, "password", "hahahawrongpswd")
try:
    click_btn(driver, "loginbtn")
    time.sleep(5)
    if driver.current_url == "http://localhost:3000/":
        print("Logged in with wrong password")
    driver.get("http://localhost:3000")
except UnexpectedAlertPresentException as e:
    print("Cannot login with wrong password")

time.sleep(1)


# trying tp go to an forbidden page after logout

def test_guard_after_logout(router_name):
    driver.get("http://localhost:3000/" + router_name)
    time.sleep(0.1)
    if driver.current_url != "http://localhost:3000/login":
        print(router_name + " not guarded after logout")
    print(router_name + " guarded after logout")


print("Testing all possible routers after logout")
test_guard_after_logout("profile")
test_guard_after_logout("event")
test_guard_after_logout("event_history")
test_guard_after_logout("profile_edit")
test_guard_after_logout("room_profile_edit")
test_guard_after_logout("lifestyle_profile_edit")
test_guard_after_logout("apply")
test_guard_after_logout("apply2")
test_guard_after_logout("apply3")
test_guard_after_logout("application_summary")
test_guard_after_logout("event_creation")
test_guard_after_logout("application_status")
driver.quit()
