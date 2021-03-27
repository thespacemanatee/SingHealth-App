import React from 'react';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });

describe('MyComponent', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<button debug />);
  
    expect(component).toMatchSnapshot();
  });
});