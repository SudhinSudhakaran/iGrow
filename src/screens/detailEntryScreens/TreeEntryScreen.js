/**
    * Purpose: Create Details Screen Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023

    */

import {BackHandler, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors, Globals} from '../../constants';
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
import {
  useNavigation,
  useFocusEffect,
  NavigationEvents,
} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import DetailEntryScreen from '../../components/detailEntryScreen/DetailEntryScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';
import {useSelector} from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const TreeEntryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //redux States
  const {treeDetails} = useSelector(state => state.treeDetails);
  useEffect(() => {
    treeDetails;
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
    route?.params?.needToHome === true
      ? navigation.reset({
          index: 0,
          routes: [{name: 'IncidentList'}],
        })
      : navigation.goBack();
  };

  return (
    <InputScrollView
      contentContainerStyle={{}}
      style={styles.container}
      keyboardOffset={285}>
      <HeaderScreen
        description={
          treeDetails.category === 'Tree'
            ? 'Detected as Tree 🌲'
            : treeDetails.category === 'Seed'
            ? 'Detected as Seed 🌱'
            : treeDetails.category === 'Vehicle'
            ? 'Detected as Vehicle 🚗'
            : null
        }
        onPress={() =>
          route?.params?.needToHome === true
          ? navigation.reset({
                index: 0,
                routes: [{name: 'IncidentList'}],
              })
            : navigation.goBack()
        }
        title={'Report Incidents'}
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
    </InputScrollView>
  );
};

export default TreeEntryScreen;

const styles = StyleSheet.create({});
