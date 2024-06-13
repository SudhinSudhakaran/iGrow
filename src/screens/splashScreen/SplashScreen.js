/**
    * Purpose: Create Splash Screen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 17 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';

import React, {useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/core';
import {AppLogo} from '../../components';
import {useNavigation} from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';
import {Colors, Globals, Strings} from '../../constants';
import StorageManager from '../../helpers/storageManager/StorageManager';
import {setIsAuthorized} from '../../redux/slice/authenticationSlice';
import {setUserDetails} from '../../redux/slice/userSlice';

import {useDispatch, useSelector} from 'react-redux';

import Geolocation from '@react-native-community/geolocation';
import {setNotificationCount} from '../../redux/slice/notificationCountSlice';
import {setDetailSchedule} from '../../redux/slice/scheduleDetailSlice';
import {setProfileData} from '../../redux/slice/profileSlice';
import {PERMISSIONS} from 'react-native-permissions';
import {setLastSyncAt} from '../../redux/slice/lastSyncSlice';
import {
  addAdmins,
  addAssets,
  addDepartments,
  addIncidents,
  addProgrammes,
  addScheduleList,
} from '../../redux/slice/offLineDBPersistSlice';
import SQLite from 'react-native-sqlite-storage';
import { checkMultiplePermissions } from '../../helpers/utils/Permission';
import { useState } from 'react';
import { platform } from 'os';

var db = SQLite.openDatabase('igrowAssets.db');
const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getIsUserLoggedIn = async () => {
    return await StorageManager.getIsAuth();
  };
  const getToken = async () => {
    return await StorageManager.getSavedToken();
  };
  const getUserDetails = async () => {
    return await StorageManager.getUserDetails();
  };

  const getAuthPin = async () => {
    return await StorageManager.getSavedPin();
  };

  const _getSavedCount = async () => {
    return await StorageManager.getSavedCount();
  };
  const _getStartedTask = async () => {
    return await StorageManager.getStartedTask();
  };
  const _getProfileData = async () => {
    return await StorageManager.getProfileData();
  };

  const getLastSyncAt = async () => {
    return await StorageManager.getSavedLastSyncAt();
  };

  // persist

  const getAdminList = async () => {
    return await StorageManager.getAdminList();
  };

  const getIncidentsList = async () => {
    return await StorageManager.getIncidentsList();
  };

  const getSchedulesList = async () => {
    return await StorageManager.getSchedulesList();
  };

  const getProgramList = async () => {
    return await StorageManager.getProgramList();
  };

  const getDepartmentsList = async () => {
    return await StorageManager.getDepartmentsList();
  };
  const getIncidentImages = async () => {
    return await StorageManager.getIncidentImageList();
  };
  const getAssetsImages = async () => {
    return await StorageManager.getAssetImageList();
  };
  useEffect(() => {
    checkLocationPermission();
  }, []);
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Load assets data from SQlite
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 09-07-2023
 * Steps:
 * 1.   Execute the data fetching query
 * 2.   loop the result array
 * 3.   push the items to temp
 * 4.   parse the assets data
 * 5.   Assign the parsed data to global variable
 <---------------------------------------------------------------------------------------------->
 */
  useEffect(() => {
    // SQLite.enablePromise(true);
  }, []);

  const checkLocationPermission = async () => {
    let deviceVersion = DeviceInfo.getSystemVersion();
    if(deviceVersion>=13)
    {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to your storage to download Photos',
      },
    );
        const notificationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Notification",
            message: "Please allow to show notifications",
          }
        );
    console.log('storage permission', granted,notificationGranted);
    if (granted === 'denied' || granted === 'never_ask_again'&&notificationGranted) {
      BackHandler.exitApp();
    } else {
      Geolocation.getCurrentPosition(
        position => {
          console.log('position', position);
          checkUserIsAuthorizedOrNot();
          getDeviceId()
            .then(deviceId => {
              console.log('Device ID:::::', deviceId);
              Globals.DEVICE_ID = deviceId;
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        error => {
          console.log(error.code, error.message);
          if (error.code === 1) {
            BackHandler.exitApp();
          } else {
            checkUserIsAuthorizedOrNot();
            getDeviceId()
              .then(deviceId => {
                console.log('Device ID:::::', deviceId);
                Globals.DEVICE_ID = deviceId;
              })
              .catch(error => {
                console.error('Error:', error);
              });
          }
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }
else{
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission Required',
      message: 'App needs access to your storage to download Photos',
    },
  );
  console.log('storage permission', granted);
  if (granted === 'denied' || granted === 'never_ask_again') {
    BackHandler.exitApp();
  } else {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        checkUserIsAuthorizedOrNot();
        getDeviceId()
          .then(deviceId => {
            console.log('Device ID:::::', deviceId);
            Globals.DEVICE_ID = deviceId;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      error => {
        console.log(error.code, error.message);
        if (error.code === 1) {
          BackHandler.exitApp();
        } else {
          checkUserIsAuthorizedOrNot();
          getDeviceId()
            .then(deviceId => {
              console.log('Device ID:::::', deviceId);
              Globals.DEVICE_ID = deviceId;
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }
}
  };

  const getDeviceId = () => {
    return new Promise((resolve, reject) => {
      // Code to get device ID here
      const deviceId = Globals.DEVICE_ID; // Replace with actual device ID
      resolve(deviceId);
    });
  };

  const checkUserIsAuthorizedOrNot = () => {
    Globals.DEVICE_ID = DeviceInfo.getUniqueId();

    getIsUserLoggedIn().then(res => {
      let authorized = res === 'true' ? true : false;
      console.log('user is authorized ', res, authorized);
      dispatch(setIsAuthorized(authorized));

      if (authorized === true) {
        getToken().then(res => {
          console.log('Saved token =====', res);
          Globals.TOKEN = res;

          if (Globals.TOKEN !== null) {
            _getSavedCount().then(res => {
              console.log('saved count ===.>', res);
              dispatch(setNotificationCount(res));
            });
            _getStartedTask().then(res => {
              dispatch(setDetailSchedule(res));
            });
            _getProfileData().then(res => {
              dispatch(setProfileData(res));
            });
            getLastSyncAt().then(res => {
              console.log(
                'last sync--------------------------------------------------',
                res,
              );
              dispatch(setLastSyncAt(res !== null && res !== '' ? res : ''));
            });
            // gets persist values

            getIncidentImages().then(res => {
              Globals.INCIDENT_IMAGE_LIST = res !== null ? [...res] : [];
            });
            getAssetsImages().then(res => {
              Globals.ASSETS_IMAGE_LIST = res !== null ? [...res] : [];
            });

            getAdminList().then(res => {
              console.log('Admin list in splash screen', res);
              dispatch(addAdmins(res !== null ? res : []));
            });
            getIncidentsList().then(res => {
              dispatch(addIncidents(res !== null ? res : []));
            });
            getSchedulesList().then(res => {
              dispatch(addScheduleList(res !== null ? res : []));
            });
            getProgramList().then(res => {
              dispatch(addProgrammes(res !== null ? res : []));
            });
            getDepartmentsList().then(res => {
              dispatch(addDepartments(res !== null ? res : []));
            });

            getAuthPin().then(_pin => {
              console.log('Saved pin =====', _pin);
              Globals.PIN = _pin;
              if (_pin !== '') {
                getUserDetails().then(data => {
                  console.log('UserData', data);
                  dispatch(setUserDetails(data));

                  setTimeout(() => {
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'OtpScreen',
                        },
                      ],
                    });
                  });
                }, 5000);
              } else {
                setTimeout(() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'EmailLoginScreen',
                      },
                    ],
                  });
                }, 5000);
              }
            });
          } else {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'EmailLoginScreen',
                  },
                ],
              });
            }, 5000);
          }
        });
      } else {
        dispatch(setLastSyncAt(''));
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'EmailLoginScreen',
              },
            ],
          });
        }, 5000);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppLogo />

      <Text
        style={{
          color: Colors.GMAIL_COLOR,
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
        {Strings.APP_VERSION}
      </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
});
