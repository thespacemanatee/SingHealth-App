from function import *

"""Case 2: Edit Profile"""

# login
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
time.sleep(1)
driver.get("http://localhost:3000/profile")
click_btn(driver, "edit_personal_profile_btn")

# Edit with all field filled
input_text(driver, "ppl_prof_passwd", "pass1234")
input_text(driver, "ppl_prof_roommate", "1004522")
input_text(driver, "ppl_prof_phone_number", "93738895")
input_text(driver, "ppl_prof_email_personal", "mymail@ttd.com")
input_text(driver, "ppl_prof_local_addr_post_code", "123456")
input_text(driver, "ppl_prof_local_addr_street", "9 Somapah Rd")
input_text(driver, "ppl_prof_local_addr_unit", "57-03")

click_btn(driver, "ppl_prof_submit")

# Logout and Re-login
click_btn(driver, "logout")
time.sleep(1)
input_text(driver, "text", "1004515")
input_text(driver, "password", "pass1234")
time.sleep(1)
click_btn(driver, "loginbtn")
time.sleep(1)

driver.get("http://localhost:3000/profile")
time.sleep(5)
if (get_text(driver, "ppl_prof_phone_number_display") == "93738895") and (get_text(driver, "ppl_prof_address_display") == ("9 Somapah Rd 57-03 123456")):
    print("Profile Updated Successfully(with all field filled)")
else:
    print("Profile Didn't Updated")

click_btn(driver, "edit_personal_profile_btn")

# Edit with only one field filled
input_text(driver, "ppl_prof_phone_number", "93965944")

click_btn(driver, "ppl_prof_submit")

# Logout and Re-login
click_btn(driver, "logout")
time.sleep(1)
input_text(driver, "text", "1004515")
input_text(driver, "password", "pass1234")
time.sleep(1)
click_btn(driver, "loginbtn")
time.sleep(1)

driver.get("http://localhost:3000/profile")

if get_text(driver, "ppl_prof_phone_number_display") == "93965944":
    print("Profile Updated Successfully(With only one field filled)")
else:
    print("Profile Didn't Updated")
driver.quit()