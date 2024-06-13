import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Images, Fonts} from '../../../constants';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {HelperText} from 'react-native-paper';
import Textarea from 'react-native-textarea/src/Textarea';
import Buttons from '../../../components/button/Buttons';
import {useNavigation, useRoute} from '@react-navigation/native';
import HeaderScreen from '../../../components/headerScreen/HeaderScreen';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useFocusEffect} from '@react-navigation/core';

const WorkNewVital = () => {
  const [note, setNote] = useState('');
  const navigation = useNavigation();
  const backButtonAction = () => {
    navigation.goBack();
  };
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
  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="New Vital"
        backbutton={{marginTop: responsiveHeight(3)}}
        titlestyle={{fontSize: responsiveFontSize(2.5)}}
        onPress={() => backButtonAction()}
      />
      <View>
        <TextInput
          // ref={heightRef}
          style={[styles.textinput, {marginTop: responsiveHeight(4)}]}
          placeholderTextColor={Colors.TEXT_HEAD}
          placeholder={'Height'}
          // value={height}
          // error={heightValidation}
          // onChangeText={setHeight}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   diameterRef.current.focus();
          // }}
        />
        <HelperText
          type="error"
          // visible={height.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {heightValidation} */}
        </HelperText>
        <TextInput
          // ref={diameterRef}
          placeholder={'Diameter'}
          // error={diameterValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={diameter}
          // onChangeText={setDiameter}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
        />
        <HelperText
          type="error"
          // visible={diameter.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {diameterValidation} */}
        </HelperText>
        <TextInput
          // ref={healthRef}
          placeholder={'Health'}
          // error={healthValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={health}
          // onChangeText={setHealth}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   radiusRef.current.focus();
          // }}
        />
        <HelperText
          type="error"
          // visible={health.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {healthValidation} */}
        </HelperText>
        <TextInput
          // ref={radiusRef}
          placeholder={'Radius'}
          // error={radiusValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={radius}
          // onChangeText={setRadius}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   dateRef.current.focus();
          // }}
        />
        <HelperText
          type="error"
          // visible={radius.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {radiusValidation} */}
        </HelperText>
        <TextInput
          // ref={radiusRef}
          placeholder={'Recorded Date'}
          // error={radiusValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={radius}
          // onChangeText={setRadius}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   dateRef.current.focus();
          // }}
        />
        <HelperText
          type="error"
          // visible={radius.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {radiusValidation} */}
        </HelperText>
        <TextInput
          // ref={radiusRef}
          placeholder={'Task'}
          // error={radiusValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={radius}
          // onChangeText={setRadius}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   dateRef.current.focus();
          // }}
        />
        <HelperText
          type="error"
          // visible={radius.length <= 0}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(2),
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {/* {radiusValidation} */}
        </HelperText>
        <TextInput
          // ref={radiusRef}
          placeholder={'Add Files'}
          // error={radiusValidation}
          placeholderTextColor={Colors.TEXT_HEAD}
          style={styles.textinput}
          // value={radius}
          // onChangeText={setRadius}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          // onSubmitEditing={() => {
          //   dateRef.current.focus();
          // }}
        />
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            flex: 1,
            bottom: 10,
            right: 25,
          }}>
          <TouchableOpacity style={styles.chooseBox}>
            <Text style={styles.chooseBoxText}>{'Choose'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: responsiveWidth(28),
          bottom: responsiveHeight(1),
          //      position:'absolute'
        }}>
        <Buttons
          title={`Submit & Save`}
          textstyle={styles._buttontext}
          style={styles._button}
          onPress={() => navigation.navigate('OtherVital')}
        />
      </View>
    </SafeAreaView>
  );
};

export default WorkNewVital;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  textinput: {
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    marginHorizontal: responsiveWidth(5),
    marginLeft: responsiveWidth(6),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    lineHeight: 18,
    letterSpacing: 0.7,
    marginTop: responsiveHeight(0),
  },
  noteAreaContainer: {
    height: responsiveHeight(14.8),
    marginTop: responsiveHeight(2),
    width: responsiveWidth(90),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: Colors.GREEN_COLOR,
  },
  noteArea: {
    textAlign: 'left', // hack android
    //   height: responsiveHeight(15),
    fontSize: 12,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.TEXT_HEAD,
    paddingTop: responsiveHeight(0.2),
  },
  _buttontext: {
    // flex:1,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  _button: {
    height: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_COLOR,
    marginTop: responsiveWidth(10),
    width: responsiveWidth(45),
    // marginLeft: responsiveHeight(3),
    borderRadius: 2,
  },
  chooseBox: {
    width: responsiveWidth(30),
    height: responsiveHeight(4),
    borderRadius: 2,
    backgroundColor: Colors.SUBJECT_INPUTLINE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseBoxText: {
    color: Colors.CHOOSE_BOX_TEXT,
    fontSize: responsiveFontSize(1.4),
  },
});
