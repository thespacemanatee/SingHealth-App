import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase

import unittest
import json
import mongomock
import BTS.auditEmailEndpoint 
import BTS.utils 
from BTS.auditEmailEndpoint import validate_and_pack_audit_info_word
from BTS.utils import send_audit_email_word
from unittest.mock import patch, Mock
import datetime

valid_data = {'audit_info': {'_id': 'x68765yt34kmujnyhbtgR606eb34eebe85ee9c3b37b19SKH2021-04-08T16:30:46.464Z', 'staffID': 'x68765yt34kmujnyhbtgR', 'tenantID': '606eb34eebe85ee9c3b37b19', 'institutionID': 'SKH', 'date': datetime.datetime(2021, 4, 8, 16, 30, 46, 464000), 'auditChecklists': {'fnb': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19fnb', 'covid19': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19covid19'}, 'score': 0.98, 'rectificationProgress': 0.5, 'form_with_ans': {'fnb': {'type': 'F&B', 'color': 'bbeebb', 'form_with_ans': {'Professionalism and Staff Hygiene': [{'question': 'Shop is open and ready to service patients/visitors according to operating hours.', 'answer': '1'}, {'question': 'Staff Attendance: adequate staff for peak and non-peak hours.', 'answer': '1'}, {'question': 'At least one (1) clearly assigned person in-charge on site.', 'answer': '1'}, {'question': 'Staff who are unfit for work due to illness should not report to work).', 'answer': '1'}, {'question': 'Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.', 'answer': '1'}, {'question': 'Clean clothes/uniform or aprons are worn during food preparation and food service.', 'answer': '1'}, {'question': 'Hair is kept tidy (long hair must be tied up) and covered with clean caps or hair nets where appropriate.', 'answer': '1'}, {'question': 'Sores, wounds or cuts on hands, if any, are covered with waterproof and brightly-coloured plaster.', 'answer': '1'}, {'question': 'Hands are washed thoroughly with soap and water, frequently and at appropriate times.', 'answer': '1'}, {'question': 'Fingernails are short, clean, unpolished and without nail accessories.', 'answer': '1'}, {'question': 'No wrist watches/ rings or other hand jewellery (with exception of wedding ring) is worn by staff handling food.', 'answer': '1'}, {'question': 'Food is handled with clean utensils and gloves.', 'answer': '1'}, {'question': 'Disposable gloves are changed regularly and/ or in between tasks. Staff do not handle cash with gloved hands.', 'answer': '1'}], 'Housekeeping and General Cleanliness': [{'question': 'Cleaning and maintenance records for equipment, ventilation and exhaust system.', 'answer': '1'}, {'question': 'Adequate and regular pest control. Pest control record.', 'answer': '1'}, {'question': 'Goods and equipment are within shop boundary.', 'answer': '1'}, {'question': 'Store display/ Shop front is neat and tidy.', 'answer': '1'}, {'question': 'Work/ serving area is neat, clean and free of spillage.', 'answer': '1'}, {'question': 'Uncluttered circulation space free of refuse/ furniture.', 'answer': '1'}, {'question': 'Tables are cleared promptly within 10 minutes.', 'answer': '1'}, {'question': 'Fixtures and fittings including shelves, cupboards and drawers are clean and dry, free from pests, and in a good state.', 'answer': '1'}, {'question': 'Ceiling/ ceiling boards are free from stains/ dust with no gaps.', 'answer': '1'}, {'question': 'Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.', 'answer': '1'}, {'question': 'Equipment, exhaust hood, crockery and utensils are clean, in good condition and serviced.', 'answer': '1'}, {'question': 'Surfaces, walls and ceilings within customer areas are dry and clean.', 'answer': '1'}, {'question': 'Floor within customer areas is clean, dry and non-greasy.', 'answer': '1'}, {'question': 'Waste bins are properly lined with plastic bags and covered at all times.', 'answer': '1'}, {'question': 'Adequate number of covered waste pedal bins are available and waste is properly managed and disposed. Waste bins are not over-filled. Waste Management: Proper disposal of food stuff and waste. Waste is properly bagged before disposing it at the waste disposal area/ bin centre.', 'answer': '1'}, {'question': 'Hand washing facilities are easily accessible, in good working condition and soap is provided.', 'answer': '1'}, {'question': 'Adequate facilities for hand hygiene are available including liquid soap and disposable hand towels.', 'answer': '1'}], 'Food Hygiene': [{'question': 'Food is stored in appropriate conditions and at an appropriate temperature.', 'answer': '0'}, {'question': 'Storage of food does not invite pest infestation.', 'answer': '0*'}, {'question': 'Dry goods (e.g. canned food and drinks) and other food items are stored neatly on shelves, off the floor and away from walls.', 'answer': '1'}, {'question': 'Proper stock rotation system such as the First-Expired-First-Out (FEFO) system is used for inventory management.', 'answer': '1'}, {'question': 'Food is protected from contamination; packaging is intact and no products are found with signs of spoilage.', 'answer': '1'}, {'question': 'Ice machine is clean and well maintained. Only ice is stored in the ice machine to prevent contamination of the ice.', 'answer': '1'}, {'question': 'Scoop for ice is stored outside the ice machine in a dedicated container.', 'answer': '1'}, {'question': 'Food supplied is clean and not expired.', 'answer': '1'}, {'question': 'Clear labelling of date of date of preparation/ manufacture/ expiry on all food containers/packaging.', 'answer': '1'}, {'question': 'Cooked food is properly covered to prevent cross-contamination.', 'answer': '1'}, {'question': 'Proper work flow and segregation of areas to prevent cross-contamination between raw and cooked/ ready-to-eat food areas.', 'answer': '1'}, {'question': 'Proper separation of cooked food/ ready-to-eat food, raw meat, seafood and vegetable to prevent cross-contamination. E.g. Different chopping boards, knives and other utensils are used for cooked/ ready-to-eat and raw food.', 'answer': '1'}, {'question': 'Frozen food is thawed in chiller, microwave or under running water.', 'answer': '1'}, {'question': 'Ingredients used are clean and washed thoroughly before cooking.', 'answer': '1'}, {'question': 'All cooking ingredient (e.g. cooking oil, sauces) are properly covered in proper containers and properly labelled, indicating the content and date of expiry.', 'answer': '1'}, {'question': 'All sauces are stored at appropriate condition & temperature.', 'answer': '1'}, {'question': 'Cooking oil is not used for more than 1 day.', 'answer': '1'}, {'question': 'Cooking oil is properly stored with a cover.', 'answer': '1'}, {'question': 'Perishable food is stored in the fridge.', 'answer': '1'}, {'question': 'Raw food and cooked food/ ready to serve food are clearly segregated. Cold and/ or hot holding units are clean and well maintained.', 'answer': '1'}, {'question': 'Food preparation area is free of bird and animal (e.g. dog or cat).', 'answer': '1'}, {'question': 'Food preparation area is clean, free of pests and in good state of repair.', 'answer': '1'}, {'question': 'Food is not prepared on the floor, near drain or near/ in toilet.', 'answer': '1'}, {'question': 'Personal belongings are kept separately in the staff locker area or cabinet, away from the food storage and preparation area.', 'answer': '1'}, {'question': 'Daily Temperature Log for food storage units (freezers, chillers, warmers, steamers, ovens) using independent thermometer, etc. is maintained for inspection from time to time.', 'answer': '1'}, {'question': 'Food storage units (freezers, chillers, warmers, steamers, ovens) are kept clean and well maintained. All rubber gaskets of refrigerators / warmers are free from defect, dirt and mould.', 'answer': '1'}, {'question': 'Food storage units are not overstocked to allow good air circulation.', 'answer': '1'}, {'question': 'For walk-in freezers and chillers, food items are stored neatly on shelves and off the floor.', 'answer': '1'}, {'question': 'Frozen food is stored at a temperature of not more than -12°C. Freezer’s temperature: < -12°C', 'answer': '1'}, {'question': 'Chilled food is stored at a temperature of not more than 4°C. Chiller’s temperature: 0°C ~ 4°C', 'answer': '1'}, {'question': 'Hot food are held above 60°C. Food warmer’s temperature: > 60°C', 'answer': '1'}, {'question': 'Perishable food is stored at a temperature of not more than 4°C.', 'answer': '1'}, {'question': 'Dairy products are stored at a temperature of not more than 7°C.', 'answer': '1'}, {'question': 'Cooked/ ready-to-eat food are stored above raw food.', 'answer': '1'}, {'question': 'Food items are properly wrapped/covered in proper containers and protected from contamination.', 'answer': '1'}], "Healthier Choice in line with HPB's Healthy Eating's Initiative": [{'question': 'Min. no. of healthier variety of food items per stall. Lease Term: 50% of food items.', 'answer': '1'}, {'question': 'Label caloric count of healthier options.', 'answer': '1'}, {'question': 'Include HPB’s Identifiers beside healthier options.', 'answer': '1'}, {'question': 'Use of healthier cooking oils.', 'answer': '1'}, {'question': 'Offer wholemeal/ whole-grain option.', 'answer': '1'}, {'question': 'Healthier option food sold at lower price than regular items.', 'answer': '1'}, {'question': 'Limit deep-fried and pre-deep fried food items sold (≤ 20% deep-fried items).', 'answer': '1'}, {'question': 'No sugar / Lower-sugar brewed beverage offerings according to guidelines.', 'answer': '1'}, {'question': 'Healthier option beverages sold at lower price than regular items.', 'answer': '1'}, {'question': 'Label caloric count of healthier options.', 'answer': '1'}, {'question': 'Limit sugar content on commercially-prepared sweetened beverages. (≥ 70% commercially-prepared sweetened beverages sold to have HCS)', 'answer': '1'}], 'Workplace Safety and Health': [{'question': 'All food handlers have Basic Food Hygiene certificate and a valid Refresher Food Hygiene certificate (if applicable).', 'answer': '1'}, {'question': 'MSDS for all industrial chemicals are available and up to date.', 'answer': '1'}, {'question': 'Proper chemicals storage.', 'answer': '1'}, {'question': 'All detergent and bottles containing liquids are labelled appropriately.', 'answer': '1'}, {'question': 'All personnel to wear safety shoes and safety attire where necessary.', 'answer': '1'}, {'question': 'Knives and sharp objects are kept at a safe place.', 'answer': '1'}, {'question': 'Area under the sink should not be cluttered with items other than washing agents.', 'answer': '1'}, {'question': 'Delivery personnel do not stack goods above the shoulder level.', 'answer': '1'}, {'question': 'Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.', 'answer': '1'}, {'question': 'Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.', 'answer': '1'}, {'question': 'Equipment, crockery and utensils are not chipped, broken or cracked.', 'answer': '1'}, {'question': 'Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.', 'answer': '1'}, {'question': 'Escape route and exits are unobstructed.', 'answer': '1'}, {'question': 'First aid box is available and well-equipped.', 'answer': '1'}, {'question': 'Electrical sockets are not overloaded – one plug to one socket.', 'answer': '1'}, {'question': 'Plugs and cords are intact and free from exposure/ tension with PSB safety mark.', 'answer': '1'}, {'question': 'Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.', 'answer': '1'}, {'question': 'Electrical panels / DBs are covered.', 'answer': '1'}]}, 'summary_form': {'total': 94, 'table': [{'section': 'Professionalism and Staff Hygiene', 'points': 13, 'max_points': 13}, {'section': 'Housekeeping and General Cleanliness', 'points': 17, 'max_points': 17}, {'section': 'Food Hygiene', 'points': 33, 'max_points': 35}, {'section': "Healthier Choice in line with HPB's Healthy Eating's Initiative", 'points': 11, 'max_points': 11}, {'section': 'Workplace Safety and Health', 'points': 18, 'max_points': 18}]}, 'rect_form': {'Food Hygiene': {'Food is stored in appropriate conditions and at an appropriate temperature.': {'Non-compliance Images': ['606eb34eebe85ee9c3b37b19978430705289.jpg'], 'Remarks': 'asdasda', 'Rectified': 'No', 'Deadline': '04/15/2021 16:00:00'}, 'Storage of food does not invite pest infestation.': {'Non-compliance Images': ['606eb34eebe85ee9c3b37b191125715445093.jpg'], 'Remarks': 'adasd', 'Rectified': 'Yes', 'Deadline': '04/15/2021 16:00:00'}}}}, 'covid19': {'type': 'Covid-19', 'color': 'f786a0', 'form_with_ans': {'Safe Management Measures for Front-of-house': [{'question': 'SafeEntry has been implemented for dine-in customers.', 'answer': '1'}, {'question': 'Temperature screening is conducted for customers of outlets that are located outside of institution’s temperature screening zone.', 'answer': '1'}, {'question': 'Table and seating arrangement adheres to the one-metre spacing between tables or groups. Where tables/seats are fixed, tables/seats should be marked out, ensuring at least one-metre spacing.', 'answer': '1'}, {'question': 'Queue is demarcated to ensure at least one-metre spacing between customers such as entrances and cashier counters (e.g. through floor markers).', 'answer': '1'}, {'question': 'Staff to ensure customers maintain safe distance of one-metre when queuing and seated.', 'answer': '1'}, {'question': 'Staff to ensure customers wear a mask at all times, unless eating or drinking.', 'answer': '1'}, {'question': 'Hand sanitizers are placed at high touch areas (i.e. tray return, collection point, outlet entrance/exit).', 'answer': '1'}, {'question': 'Outlet promotes use of cashless payment modes.', 'answer': '1'}], 'Staff Hygiene and Safe Management Measures': [{'question': 'All staff to wear a mask at all times, unless eating or drinking.', 'answer': '1'}, {'question': 'Mask worn by staff is in the correct manner (i.e. cover nose and mouth, no hanging of mask under the chin/neck).', 'answer': '1'}, {'question': 'All staff to record their temperature daily.', 'answer': '1'}, {'question': 'Staff to maintain safe distance of one-metre (where possible) and not congregate, including at common areas, and during break/meal times.', 'answer': '1'}, {'question': 'Check with supervisor that all staff record SafeEntry check-in and check-out (Note: Supervisor is accountable for adherence)', 'answer': '1'}]}, 'summary_form': {'total': 13, 'table': [{'section': 'Safe Management Measures for Front-of-house', 'points': 8, 'max_points': 8}, {'section': 'Staff Hygiene and Safe Management Measures', 'points': 5, 'max_points': 5}]}, 'rect_form': {}}}}, 'staff_info': {'_id': 'x68765yt34kmujnyhbtgR', 'name': 'IP MAN', 'email': 'cheekit.chong98@gmail.com', 'pswd': 'pbkdf2:sha256:150000$qHArIUzp$64fb1192b0ef8cffab4b1c6b81dcf3bc8a241c9b33934c99d7ac451b60a08c08', 'institutionID': 'SKH', 'expoToken': ['ExponentPushToken[UkI3EPAICgWFqwsAr6VK5N]', 'ExponentPushToken[0KTApJJ1uIDcAO4zZzXphc]', 'ExponentPushToken[-ACje4AJ2OKOVMXbJZBLY6]', 'ExponentPushToken[eZ8370NWGl2tzoIv2WNJVK]']}, 'tenant_info': {'_id': '606eb34eebe85ee9c3b37b19', 'name': 'Test', 'email': 'test@test.com', 'pswd': 'pbkdf2:sha256:150000$XkrsODHQ$c46b9de470cb9a3097180220e2591c54837551a5acb58bbf5ac922fa4b2ec66f', 'institutionID': 'SKH', 'stallName': 'Beautiful Food', 'fnb': True, 'createdBy': 'x68765yt34kmujnyhbtgR', 'dateCreated': '2021-04-08T07:39:58.997952', 'expoToken': []}, 'inst_info': {'_id': 'SKH', 'name': 'Sengkang General Hospital', 'address': {'blk': '110', 'street': 'Sengkang East Way', 'zipcode': '544886'}, 'poc': {'name': 'Tan Seng Seng', 'designation': 'Manager', 'email': 'tss@skh.gov.sg'}}}

