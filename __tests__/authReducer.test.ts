import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from '../src/store/actions/authActions';
import {authReducer} from '../src/store/reducers/authReducer'

const initialState = {
    isLoading: true,
    isSignOut: false,
    userToken: null,
    userType: null,
  };

test('RESTORE TOKEN test', () => {
    const action1 = {
      token : "1",
      userType : "2",
      type : RESTORE_TOKEN,
    }
    const return1 = authReducer(initialState, action1);
    expect(return1).not.toBeUndefined();
    expect(return1.isLoading).toBe(false);
    expect(return1.userToken).toEqual('1');
    expect(return1.userType).toEqual('2');
    expect(return1.isSignOut).toBe(false);
  });

  test('SIGN in test', () => {
    const action2 = {
      token : "1",
      userType : "2",
      type : SIGN_IN,
    }
    const return2 = authReducer(initialState, action2);
    expect(return2).not.toBeUndefined();
    expect(return2.isLoading).toBe(true);
    expect(return2.userToken).toEqual('1');
    expect(return2.userType).toEqual('2');
    expect(return2.isSignOut).toBe(false);
  });

  test('SIGN out test', () => {
    const action3 = {
      token : "1",
      userType : "2",
      type : SIGN_OUT,
    }
    const return3 = authReducer(initialState, action3);
    expect(return3).not.toBeUndefined();
    expect(return3.isLoading).toBe(true);
    expect(return3.userToken).toEqual(null);
    expect(return3.isSignOut).toBe(true);
  });

