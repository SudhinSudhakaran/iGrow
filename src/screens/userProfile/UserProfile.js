/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Profile Screen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 21 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Translations, Globals} from '../../constants';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {Buttons} from '../../components';
import {t} from 'i18next';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import StorageManager from '../../helpers/storageManager/StorageManager';
import {setUserDetails} from '../../redux/slice/userSlice';

import {useSelector, useDispatch} from 'react-redux';

import Utilities from '../../helpers/utils/Utilities';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

import geocoder from '@timwangdev/react-native-geocoder';
import {setIsAuthorized} from '../../redux/slice/authenticationSlice';
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/core';

import {setLastSyncAt} from '../../redux/slice/lastSyncSlice';
import {
  setIncidentPersist,
  setVitalPersist,
  setNotePersist,
} from '../../redux/slice/reduxPersistSlice';
import {
  addAdmins,
  addAssets,
  addIncidents,
  addProgrammes,
  addDepartments,
  addScheduleList,
  addAssetsImagesList,
  addIncidentsImagesList,
} from '../../redux/slice/offLineDBPersistSlice';
import SQLite from 'react-native-sqlite-storage';
var db = SQLite.openDatabase('AddTree');
import {Assets} from '../../database';
// import { openDatabase } from 'react-native-sqlite-storage';

// const db = openDatabase({
//   name: 'AddTree',
// });
const UserProfile = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const [location, setLocation] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const dispatch = useDispatch();
  const {userDetails} = useSelector(state => state.userDetails);
  const {profileData} = useSelector(state => state.profileData);
  const {notePersist} = useSelector(state => state.notePersist);
  const {vitalPersist} = useSelector(state => state.vitalPersist);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  useEffect(() => {
    const calculateTotalRecordCount = () => {
      setTotalRecordCount(
        (notePersist?.length || 0) +
          (vitalPersist?.length || 0) +
          (incidentPersist?.length || 0),
      );
    };

    calculateTotalRecordCount();
    // Assuming that notePersist, vitalPersist, and incidentPersist are dependencies
  }, [notePersist, vitalPersist, incidentPersist]);
  useEffect(() => {
    console.log('profile====', profileData);

    if (isConnected === true) {
      getUserDetails();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Clean up
      unsubscribe();
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      // checkLocationPermission();
      return undefined;
    }, []),
  );

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
    navigation.goBack();
  };

  const performLogout = () => {
    let logOutMessage = 'Are you sure you want to log out? ';
    if (totalRecordCount > 0) {
      logOutMessage =
        'Are you sure you want to log out? your data will be lost!';
    }

    Alert.alert(
      'Log out',
      logOutMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            logoutAction();
          },
        },
      ],
      {cancelable: false},
    );
  };
