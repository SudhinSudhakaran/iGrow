import Toast from 'react-native-toast-message';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from '@timwangdev/react-native-geocoder';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';import {
  settreeDetails,
  setreportIncidents,
  settreeIsLoading,
  setSelectedQr,
  setAssetsLocation,
} from '../../redux/slice/treeDetailSlice';
export default class Utilities {
  
  static getGreeting = () => {
    const currentTime = moment();
    const noon = moment('12:00', 'HH:mm');
    const evening = moment('18:00', 'HH:mm');
    if (currentTime.isBefore(noon)) {
      return 'Good morning';
    } else if (currentTime.isBefore(evening)) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  static showToast(
    message = '',
    subMessage = '',
    type = 'error',
    position = 'bottom',
  ) {
    Toast.show({
      type: type, //'success | error | info '
      text1: message,
      text2: subMessage,
      position: position,
      topOffset: 60,
      bottomOffset: 100,
      visibilityTime: 3000,
      // text1Style: {marginLeft: 30, marginRight:30},
    });
  }
  //Validations
  static isEmailValid(email) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) === true;
  }
  static urlValidation = URL => {
    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
    return regex.test(URL) === true;
  };
  //fetch location using longitude and lotitude
  static getPostion = async (myLat, myLon) => {
      try {
        const position = {lat: myLat, lng: myLon};
        let location = await Geocoder.geocodePosition(position);

      // dispatch(setAssetsLocation(location))
      console.log('location ====> ',location);

  return  location;
        // setMessage(_message);
        // setShowAlert(true);
      } catch (err) {}
    };

    static getFileName(string) {
      const lastInd = string.lastIndexOf('/');
      const strLen = string.length;
      const fileName = string.slice(lastInd + 1, strLen + 1);
      return fileName;
    }
}
