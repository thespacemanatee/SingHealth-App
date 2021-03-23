import { fromPairs } from "lodash";
import { onSubmitHandler} from "../src/screens/staff/AuditScreens/ChecklistScreen"
import { shallow } from "enzyme"
import React from "react"

test('it calls start logout on button click', () => {
    onSubmitHandler();
    expect(onSubmitHandler).toHaveBeenCalled();
});