//   const deleteDatabase=(db:'AddTree')=>{
//   SQLite.deleteDatabase(
//     {name: 'AddTree'},  
//     () => { console.log('second db deleted');  },
//     error => {
//         console.log("ERROR: " + error); 
//     }
// );
//   }
 const deleteTable = async () => {
    const query ='DROP TABLE assets';
    console.log('deleted assets');
    await db.executeSql(query);
  };
  const deleteTableNote = async () => {
    const query = 'DROP TABLE Note';
    console.log('deleted notes');
    await db.executeSql(query);
  };
  const deleteTableVitals = async () => {
    const query = 'DROP TABLE Vitalss';
    console.log('deleted vitals');
    await db.executeSql(query);
  };
  const deleteTableimages = async () => {
    const query = 'DROP TABLE images';
    console.log('deleted images');
    await db.executeSql(query);
  };
  const deleteTableincidentimages = async () => {
    const query = 'DROP TABLE incidentimages';
    console.log('deleted incident images');
    await db.executeSql(query);
  };
  const deleteTableincidents = async () => {
    const query = 'DROP TABLE incident';
    console.log('deleted incident');
    await db.executeSql(query);
  };
  const logoutAction = async () => {
    try {
      deleteTable();
      deleteTableNote();
      deleteTableVitals();
      deleteTableimages();
      deleteTableincidents();
      deleteTableincidentimages();
      Globals.USER_DETAILS = {};
      Globals.IS_AUTHORIZED = false;
      Globals.TOKEN = '';
      Globals.PIN = '';
      Globals.USER_EMAIL = '';
      (Globals.ASSETS_LIST = []), dispatch(setUserDetails({}));
      dispatch(setIsAuthorized(false));

      dispatch(setLastSyncAt(''));
      // redux persist
      dispatch(setNotePersist([]));
      dispatch(setIncidentPersist([]));
      dispatch(setVitalPersist([]));
      dispatch(addAssets([]));
      dispatch(addAssetsImagesList([]));
      dispatch(addAdmins([]));
      dispatch(addIncidents([]));
      dispatch(addProgrammes([]));
      dispatch(addDepartments([]));
      dispatch(addScheduleList([]));
      dispatch(addIncidentsImagesList([]));

      StorageManager.storeScheduleList([]);

      StorageManager.storeAdmins([]);
      StorageManager.storeIncidentsList([]);
      StorageManager.storeProgramList([]);
      StorageManager.storeAssets([]);
      StorageManager.storeDepartmentsList([]);

      StorageManager.clearUserRelatedData();
      /**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Deleate the Assets table in SQ lite
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 09-07-2023
 * Steps:
 * 1.   
 <---------------------------------------------------------------------------------------------->
 */
      // db.transaction(tx => {
      //   tx.executeSql(
      //     'DROP TABLE IF EXISTS Assets',
      //     [],
      //     (tx, results) => {
      //       console.log('Table deleted successfully!');
      //     },
      //     error => {
      //       console.log('Error deleting table:', error);
      //     },
      //   );
      // });


      Assets.data().map(item => {
        var item1 = Assets.get({id: item.id});
        Assets.remove(item1);
      });
    } catch (err) {
      console.log(err);
    }

    //Navigate to EmailLoginscreen
    navigation.reset({
      index: 0,
      routes: [{name: 'EmailLoginScreen'}],
    });
  };

  /**
   * Purpose: Get userDetail
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 20 March 2023
   * Steps:
     1.fetch vital details from API and append to state variable
*/

  const getUserDetails = () => {
    console.log('Globals.USER_EMAIL', userDetails?.email);
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'users',
      [APIConnections.KEYS.METHOD]: 'show',
      [APIConnections.KEYS.FILTERS_EMAIL]: userDetails?.email,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');
    DataManager.fetchUserDetails(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response========', isSuccess, response);
        if (isSuccess === true) {
          if (response !== undefined && response !== null) {
            dispatch(setUserDetails(response.result));

            setTimeout(() => {
              setIsLoading(false);
            }, 3000);
          } else {
            setTimeout(() => {
              setIsLoading(false);
            }, 3000);
            Utilities.showToast('Sorry!', message, 'error', 'bottom');
          }
        } else {
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
          // Utilities.showToast('Sorry!', message, 'error', 'bottom');
        }
      },
    );
  };

  const ProfileLoader = () => (
    <ContentLoader
      speed={1.8}
      width={'100%'}
      height={100}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="50" rx="10" ry="10" width="70%" height="16" />
      <Rect x="5%" y="80" rx="10" ry="10" width="80%" height="16" />
    </ContentLoader>
  );

  const RewardLoader = () => (
    <ContentLoader
      speed={1.8}
      width={'100%'}
      height={150}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="40" rx="0" ry="0" width="40%" height="100" />
    </ContentLoader>
  );

  const ButtonLoader = () => (
    <ContentLoader
      speed={1.8}
      width={'100%'}
      height={70}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="25%" y="20" rx="2" ry="2" width="50%" height="46" />
    </ContentLoader>
  );
  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title={t(Translations.PROFILE)}
        description={t(Translations.ABOUT_YOUR_PROFILE)}
        onPress={() => backButtonAction()}
      />
      {isLoading ? (
        <ProfileLoader />
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.nameText}>
            {isConnected ? userDetails?.name : profileData?.result?.name || ''}
          </Text>
          <Text style={styles.gmailText}>
            {isConnected
              ? userDetails?.email
              : profileData?.result?.email || ''}
          </Text>
          <Text style={styles.gmailText}>
            {isConnected ? userDetails?.role : profileData?.result?.role || ''}
          </Text>
          {/* <Text style={styles.gmailText}>{location?.lat || ''}</Text> */}
        </View>
      )}
      {isLoading ? (
        <RewardLoader />
      ) : (
        <View
          style={{
            marginTop: responsiveHeight(8),
            marginLeft: responsiveHeight(3),
          }}>
          <View style={styles.rewardBox}>
            <Text style={styles.rewardNumber}>
              {isConnected
                ? userDetails?.reward || 'N/A'
                : profileData?.result?.reward || 'N/A'}
            </Text>
            <Text style={styles.rewardText}>🏆 Reward Points </Text>
          </View>
        </View>
      )}

      <View style={{marginTop: responsiveHeight(38), alignItems: 'center'}}>
        {isLoading ? (
          <ButtonLoader />
        ) : (
          <TouchableOpacity
            style={styles.ButtonView}
            onPress={() => performLogout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  profileContainer: {
    marginLeft: responsiveHeight(3),
    marginTop: responsiveHeight(10),
  },
  nameText: {
    color: Colors.GMAIL_COLOR,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.7,
  },
  gmailText: {
    color: Colors.GMAIL_COLOR,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.7,
  },
  rewardBox: {
    width: responsiveWidth(45),
    height: responsiveHeight(15),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.GREEN_COLOR,
    backgroundColor: Colors.REWARD_BOX_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardNumber: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 36,
    lineHeight: 47,
    textAlign: 'center',
    letterSpacing: 0.7,
    color: Colors.GMAIL_COLOR,
  },
  rewardText: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.7,
    color: Colors.GMAIL_COLOR,
  },
  ButtonView: {
    height: responsiveHeight(6),
    width: responsiveWidth(75),
    backgroundColor: Colors.LOGOUT_BUTTON_COLOR,
    borderColor: Colors.LOGOUT_BORDER_COLOR,
    borderRadius: 6,
    borderWidth: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: Fonts.UBUNTU_REGULAR,
    color: Colors.WHITE_COLOR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
});