@patch.object(BTS.auditEmailEndpoint, "send_audit_email_word", return_value = None) 
@patch.object(BTS.auditEmailEndpoint, "validate_and_pack_audit_info_word", return_value = None)
class TestWord(BTSAppTestCase):
    
    def test_create_send_word_valid(self, validate_data, send_audit_email_word):
        validate_data.return_value = (True, valid_data)
        send_audit_email_word.return_value = True
        response = self.client.post("/email/word/x68765yt34kmujnyhbtgR6065de0ec8b7adbe23debd90SKH2021-04-08T16:33:32.383Z")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict["description"], "Audit email sent")
        
    def test_create_word_invalid(self, validate_data, send_audit_email_word):  
        validate_data.return_value = (False, False)
        send_audit_email_word.return_value = False
        response = self.client.post("/email/word/testtest")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Missing/Error in information")
    
    def test_send_word_invalid(self, validate_data, send_audit_email_word):  
        validate_data.return_value = (True, valid_data)
        send_audit_email_word.return_value = False
        response = self.client.post("/email/word/testtest")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Error in sending email")
        
    def test_error_connection_invalid(self, validate_data, send_audit_email_word):  
        validate_data.return_value = None
        response = self.client.post("/email/word/testtest")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Internal Error")
        


valid_audit = {'_id': 'x68765yt34kmujnyhbtgR606eb34eebe85ee9c3b37b19SKH2021-04-08T16:30:46.464Z', 'staffID': 'x68765yt34kmujnyhbtgR', 'tenantID': '606eb34eebe85ee9c3b37b19', 'institutionID': 'SKH', 'date': datetime.datetime(2021, 4, 8, 16, 30, 46, 464000), 'auditChecklists': {'fnb': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19fnb', 'covid19': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19covid19'}, 'score': 0.98, 'rectificationProgress': 0.5}
valid_inst = {'_id': 'SKH', 'name': 'Sengkang General Hospital', 'address': {'blk': '110', 'street': 'Sengkang East Way', 'zipcode': '544886'}, 'poc': {'name': 'Tan Seng Seng', 'designation': 'Manager', 'email': 'tss@skh.gov.sg'}}
valid_staff = {'_id': 'x68765yt34kmujnyhbtgR', 'name': 'IP MAN', 'email': 'cheekit.chong98@gmail.com', 'pswd': 'pbkdf2:sha256:150000$qHArIUzp$64fb1192b0ef8cffab4b1c6b81dcf3bc8a241c9b33934c99d7ac451b60a08c08', 'institutionID': 'SKH', 'expoToken': ['ExponentPushToken[UkI3EPAICgWFqwsAr6VK5N]', 'ExponentPushToken[0KTApJJ1uIDcAO4zZzXphc]', 'ExponentPushToken[-ACje4AJ2OKOVMXbJZBLY6]', 'ExponentPushToken[eZ8370NWGl2tzoIv2WNJVK]']}
valid_tenant = {'_id': '606eb34eebe85ee9c3b37b19', 'name': 'Test', 'email': 'test@test.com', 'pswd': 'pbkdf2:sha256:150000$XkrsODHQ$c46b9de470cb9a3097180220e2591c54837551a5acb58bbf5ac922fa4b2ec66f', 'institutionID': 'SKH', 'stallName': 'Beautiful Food', 'fnb': True, 'createdBy': 'x68765yt34kmujnyhbtgR', 'dateCreated': '2021-04-08T07:39:58.997952', 'expoToken': []}
valid_form_info_arr = [
    {'_id': 'fnb2021', 'type': 'fnb', 'questions': {'Professionalism and Staff Hygiene': [{'index': 1, 'question': 'Shop is open and ready to service patients/visitors according to operating hours.', 'answer': False}, {'index': 2, 'question': 'Staff Attendance: adequate staff for peak and non-peak hours.', 'answer': False}, {'index': 3, 'question': 'At least one (1) clearly assigned person in-charge on site.', 'answer': False}, {'index': 4, 'question': 'Staff who are unfit for work due to illness should not report to work).', 'answer': False}, {'index': 5, 'question': 'Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.', 'answer': False}, {'index': 6, 'question': 'Clean clothes/uniform or aprons are worn during food preparation and food service.', 'answer': False}, {'index': 7, 'question': 'Hair is kept tidy (long hair must be tied up) and covered with clean caps or hair nets where appropriate.', 'answer': False}, {'index': 8, 'question': 'Sores, wounds or cuts on hands, if any, are covered with waterproof and brightly-coloured plaster.', 'answer': False}, {'index': 9, 'question': 'Hands are washed thoroughly with soap and water, frequently and at appropriate times.', 'answer': False}, {'index': 10, 'question': 'Fingernails are short, clean, unpolished and without nail accessories.', 'answer': False}, {'index': 11, 'question': 'No wrist watches/ rings or other hand jewellery (with exception of wedding ring) is worn by staff handling food.', 'answer': False}, {'index': 12, 'question': 'Food is handled with clean utensils and gloves.', 'answer': False}, {'index': 13, 'question': 'Disposable gloves are changed regularly and/ or in between tasks. Staff do not handle cash with gloved hands.', 'answer': False}], 'Housekeeping and General Cleanliness': [{'index': 1, 'question': 'Cleaning and maintenance records for equipment, ventilation and exhaust system.', 'answer': False}, {'index': 2, 'question': 'Adequate and regular pest control. Pest control record.', 'answer': False}, {'index': 3, 'question': 'Goods and equipment are within shop boundary.', 'answer': False}, {'index': 4, 'question': 'Store display/ Shop front is neat and tidy.', 'answer': False}, {'index': 5, 'question': 'Work/ serving area is neat, clean and free of spillage.', 'answer': False}, {'index': 6, 'question': 'Uncluttered circulation space free of refuse/ furniture.', 'answer': False}, {'index': 7, 'question': 'Tables are cleared promptly within 10 minutes.', 'answer': False}, {'index': 8, 'question': 'Fixtures and fittings including shelves, cupboards and drawers are clean and dry, free from pests, and in a good state.', 'answer': False}, {'index': 9, 'question': 'Ceiling/ ceiling boards are free from stains/ dust with no gaps.', 'answer': False}, {'index': 10, 'question': 'Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.', 'answer': False}, {'index': 11, 'question': 'Equipment, exhaust hood, crockery and utensils are clean, in good condition and serviced.', 'answer': False}, {'index': 12, 'question': 'Surfaces, walls and ceilings within customer areas are dry and clean.', 'answer': False}, {'index': 13, 'question': 'Floor within customer areas is clean, dry and non-greasy.', 'answer': False}, {'index': 14, 'question': 'Waste bins are properly lined with plastic bags and covered at all times.', 'answer': False}, {'index': 15, 'question': 'Adequate number of covered waste pedal bins are available and waste is properly managed and disposed. Waste bins are not over-filled. Waste Management: Proper disposal of food stuff and waste. Waste is properly bagged before disposing it at the waste disposal area/ bin centre.', 'answer': False}, {'index': 16, 'question': 'Hand washing facilities are easily accessible, in good working condition and soap is provided.', 'answer': False}, {'index': 17, 'question': 'Adequate facilities for hand hygiene are available including liquid soap and disposable hand towels.', 'answer': False}], 'Food Hygiene': [{'index': 1, 'question': 'Food is stored in appropriate conditions and at an appropriate temperature.', 'answer': False}, {'index': 2, 'question': 'Food and non-food are clearly segregated. Non-food items (e.g. insecticides, detergents and other chemicals) are not stored together with the food items.', 'answer': False}, {'index': 3, 'question': 'Food is not placed near sources of contamination.', 'answer': False}, {'index': 4, 'question': 'Storage of food does not invite pest infestation.', 'answer': False}, {'index': 5, 'question': 'Dry goods (e.g. canned food and drinks) and other food items are stored neatly on shelves, off the floor and away from walls.', 'answer': False}, {'index': 6, 'question': 'Proper stock rotation system such as the First-Expired-First-Out (FEFO) system is used for inventory management.', 'answer': False}, {'index': 7, 'question': 'Food is protected from contamination; packaging is intact and no products are found with signs of spoilage.', 'answer': False}, {'index': 8, 'question': 'Ice machine is clean and well maintained. Only ice is stored in the ice machine to prevent contamination of the ice.', 'answer': False}, {'index': 9, 'question': 'Scoop for ice is stored outside the ice machine in a dedicated container.', 'answer': False}, {'index': 10, 'question': 'Food supplied is clean and not expired.', 'answer': False}, {'index': 11, 'question': 'Clear labelling of date of date of preparation/ manufacture/ expiry on all food containers/packaging.', 'answer': False}, {'index': 12, 'question': 'Cooked food is properly covered to prevent cross-contamination.', 'answer': False}, {'index': 13, 'question': 'Proper work flow and segregation of areas to prevent cross-contamination between raw and cooked/ ready-to-eat food areas.', 'answer': False}, {'index': 14, 'question': 'Proper separation of cooked food/ ready-to-eat food, raw meat, seafood and vegetable to prevent cross-contamination. E.g. Different chopping boards, knives and other utensils are used for cooked/ ready-to-eat and raw food.', 'answer': False}, {'index': 15, 'question': 'Frozen food is thawed in chiller, microwave or under running water.', 'answer': False}, {'index': 16, 'question': 'Ingredients used are clean and washed thoroughly before cooking.', 'answer': False}, {'index': 17, 'question': 'All cooking ingredient (e.g. cooking oil, sauces) are properly covered in proper containers and properly labelled, indicating the content and date of expiry.', 'answer': False}, {'index': 18, 'question': 'All sauces are stored at appropriate condition & temperature.', 'answer': False}, {'index': 19, 'question': 'Cooking oil is not used for more than 1 day.', 'answer': False}, {'index': 20, 'question': 'Cooking oil is properly stored with a cover.', 'answer': False}, {'index': 21, 'question': 'Perishable food is stored in the fridge.', 'answer': False}, {'index': 22, 'question': 'Raw food and cooked food/ ready to serve food are clearly segregated. Cold and/ or hot holding units are clean and well maintained.', 'answer': False}, {'index': 23, 'question': 'Food preparation area is free of bird and animal (e.g. dog or cat).', 'answer': False}, {'index': 24, 'question': 'Food preparation area is clean, free of pests and in good state of repair.', 'answer': False}, {'index': 25, 'question': 'Food is not prepared on the floor, near drain or near/ in toilet.', 'answer': False}, {'index': 26, 'question': 'Personal belongings are kept separately in the staff locker area or cabinet, away from the food storage and preparation area.', 'answer': False}, {'index': 27, 'question': 'Daily Temperature Log for food storage units (freezers, chillers, warmers, steamers, ovens) using independent thermometer, etc. is maintained for inspection from time to time.', 'answer': False}, {'index': 28, 'question': 'Food storage units (freezers, chillers, warmers, steamers, ovens) are kept clean and well maintained. All rubber gaskets of refrigerators / warmers are free from defect, dirt and mould.', 'answer': False}, {'index': 29, 'question': 'Food storage units are not overstocked to allow good air circulation.', 'answer': False}, {'index': 30, 'question': 'For walk-in freezers and chillers, food items are stored neatly on shelves and off the floor.', 'answer': False}, {'index': 31, 'question': 'Frozen food is stored at a temperature of not more than -12°C. Freezer’s temperature: < -12°C', 'answer': False}, {'index': 32, 'question': 'Chilled food is stored at a temperature of not more than 4°C. Chiller’s temperature: 0°C ~ 4°C', 'answer': False}, {'index': 33, 'question': 'Hot food are held above 60°C. Food warmer’s temperature: > 60°C', 'answer': False}, {'index': 34, 'question': 'Perishable food is stored at a temperature of not more than 4°C.', 'answer': False}, {'index': 35, 'question': 'Dairy products are stored at a temperature of not more than 7°C.', 'answer': False}, {'index': 36, 'question': 'Cooked/ ready-to-eat food are stored above raw food.', 'answer': False}, {'index': 37, 'question': 'Food items are properly wrapped/covered in proper containers and protected from contamination.', 'answer': False}], "Healthier Choice in line with HPB's Healthy Eating's Initiative": [{'index': 1, 'question': 'Min. no. of healthier variety of food items per stall. Lease Term: 50% of food items.', 'answer': False}, {'index': 2, 'question': 'Label caloric count of healthier options.', 'answer': False}, {'index': 3, 'question': 'Include HPB’s Identifiers beside healthier options.', 'answer': False}, {'index': 4, 'question': 'Use of healthier cooking oils.', 'answer': False}, {'index': 5, 'question': 'Offer wholemeal/ whole-grain option.', 'answer': False}, {'index': 6, 'question': 'Healthier option food sold at lower price than regular items.', 'answer': False}, {'index': 7, 'question': 'Limit deep-fried and pre-deep fried food items sold (≤ 20% deep-fried items).', 'answer': False}, {'index': 8, 'question': 'No sugar / Lower-sugar brewed beverage offerings according to guidelines.', 'answer': False}, {'index': 9, 'question': 'Healthier option beverages sold at lower price than regular items.', 'answer': False}, {'index': 10, 'question': 'Label caloric count of healthier options.', 'answer': False}, {'index': 11, 'question': 'Limit sugar content on commercially-prepared sweetened beverages. (≥ 70% commercially-prepared sweetened beverages sold to have HCS)', 'answer': False}], 'Workplace Safety and Health': [{'index': 1, 'question': 'All food handlers have Basic Food Hygiene certificate and a valid Refresher Food Hygiene certificate (if applicable).', 'answer': False}, {'index': 2, 'question': 'MSDS for all industrial chemicals are available and up to date.', 'answer': False}, {'index': 3, 'question': 'Proper chemicals storage.', 'answer': False}, {'index': 4, 'question': 'All detergent and bottles containing liquids are labelled appropriately.', 'answer': False}, {'index': 5, 'question': 'All personnel to wear safety shoes and safety attire where necessary.', 'answer': False}, {'index': 6, 'question': 'Knives and sharp objects are kept at a safe place.', 'answer': False}, {'index': 7, 'question': 'Area under the sink should not be cluttered with items other than washing agents.', 'answer': False}, {'index': 8, 'question': 'Delivery personnel do not stack goods above the shoulder level.', 'answer': False}, {'index': 9, 'question': 'Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.', 'answer': False}, {'index': 10, 'question': 'Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.', 'answer': False}, {'index': 11, 'question': 'Equipment, crockery and utensils are not chipped, broken or cracked.', 'answer': False}, {'index': 12, 'question': 'Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.', 'answer': False}, {'index': 13, 'question': 'Escape route and exits are unobstructed.', 'answer': False}, {'index': 14, 'question': 'First aid box is available and well-equipped.', 'answer': False}, {'index': 15, 'question': 'Electrical sockets are not overloaded – one plug to one socket.', 'answer': False}, {'index': 16, 'question': 'Plugs and cords are intact and free from exposure/ tension with PSB safety mark.', 'answer': False}, {'index': 17, 'question': 'Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.', 'answer': False}, {'index': 18, 'question': 'Electrical panels / DBs are covered.', 'answer': False}]}},
    {'_id': 'covid192021', 'type': 'covid19', 'questions': {'Safe Management Measures for Front-of-house': [{'index': 1, 'question': 'SafeEntry has been implemented for dine-in customers.', 'answer': False}, {'index': 2, 'question': 'Temperature screening is conducted for customers of outlets that are located outside of institution’s temperature screening zone.', 'answer': False}, {'index': 3, 'question': 'Table and seating arrangement adheres to the one-metre spacing between tables or groups. Where tables/seats are fixed, tables/seats should be marked out, ensuring at least one-metre spacing.', 'answer': False}, {'index': 4, 'question': 'Queue is demarcated to ensure at least one-metre spacing between customers such as entrances and cashier counters (e.g. through floor markers).', 'answer': False}, {'index': 5, 'question': 'Staff to ensure customers maintain safe distance of one-metre when queuing and seated.', 'answer': False}, {'index': 6, 'question': 'Staff to ensure customers wear a mask at all times, unless eating or drinking.', 'answer': False}, {'index': 7, 'question': 'Hand sanitizers are placed at high touch areas (i.e. tray return, collection point, outlet entrance/exit).', 'answer': False}, {'index': 8, 'question': 'Outlet promotes use of cashless payment modes.', 'answer': False}], 'Staff Hygiene and Safe Management Measures': [{'index': 1, 'question': 'All staff to wear a mask at all times, unless eating or drinking.', 'answer': False}, {'index': 2, 'question': 'Mask worn by staff is in the correct manner (i.e. cover nose and mouth, no hanging of mask under the chin/neck).', 'answer': False}, {'index': 3, 'question': 'All staff to record their temperature daily.', 'answer': False}, {'index': 4, 'question': 'Staff to maintain safe distance of one-metre (where possible) and not congregate, including at common areas, and during break/meal times.', 'answer': False}, {'index': 5, 'question': 'Check with supervisor that all staff record SafeEntry check-in and check-out (Note: Supervisor is accountable for adherence)', 'answer': False}]}}
    ]
