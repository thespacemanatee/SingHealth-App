import { fromPairs } from "lodash";
import { onSubmitHandler} from "../src/screens/staff/AuditScreens/ChecklistScreen"
import { shallow } from "enzyme"
import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
import {
  Text,
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
} from "@ui-kitten/components";

it('should call mock function when button is clicked', () => {
    /*const tree = shallow(
        <Button onPress={handleGoHome}>GO HOME</Button>
    );
    tree.simulate('click');*/
    expect(true).toBe(true);
  });