/**
    * Purpose: Create Pin Screen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {AppLogo, Buttons} from '../../components';
import {Colors, Fonts, Translations} from '../../constants';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute} from '@react-navigation/core';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Timer from '../../components/timer/Timer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';
import {t} from 'i18next';
import APIConnections from '../../helpers/apiManager/APIConnections';
import {Globals} from '../../constants';
import DataManager from '../../helpers/apiManager/DataManager';
import StorageManager from '../../helpers/storageManager/StorageManager';
// import StorageManager from '../../helpers/storageManager/StorageManager';

import {useDispatch} from 'react-redux';
import {setUserDetails} from '../../redux/slice/userSlice';
import {setIsAuthorized} from '../../redux/slice/authenticationSlice';
import jwt_decode from 'jwt-decode';
import {HelperText} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import {useSelector} from 'react-redux';
import Utilities from '../../helpers/utils/Utilities';
import LoadingIndicator from '../../components/loader/LoadingIndicator';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useFocusEffect} from '@react-navigation/core';
import {selectParsedAssets} from '../../redux/slice/offLineDBPersistSlice';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'igrowAssets.db'});
const OtpScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const otpRef = useRef();
  const [enteredPin, setEnteredPin] = useState('');
  const [isValidEnteredPin, setIsValidEnteredPin] = useState(true);
  const [pinValidationMessage, setPinValidationMessage] = useState('');
  const [clearInput, setclearInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [networkValidation, setNetworkValidation] = useState('');

  const route = useRoute();

  const {isAuthorized} = useSelector(state => state.authorization);

  useEffect(() => {
    console.log('assets in otp :::::::::::', Globals.ASSETS_LIST);
    return () => {
      setEnteredPin('');
    };
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const continueButtonAction = code => {
    isValidInputs(code);
  };

  const checkAuthPin = code => {
    console.log(' check pin called enteredPin', code, Globals.PIN);
    if (code === Globals.PIN) {
      // Globals.NEED_SYNC = true;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomePageScreen',
          },
        ],
      });
      setIsLoading(false);
    } else {
      setNetworkValidation('Invalid pin');
      setIsLoading(false);
    }
  };

  const isValidInputs = code => {
    var _isValidEnteredPin = 0;
    if (code) {
      setPinValidationMessage('');
      setIsValidEnteredPin(true);
      _isValidEnteredPin = 1;
    } else {
      setPinValidationMessage('please enter your valid PIN');
      setIsValidEnteredPin(false);
      _isValidEnteredPin = 0;
    }
    if (_isValidEnteredPin === 1) {
      if (isAuthorized === true) {
        // setIsLoading(true);
        checkAuthPin(code);
      } else {
        if (isConnected) {
          performPinLogin(code);
        } else {
          setNetworkValidation('Please check your internet connection');
        }
      }
    }
  };

  const decodeToken = token => {
    const decodedToken = jwt_decode(token);
    console.log('decodedToken =', decodedToken.user);
    dispatch(setUserDetails(decodedToken?.user || {}));
    StorageManager.saveUserDetails(decodedToken?.user);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomePageScreen',
        },
      ],
    });
  };

  // API CALL

  /**
   * Purpose: Perform Pin login
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 16 march 2023
   * Steps:
     1.fetch vital details from API and append to state variable
*/

  const performPinLogin = code => {
    setIsLoading(true);
    // navigation.navigate('OtpScreen');
    console.log('fcm token===', Globals.FCM_TOKEN);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.METHOD]: 'pin',
      [APIConnections.KEYS.RESOURCE]: 'authenticate',
      [APIConnections.KEYS.FILTERS_PIN]: code,
      [APIConnections.KEYS.TEMPORARY_TOKEN]: route.params.tempToken,
      [APIConnections.KEYS.DEVICE_ID]: Globals.DEVICE_ID,
      [APIConnections.KEYS.FCM_TOKEN]: Globals.FCM_TOKEN,
    };

    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.performPinLogin(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response data ====>>>>', response);

        if (isSuccess === true) {
          // dispatch(setUserDetails(response.result));

          // StorageManager.saveUserDetails(response.result);
          // dispatch(setUserDetails(response.result));
          dispatch(setIsAuthorized(true));
          StorageManager.saveUserDetails(response.result);

          StorageManager.saveIsAuth('true');
          StorageManager.savePin(code);
          StorageManager.saveToken(response.token);
          Globals.TOKEN = response.token;
          decodeToken(response.token);
          Globals.NEED_SYNC = true;
          setIsLoading(false);
        } else {
          Utilities.showToast('Failed', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraHeight={responsiveHeight(15)}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{alignItems: 'center'}}
      style={styles.container}>
      <View style={{marginTop: responsiveHeight(15)}}>
        <AppLogo />
      </View>
      <LoadingIndicator visible={isLoading} />
      <View style={{marginTop: responsiveHeight(5), alignItems: 'center'}}>
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
          {t(Translations.ENTER_PIN)}
        </Text>
        <View style={{marginTop: responsiveHeight(2)}}>
          <OTPInputView
            ref={otpRef}
            style={{
              width: responsiveWidth(80),
              height: 100,
              // padding: responsiveHeight(6),
              // backgroundColor:'red'
            }}
            pinCount={4}
            code={enteredPin}
            autoFocusOnLoad={false}
            secureTextEntry={true}
            onCodeChanged={code => {
              setEnteredPin(code);
            }}
            codeInputFieldStyle={{
              width: responsiveWidth(17),
              height: responsiveHeight(9),
              borderWidth: 1,
              borderColor: Colors.INNERTEXTINPUT_COLOR,
              borderRadius: 6,
              backgroundColor: Colors.TEXTINPUT_BACKGROUND_COLOR,
              color: Colors.ITEM_COLOR,
              fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
            }}
            onCodeFilled={code => {
              continueButtonAction(code);
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: Colors.VALIDATION_COLOR,
              fontSize: responsiveFontSize(1.5),
            }}>
            {pinValidationMessage ? pinValidationMessage : networkValidation}
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          borderRadius: responsiveHeight(0.8),
          height: responsiveHeight(6),
          width: responsiveWidth(50),
          marginTop: responsiveHeight(5),
          justifyContent: 'center',
          alignSelf: 'center',
          backgroundColor: Colors.BUTTON_BACKGROUND_COLOR,
        }}>
        <Buttons
          style={styles.buttontext}
          title="Submit"
          onPress={() => continueButtonAction()}
        />
      </View> */}
    </KeyboardAwareScrollView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  buttontext: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: responsiveFontSize(1.6),
    color: Colors.WHITE_COLOR,
  },
});
