/**
    * Purpose: Create EmailLogin Screen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 17 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {AppLogo, Buttons} from '../../../components';
import Utilities from '../../../helpers/utils/Utilities';
import {useNavigation} from '@react-navigation/core';
import {Globals, Translations, Images} from '../../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Colors, Fonts} from '../../../constants';
import {t} from 'i18next';
import DataManager from '../../../helpers/apiManager/DataManager';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import {useDispatch} from 'react-redux';
import {setUserDetail, setUserDetails} from '../../../redux/slice/userSlice';

import StorageManager from '../../../helpers/storageManager/StorageManager';
import NetInfo from '@react-native-community/netinfo';
import LoadingIndicator from '../../../components/loader/LoadingIndicator';

const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const emailRef = useRef();
  const passwordRef = useRef();
  const scrollViewRef = useRef();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  //  navigation.reset({
  //    index: 0,
  //    routes: [{name: 'EmailLoginScreen'}],
  //  });

  const isValidInputs = () => {
    var _isValidEmail = 0;
    var _isValidPassword = 0;
    if (email.length <= 0) {
      setEmailErrorText('Please enter email');
      _isValidEmail = 0;
    } else if (Utilities.isEmailValid(email) !== true) {
      setEmailErrorText('Invalid email address');
      _isValidEmail = 0;
    } else {
      setEmailErrorText('');
      _isValidEmail = 1;
    }
    if (password.length === 0) {
      setPasswordError('Please enter password');
      _isValidPassword = 0;
    } else if (password.length < 6) {
      setPasswordError('Must contain at least 6 or more characters');
      _isValidPassword = 0;
    } else {
      setPasswordError('');
      _isValidPassword = 1;
    }
    if (_isValidEmail === 1 && _isValidPassword === 1) {
      if (isConnected) {
        performLogin();
      } else {
        Utilities.showToast(
          'Sorry!',
          'Please check your internet connection',
          'error',
          'bottom',
        );
      }
    }
  };

  //Button actions
  const continueButtonAction = () => {
    isValidInputs();
  };

  // API CALL

  /**
   * Purpose: Perform emaillogin
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 28 Feb 2023
   * Steps:
     1.fetch vital details from API and append to state variable
*/

  const performLogin = () => {
    // navigation.navigate('OtpScreen');
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.METHOD]: 'get',
      [APIConnections.KEYS.RESOURCE]: 'authenticate',
      [APIConnections.KEYS.FILTERS_USERNAME]: email,
      [APIConnections.KEYS.FILTERS_PASSWORD]: password,
      [APIConnections.KEYS.DEVICE_ID]: Globals.DEVICE_ID,
    };

    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.performEmailLogin(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true) {
          StorageManager.saveUserEmail(email);
          Globals.USER_EMAIL = email;
          navigation.navigate('OtpScreen', {tempToken: response.token});
          setIsLoading(false);
        } else {
          Utilities.showToast('failed', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };
  return (
    <InputScrollView
      contentContainerStyle={{alignItems: 'center'}}
      style={styles.container}
      keyboardOffset={285}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: responsiveHeight(15),
        }}>
        <AppLogo />
      </View>
      <LoadingIndicator visible={isLoading} />
      <View
        style={{
          marginTop: responsiveHeight(5),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
            color: Colors.LOGINTEXT_COLOR,
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: 14,
            lineHeight: 18,
            textAlign: 'right',
          }}>
          {t(Translations.LOGIN)}
        </Text>
      </View>

      <View
        style={{
          marginTop: responsiveHeight(3),
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          style={{
            height: responsiveHeight(5.5),
            width: responsiveWidth(75),
            borderWidth: responsiveHeight(0.2),
            borderColor: Colors.INNERTEXTINPUT_COLOR,
            backgroundColor: Colors.TEXTINPUT_BACKGROUND_COLOR,
            borderRadius: responsiveHeight(1),
            padding: responsiveHeight(1.5),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 16,
            color: Colors.LOGINTEXT_COLOR,
          }}
          placeholder="Username"
          placeholderTextColor={Colors.LOGINTEXT_COLOR}
          value={email}
          keyboardType={'email-address'}
          onChangeText={text => setEmail(text)}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
        />
        <Text
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'center',
            marginTop: emailErrorText
              ? responsiveHeight(1)
              : responsiveHeight(0),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {emailErrorText}
        </Text>
      </View>
      <View
        style={{
          marginTop: emailErrorText ? responsiveHeight(2) : responsiveHeight(0),
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          style={{
            height: responsiveHeight(5.5),
            width: responsiveWidth(75),
            borderWidth: responsiveHeight(0.2),
            borderColor: Colors.INNERTEXTINPUT_COLOR,
            backgroundColor: Colors.TEXTINPUT_BACKGROUND_COLOR,
            borderRadius: responsiveHeight(1),
            padding: responsiveHeight(1.5),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 16,
            color: Colors.LOGINTEXT_COLOR,
          }}
          ref={passwordRef}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          placeholderTextColor={Colors.LOGINTEXT_COLOR}
          autoCorrect={false}
          autoComplete={'off'}
          secureTextEntry={!isShowPassword}
          onSubmitEditing={() => {
            continueButtonAction();
          }}
        />
        <View
          style={{
            width: 30,
            height: 24,
            position: 'absolute',
            right: 4,
            top: 13,
          }}>
          <TouchableOpacity onPress={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword ? (
              <Image
                style={{height: 20, width: 20, tintColor: Colors.GREEN_COLOR}}
                source={Images.PASSWORD_EYE_OPEN}
              />
            ) : (
              <Image
                style={{height: 20, width: 20, tintColor: Colors.GREEN_COLOR}}
                source={Images.PASSWORD_EYE_CLOSE}
              />
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'center',
            marginTop: responsiveHeight(1),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
          }}>
          {passwordError}
        </Text>
      </View>
      {/* <View style={{marginTop: responsiveHeight(1)}}>
        <Text
          style={{
            marginRight: responsiveHeight(0),
            fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
            color: Colors.LOGINTEXT_COLOR,
            fontWeight: '500',
            fontStyle: 'normal',
            fontSize: 12,
            lineHeight: 16,
            textAlign: 'right',
          }}>
          {t(Translations.FORGOT_PASSWORD)}
        </Text>
      </View> */}

      <Buttons
        textstyle={styles.buttontext}
        style={{
          borderRadius: responsiveHeight(0.8),
          height: responsiveHeight(6),
          width: responsiveWidth(50),
          marginTop: responsiveHeight(5),
          marginBottom:
            passwordError || emailErrorText
              ? responsiveHeight(1)
              : responsiveHeight(2),
          backgroundColor: Colors.BUTTON_BACKGROUND_COLOR,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        title={t(Translations.LOGIN)}
        onPress={() => continueButtonAction()}
      />
    </InputScrollView>
  );
};

export default EmailLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  buttontext: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    color: Colors.WHITE_COLOR,
    letterSpacing: 0.7,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
});
