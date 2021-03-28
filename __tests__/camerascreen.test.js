import React, {useState} from 'react';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { Caption } from 'react-native-paper';
configure({ adapter: new Adapter() });


describe('MyComponent', () => {
  it('should render correctly in "debug" mode', () => {
  previewVisible = false;
  capturedImage = null;
  flashMode = "off";
  cameraType = "back";
  const setPreviewVisible = (setvalue) => {
    previewVisible = setvalue;
  }
  const setCapturedImage = (setvalue) => {
    capturedImage = setvalue;
  }
  const setFlashMode = (setvalue) => {
    flashMode = setvalue;
  }
  const setCameraType = (setvalue) => {
    cameraType = setvalue;
  }

  const takePicture = () => {
    const photo = 1011010010010010; // assume this is a photo
    setPreviewVisible(true);
    setCapturedImage(photo);
    savePhoto();
  };
  const savePhoto = () => {
    //route.params.onSave(capturedImage);
    //navigation.goBack();
  };
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };
  const handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("auto");
    } else {
      setFlashMode("on");
    }
  };
  const switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };
     
    const flashbutton = shallow(<button debug onClick={handleFlashMode}/>);
    const switchbutton = shallow(<button debug onClick={switchCamera}/>);
    const retakebutton = shallow(<button debug onClick={retakePicture}/>);
    const savebutton = shallow(<button debug onClick={takePicture}/>);
    // test on retake button  
    retakebutton.find('button').simulate('click');
    expect(capturedImage).toBe(null);
    savebutton.find('button').simulate('click');
    expect(capturedImage).not.toBe(null);
    retakebutton.find('button').simulate('click');
    expect(capturedImage).toBe(null);
    // test on flash mode
    expect(flashMode).toEqual("off");
    flashbutton.find('button').simulate('click');
    expect(flashMode).toEqual("auto");
    flashbutton.find('button').simulate('click');
    expect(flashMode).toEqual("on");
    flashbutton.find('button').simulate('click');
    expect(flashMode).toEqual("off");
    // test on camera type
    expect(cameraType).toEqual("back");
    switchbutton.find('button').simulate('click');
    expect(cameraType).toEqual("front");
    switchbutton.find('button').simulate('click');
    expect(cameraType).toEqual("back");
  });
});