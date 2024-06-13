/**
    * Purpose: Create Details Screen Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023

    */

import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors, Globals} from '../../constants';
import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Detail from '../../components/contentScreen/Detail';

import {Buttons} from '../../components';
import MiddleScreen from '../../components/middleScreen/MiddleScreen';
import CarTabScreen from '../../components/tabScreen/CarTabScreen';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/core';
import {useDispatch} from 'react-redux';
import {
  settreeDetails,
  settreeIsLoading,
  setAssetsLocation,
} from '../../redux/slice/treeDetailSlice';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';

import Geocoder from '@timwangdev/react-native-geocoder';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const CarScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  //redux State
  const {treeDetails, selectedQr, assetLocation} = useSelector(
    state => state.treeDetails,
  );
  console.log('=====', treeDetails);
  useFocusEffect(
    React.useCallback(() => {
      console.log('needDetailsRefresh', Globals.REFRESH_DETAILS);
      console.log('selectedQr', selectedQr);
      if (Globals.REFRESH_DETAILS === true) {
        performViewTree();
      }
      return () => {
        Globals.REFRESH_DETAILS = false;
      };
    }, []),
  );
  useFocusEffect(
    React.useCallback(() => {
      // checkLocationPermission();
      return undefined;
    }, []),
  );
  const checkLocationPermission = async () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {})
      .catch(err => {
        BackHandler.exitApp();
      });
  };
  useEffect(() => {
    function handleBackButton() {
      backButtonAction();
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => {
      //Clean up
      backHandler.remove();
    };
  }, []);
  const backButtonAction = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomePageScreen'}],
    });
  };
  const getPosition = async (myLat, myLon) => {
    try {
      const position = {lat: myLat, lng: myLon};
      let location = await Geocoder.geocodePosition(position);

      //  let location = Geocoder.geocodeAddress('Paris', {
      //       locale: 'fr',
      //       maxResults: 2,
      //     });
      console.log('location ====> ', assetLocation);
      dispatch(setAssetsLocation(location));
      setIsLoading(false);
      var _message = [
        location?.[0]?.subLocality,
        location?.[1]?.locality,
        location?.[0]?.postalCode,
      ]
        .filter(Boolean)
        .join(', ');

      // setMessage(_message);
      // setShowAlert(true);
    } catch (err) {}
  };
  const performViewTree = () => {
    console.log('Perform get tree called for <><>REFRESH<><>');
    dispatch(settreeIsLoading(true));
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.METHOD]: 'get',
      //  [APIConnections.KEYS.RESOURCE]: 'assets',
      [APIConnections.KEYS.FILTERS_QRVALUE]: selectedQr,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.getTree(formBody).then(([isSuccess, message, responseData]) => {
      console.log(
        'isSuccess',
        isSuccess,
        'message',
        message,
        'responseData',
        responseData,
      );
      if (isSuccess === true) {
        dispatch(settreeDetails(responseData[0]));

        if (
          responseData[0].lat !== null &&
          responseData[0].lat !== '' &&
          responseData[0].lng !== null &&
          responseData[0].lng !== ''
        ) {
          getPosition(
            parseFloat(responseData[0].lat),
            parseFloat(responseData[0].lng),
          );
        }

        setTimeout(() => {
          dispatch(settreeIsLoading(false));
        }, 3000);

        // console.log('settreedetails=====', treeDetails);
      } else {
        setTimeout(() => {
          dispatch(settreeIsLoading(false));
        }, 3000);
        Utilities.showToast('Sorry!', message, 'error', 'bottom');
      }
    });
  };

  return (
    <SafeAreaView>
      <HeaderScreen
        description={'Detected as Vehicle 🚗'}
        onPress={() => backButtonAction()}
        title={'Details'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        // style={{height: responsiveHeight(90)}}
      >
        <MiddleScreen backgroundimage={Images.CAR} />
        <CarTabScreen />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CarScreen;

const styles = StyleSheet.create({
  heading: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginLeft: responsiveFontSize(2),
    marginTop: responsiveHeight(3),
  },
  content: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveFontSize(2),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
    marginTop: responsiveHeight(0.5),
  },
  headingright: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    marginLeft: responsiveWidth(10),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginTop: responsiveHeight(3),
  },
  contentright: {
    marginLeft: responsiveWidth(10),
    color: Colors.TEXT_HEAD,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
    marginTop: responsiveHeight(0.5),
  },
  locationright: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    marginLeft: responsiveWidth(10),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginTop: responsiveHeight(10),
  },
  locationvalueright: {
    marginLeft: responsiveWidth(10),
    color: Colors.TEXT_HEAD,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
  },
  buttontext: {
    // flex:1,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  button: {
    height: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_COLOR,
    // marginLeft: responsiveWidth(5),
    // marginBottom: responsiveHeight(5),
    flex: 1,
    borderRadius: 2,
  },
});
