/**
    * Purpose: Create Details Screen Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023

    */

import {BackHandler, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors} from '../../constants';
import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Detail from '../../components/contentScreen/Detail';
import {ScrollView} from 'react-native-gesture-handler';
import {Buttons} from '../../components';
import MiddleScreen from '../../components/middleScreen/MiddleScreen';
import TabScreen from '../../components/tabScreen/TabScreen';
import {useNavigation, useRoute} from '@react-navigation/core';
import Globals from '../../constants';
import DetailEntryScreen from '../../components/detailEntryScreen/DetailEntryScreen';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useFocusEffect} from '@react-navigation/core';

const VehicleEntryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
  const backButtonAction = () => {
    route?.params?.needToHome
      ? navigation.reset({
          index: 0,
          routes: [{name: 'HomePageScreen'}],
        })
      : navigation.goBack();
  };

  return (
    <SafeAreaView>
      <HeaderScreen
        description={'Detected as Vehicle 🚗'}
        onPress={() =>
          route?.params?.needToHome
            ? navigation.reset({
                index: 0,
                routes: [{name: 'HomePageScreen'}],
              })
            : navigation.goBack()
        }
        title={'Details'}
      />
      {/* <MiddleScreen
        backgroundimage={
          Globals?.OPTION === 'TREE'
            ? Images.TREE
            : Globals?.OPTION === 'SEED'
            ? Images.SEED
            : Globals?.OPTION === 'VEHICLE'
            ? Images.CAR
            : null
        }
      /> */}
      <DetailEntryScreen />
    </SafeAreaView>
  );
};

export default VehicleEntryScreen;

const styles = StyleSheet.create({});
