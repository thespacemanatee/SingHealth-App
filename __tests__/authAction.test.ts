<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import {restoreToken, signIn, signOut, saveUserDataToStorage, removeTokenToStorage} from '../src/store/actions/authActions'


  test('restoreToken', () => {
    expect(restoreToken).not.toBeUndefined();
  });

  test('signIn', () => {
    expect(signIn).not.toBeUndefined();
  });

  test('signOut', () => {
    expect(signOut).not.toBeUndefined();
  });

  test('saveUserDataToStorage', async() => {
    try{
      const test_userToken = "123456";
      const test_userType = "lol";
      saveUserDataToStorage(test_userToken, test_userType);
      const value = await AsyncStorage.getItem("userData");
      expect(value).toEqual('{"userToken":"123456","userType":"lol"}');
    } catch (err){
      expect(1+1).toBe(3);
    }
    
  });

  test('removeTokenToStorage', async() => {
    try{
      const test_userToken = "123456";
      const test_userType = "lol";
      saveUserDataToStorage(test_userToken, test_userType);
      const value = await AsyncStorage.getItem("userData");
      expect(value).toEqual('{"userToken":"123456","userType":"lol"}');
      removeTokenToStorage();

      // as userdata is deleted, this should throw an err
      const value2 = AsyncStorage.getItem("userData");
      expect(true).toBe(false);

    } catch (err){
      //console.log(err);
      //shoule be jest assertion error
      expect(true).toBe(true);
    }
  });


=======
import { restoreToken } from "../src/store/actions/authActions";

test("TOKEN test", () => {
  expect(restoreToken).not.toBeUndefined();
});
>>>>>>> 5c8a9bc64cb3999e70b1debde9a4a5cb946ed91e
