/**
    * Purpose: Create Header Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 17 Feb 2023
    *   * Steps: 1. Add back arrow button
             2. Add Main heading
    */

import {StyleSheet, Text, View, TouchableOpacity, Image,BackHandler} from 'react-native';
import React,{useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Fonts, Images, Colors} from '../../constants';
import {useNavigation} from '@react-navigation/core';
const HeaderScreen = ({title, description, onPress, style,titlestyle,backbutton}) => {
  const navigation = useNavigation();
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
  },[]);
  const backButtonAction = () => {
    navigation.goBack();
  }

  return (
    <>
      <View style={{backgroundColor: Colors.WHITE_COLOR, }}>
        <TouchableOpacity onPress={() => onPress() || null}>
          <Image source={Images.HEADER_BACK_ICON} style={[styles.backbutton,backbutton]} />
        </TouchableOpacity>
        <Text style={[styles.title, titlestyle]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </>
  );
};

export default HeaderScreen;

const styles = StyleSheet.create({
  backbutton: {
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    width: responsiveScreenWidth(3),
    height: responsiveScreenHeight(2),
  },
  title: {
    position: 'absolute',
    marginLeft: responsiveWidth(13),
    marginTop: responsiveHeight(2),
    fontSize: 24,
    color:Colors.GMAIL_COLOR,
    fontWeight: '500',
    lineHeight: 31,
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
  },
  description: {
    // position:'absolute',
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontSize: 14,
    color: Colors.DETECTED_AS_TREE_COLOR,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.7,
    marginLeft: responsiveScreenWidth(13.5),
    marginRight: responsiveWidth(32),
    marginTop: responsiveHeight(0.5),
    // width: responsiveWidth(41),
    height: responsiveWidth(4.4),
  },
  image: {
    marginLeft: responsiveScreenWidth(10),
    marginRight: responsiveWidth(7),
    marginTop: responsiveHeight(2),
    width: responsiveWidth(200),
    height: responsiveWidth(80),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imagesmall: {
    width: responsiveWidth(13),
    height: responsiveWidth(10),
    marginTop: responsiveHeight(2),
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(3),
    color: Colors.GREEN_COLOR,
  },
});