valid_ans_info_arr = [
    {'_id': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19fnb', 'type': 'fnb', 'formTemplateID': 'fnb2021', 'answers': {'Food Hygiene': [{'answer': False, 'index': 1, 'deadline': datetime.datetime(2021, 4, 15, 16, 0), 'remarks': 'asdasda', 'image': ['606eb34eebe85ee9c3b37b19978430705289.jpg'], 'rectified': False}, {'answer': None, 'index': 2}, {'answer': None, 'index': 3}, {'answer': False, 'index': 4, 'deadline': datetime.datetime(2021, 4, 15, 16, 0), 'image': ['606eb34eebe85ee9c3b37b191125715445093.jpg'], 'remarks': 'adasd', 'rectified': True}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}, {'answer': True, 'index': 9}, {'answer': True, 'index': 10}, {'answer': True, 'index': 11}, {'answer': True, 'index': 12}, {'answer': True, 'index': 13}, {'answer': True, 'index': 14}, {'answer': True, 'index': 15}, {'answer': True, 'index': 16}, {'answer': True, 'index': 17}, {'answer': True, 'index': 18}, {'answer': True, 'index': 19}, {'answer': True, 'index': 20}, {'answer': True, 'index': 21}, {'answer': True, 'index': 22}, {'answer': True, 'index': 23}, {'answer': True, 'index': 24}, {'answer': True, 'index': 25}, {'answer': True, 'index': 26}, {'answer': True, 'index': 27}, {'answer': True, 'index': 28}, {'answer': True, 'index': 29}, {'answer': True, 'index': 30}, {'answer': True, 'index': 31}, {'answer': True, 'index': 32}, {'answer': True, 'index': 33}, {'answer': True, 'index': 34}, {'answer': True, 'index': 35}, {'answer': True, 'index': 36}, {'answer': True, 'index': 37}], "Healthier Choice in line with HPB's Healthy Eating's Initiative": [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}, {'answer': True, 'index': 9}, {'answer': True, 'index': 10}, {'answer': True, 'index': 11}], 'Housekeeping and General Cleanliness': [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}, {'answer': True, 'index': 9}, {'answer': True, 'index': 10}, {'answer': True, 'index': 11}, {'answer': True, 'index': 12}, {'answer': True, 'index': 13}, {'answer': True, 'index': 14}, {'answer': True, 'index': 15}, {'answer': True, 'index': 16}, {'answer': True, 'index': 17}], 'Professionalism and Staff Hygiene': [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}, {'answer': True, 'index': 9}, {'answer': True, 'index': 10}, {'answer': True, 'index': 11}, {'answer': True, 'index': 12}, {'answer': True, 'index': 13}], 'Workplace Safety and Health': [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}, {'answer': True, 'index': 9}, {'answer': True, 'index': 10}, {'answer': True, 'index': 11}, {'answer': True, 'index': 12}, {'answer': True, 'index': 13}, {'answer': True, 'index': 14}, {'answer': True, 'index': 15}, {'answer': True, 'index': 16}, {'answer': True, 'index': 17}, {'answer': True, 'index': 18}]}},
    {'_id': '2021-04-08T16:30:46.464Z606eb34eebe85ee9c3b37b19covid19', 'type': 'covid19', 'formTemplateID': 'covid192021', 'answers': {'Safe Management Measures for Front-of-house': [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}, {'answer': True, 'index': 6}, {'answer': True, 'index': 7}, {'answer': True, 'index': 8}], 'Staff Hygiene and Safe Management Measures': [{'answer': True, 'index': 1}, {'answer': True, 'index': 2}, {'answer': True, 'index': 3}, {'answer': True, 'index': 4}, {'answer': True, 'index': 5}]}}
    ]


