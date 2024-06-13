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
import React, {useState} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors, Globals} from '../../constants';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MiddleScreen from '../../components/middleScreen/MiddleScreen';
import TabScreen from '../../components/tabScreen/TabScreen';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {useRoute} from '@react-navigation/core';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import geocoder from '@timwangdev/react-native-geocoder';
import {
  settreeDetails,
  setreportIncidents,
  settreeIsLoading,
} from '../../redux/slice/treeDetailSlice';
import Utilities from '../../helpers/utils/Utilities';

import Geocoder from '@timwangdev/react-native-geocoder';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();


  //redux States
  const {treeDetails, selectedQr} = useSelector(state => state.treeDetails);


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
    if (Globals.REFRESH_DETAILS === false) {
      getPosition();
    }
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
  const getPosition = async (myLat, myLon) => {
    try {
      const position = {lat: myLat, lng: myLon};
      let location = await Geocoder.geocodePosition(position);

      //  let location = Geocoder.geocodeAddress('Paris', {
      //       locale: 'fr',
      //       maxResults: 2,
      //     });
      // console.log('location ====> ', assetLocation);
      // dispatch(setAssetsLocation(location));

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
    console.log(
      'Perform get tree called for <><>REFRESH<><>',
      'selectedQr',
      selectedQr,
    );
    dispatch(settreeIsLoading(true));

    try {
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

      DataManager.getTree(formBody).then(
        ([isSuccess, message, responseData]) => {
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
            setTimeout(() => {
              dispatch(settreeIsLoading(false));
            }, 3000);
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

            // console.log('settreedetails=====', treeDetails);
          } else {
            setTimeout(() => {
              dispatch(settreeIsLoading(false));
            }, 3000);
            Utilities.showToast('Sorry!', message, 'error', 'bottom');
          }
        },
      );
    } catch (error) {
      console.log('error', error.message);
      dispatch(settreeIsLoading(false));
    }
  };

  const backButtonAction = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomePageScreen'}],
    });
    // performViewTree();
  };

  /**
    * Purpose: Create and add data to DB
    * Created/Modified By: Sudhin Sudhakran
    * Created/Modified Date: 9 -  3 -2023

    */

  return (
    <SafeAreaView>
      <HeaderScreen
        description={
          treeDetails?.category === 'Tree'
            ? 'Detected as Tree 🌲'
            : treeDetails?.category === 'Seed'
            ? 'Detected as Seed 🌱'
            : treeDetails?.category === 'Vehicle'
            ? 'Detected as Vehicle 🚗'
            : null
        }
        onPress={() => backButtonAction()}
        title={'Details'}
      />

      <MiddleScreen backgroundimage={Images.TREE} />
      <TabScreen />
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  heading: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
  },
  content: {
    color: Colors.TEXT_HEAD,
    // marginLeft:responsiveFontSize(5),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
  },
  buttontext: {
    // flex:1,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
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
    marginBottom: responsiveHeight(5),
    flex: 1,
    borderRadius: 2,
  },
});
