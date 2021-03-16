import { restoreToken } from "../src/store/actions/authActions";

test("TOKEN test", () => {
  expect(restoreToken).not.toBeUndefined();
});