def return_valid_info(field):
    if field == "audits":
        return True, valid_audit
    elif field  == "staff":
        return True, valid_staff
    elif field  == "tenant":
        return True, valid_tenant
    else:
        return True, valid_inst
    
def return_error_at(mongo, field, data_field, data_val, current, stop_at):
    #print(current)
    #print(stop_at)
    if current in stop_at:
        #print("error at" + field)
        return None, None
    else:
        if field not in ["auditFormTemplate", "filledAuditForms"]:
            return return_valid_info(field)
        else:
            count = int((current - 5)%2)
            return return_valid_info_arr(field, count)

def return_valid_info_arr(field, i):
    if field == "auditFormTemplate":
        return True, valid_form_info_arr[i]
    else:
        return True, valid_ans_info_arr[i]

def return_missing_at(mongo, field, data_field, data_val, current, stop_at):
    if current in stop_at:
        return False, None
    else:
        if field not in ["auditFormTemplate", "filledAuditForms"]:
            return return_valid_info(field)
        else:
            count = int((current - 5)%2)
            #print(count)
            return return_valid_info_arr(field, count)


        
@patch.object(BTS.auditEmailEndpoint, 'check_valid_param')   
@patch.object(BTS.auditEmailEndpoint, 'find_and_return_one')
class test_validate(BTSAppTestCase):
    
    def test_error_auditID(self, find_data, check_valid):
        find_data.return_value = (None,None)
        check_valid.return_value = False
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"], [])
        self.assertEqual(data["error"], ["audit"])
    
    def test_missing_auditID(self, find_data, check_valid):
        find_data.return_value = (False, None)
        check_valid.return_value = False
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"], ["audit"])
        self.assertEqual(data["error"], [])
   
    def test_error_staffID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [2])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],[])
        self.assertEqual(data["error"], ["staff"])
    
    def test_missing_staffID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [2])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],["staff"])
        self.assertEqual(data["error"], [] )

    def test_error_tenantID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [3])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],[])
        self.assertEqual(data["error"], ["tenant"])
    
    def test_missing_staff_ID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [3])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],["tenant"])
        self.assertEqual(data["error"], [] )
        
    def test_error_staff_tenantID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [2,3])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],[])
        self.assertEqual(data["error"], ["staff","tenant"])
    
    def test_missing_staff_tenantID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [2,3])
        check_valid.side_effect = [True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],["staff","tenant"])
        self.assertEqual(data["error"], [] )
        
    def test_error_instID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [4])
        check_valid.side_effect = [True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],[])
        self.assertEqual(data["error"], ["institution"])
        
    def test_missing_instID(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [4])
        check_valid.side_effect = [True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],["institution"])
        self.assertEqual(data["error"], [])
        
    def test_error_form(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [5, 6])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"], [])
        self.assertEqual(data["error"], ['fnb Form', 'covid19 Form'] )
    
    def test_missing_form(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [5, 6])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],['fnb Form', 'covid19 Form'])
        self.assertEqual(data["error"], [] )
    
    
    def test_error_ans(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [7, 8])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"], [])
        self.assertEqual(data["error"], ['fnb Answer', 'covid19 Answer'] )
        

    def test_missing_ans(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [7, 8])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],['fnb Answer', 'covid19 Answer'])
        self.assertEqual(data["error"], [] )
    
    def test_error_form_ans(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_error_at(mongo, field, data_field, data_val, find_data.call_count, [5, 6, 7, 8])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"], [])
        self.assertEqual(data["error"], ['fnb Form', 'covid19 Form', 'fnb Answer', 'covid19 Answer'] )
        

    def test_missing_form_ans(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [5, 6, 7, 8])
        check_valid.side_effect = [True, True, True, False]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, False)
        self.assertEqual(data["missing"],['fnb Form', 'covid19 Form', 'fnb Answer', 'covid19 Answer'] )
        self.assertEqual(data["error"], [] )
        
    def test_get_all_info(self, find_data, check_valid):
        find_data.side_effect = \
            lambda mongo, field, data_field, data_val: \
                return_missing_at(mongo, field, data_field, data_val, find_data.call_count, [9])
        check_valid.side_effect = [True, True, True, True]
        validate, data = validate_and_pack_audit_info_word("test", self.mongo)
        self.assertEqual(validate, True)

if __name__ == '__main__':
    unittest.main()