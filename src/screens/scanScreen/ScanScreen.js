/**
    * Purpose: Create Details Screen Component
    * Created/Modified By: Sudhin Sudahakaran
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. Create Screen
             2. scan qr/bar code
    */

             import {
              SafeAreaView,
              StyleSheet,
              Text,
              View,
              Dimensions,
              TouchableOpacity,
              BackHandler,
              Linking,
              Alert,
              Platform,
            } from 'react-native';
            import React from 'react';
            import QRCodeScanner from 'react-native-qrcode-scanner';
            import HeaderScreen from '../../components/headerScreen/HeaderScreen';
            import {t} from 'i18next';
            import {Colors, Fonts, Globals, Translations} from '../../constants';
            import {useNavigation, useFocusEffect} from '@react-navigation/native';
            import {useRoute} from '@react-navigation/native';
            import NetInfo from '@react-native-community/netinfo';
            import {
              responsiveHeight,
              responsiveWidth,
            } from 'react-native-responsive-dimensions';
            import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
            import {Buttons} from '../../components';
            import {useState, useEffect} from 'react';
            import Utilities from '../../helpers/utils/Utilities';
            import {useSelector, useDispatch} from 'react-redux';

            import APIConnections from '../../helpers/apiManager/APIConnections';
            import DataManager from '../../helpers/apiManager/DataManager';
            import Geocoder from '@timwangdev/react-native-geocoder';

            import {
              settreeDetails,
              settreeIsLoading,
              setSelectedQr,
              setAssetsLocation,
              setnoteDetails,
              setvitalsDetails,
              setimagesDetails,
              setincidentDetails,
            } from '../../redux/slice/treeDetailSlice';

            import {PERMISSIONS} from 'react-native-permissions';
            import {checkMultiplePermissions} from '../../helpers/utils/Permission';

            import {addAssets, addIncidentsImagesList} from '../../redux/slice/offLineDBPersistSlice';
            import {Assets} from '../../database';
            import LoadingIndicator from '../../components/loader/LoadingIndicator';

            import Modal from 'react-native-modal';
            import { openDatabase } from 'react-native-sqlite-storage';

            const db = openDatabase({
              name: 'AddTree',
            });
            const ScanScreen = () => {
              const route = useRoute();
              const navigation = useNavigation();

              const [showCamera, setShowCamera] = useState(false);
              const [isConnected, setIsConnected] = useState(true);

              const [isLoading, setIsLoading] = useState(true);

              const dispatch = useDispatch();
              //redux State
              const {treeDetails} = useSelector(state => state.treeDetails);
              const {vitalsDetails} = useSelector(state => state.vitalsDetails);
              const {noteDetails} = useSelector(state => state.noteDetails);
              const {imagesDetails} = useSelector(state => state.imagesDetails);
              const {assetList} = useSelector(state => state.assetList);

              const {assets} = useSelector(state => state.offLineDBState);
              const [camLoader, setCamLoader] = useState(true);
              const [_modalVisible, _setModalVisible] = useState(false);
              useEffect(() => {
                const unsubscribe = NetInfo.addEventListener(state => {
                  setIsConnected(state.isConnected);
                });
                return () => {
                  unsubscribe();
                };
              }, []);
              useFocusEffect(
                React.useCallback(() => {
                  dispatch(addIncidentsImagesList([]));
                  dispatch(setincidentDetails([]));
                  console.log('inside useFocusEffect');
                  setData();
                  return () => setShowCamera(false);
                }, []),
              );
              const setData = () => {
                var _Assets = Assets.data() || [];

                if (_Assets.length > 0) {
                   Globals.ASSETS_LIST = JSON.parse(_Assets[0]?.assets) || [];

                }
                  setCamLoader(false);
                  openCamera();

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

              const openCamera = async () => {
                console.log(' Camera selected');
                const permissions =
                  Platform.OS === 'ios'
                    ? [PERMISSIONS.IOS.CAMERA]
                    : [PERMISSIONS.ANDROID.CAMERA];

                // Call our permission service and check for permissions
                var isPermissionGranted = await checkMultiplePermissions(permissions);
                console.log('isPermissionGranted ===>', isPermissionGranted);
                if (isPermissionGranted) {
                  setShowCamera(true);
                } else {
                  // Show an alert in case permission was not granted
                  Alert.alert(
                    'Permission Request',
                    'Please allow permission to access the camera.',
                    [
                      {
                        text: 'Go to Settings',
                        onPress: () => {
                          Linking.openSettings();
                          navigation.goBack();
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                          navigation.goBack();
                        },
                      },
                    ],
                    {cancelable: true},
                  );
                }
              };
              const getPosition = async (myLat, myLon) => {
                if (myLat !== null && myLat !== '' && myLon !== null && myLon !== '') {
                  try {
                    const position = {lat: myLat, lng: myLon};
                    let location = await Geocoder.geocodePosition(position);
                    console.log('location ====> ', location);
                    dispatch(setAssetsLocation(location));
                    setIsLoading(false);
                    var _message = [
                      location?.[0]?.subLocality,
                      location?.[1]?.locality,
                      location?.[0]?.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ');

                  } catch (err) {}
                }
              };
              const performViewTree = qrValue => {
                console.log('Perform get tree');
                dispatch(settreeIsLoading(true));
                var _body = {
                  [APIConnections.KEYS.KEY]: Globals.API_KEY,
                  [APIConnections.KEYS.METHOD]: 'get',
                  [APIConnections.KEYS.FILTERS_QRVALUE]: qrValue,
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
                    if (responseData !== undefined && responseData.length > 0) {
                      var scannedData = responseData[0];
                      scannedData.qrvalue = qrValue;
                      console.log('responseData[0]..............', scannedData);
                      dispatch(settreeDetails(scannedData));
                      let newAssetsList = [...Globals.ASSETS_LIST, scannedData];
                      dispatch(addAssets(newAssetsList));

                      setTimeout(() => {
                        dispatch(settreeIsLoading(false));
                      }, 4000);
                      dispatch(setSelectedQr(qrValue));
                      route.params.isFromIncident
                        ? navigation.navigate('TreeEntryScreen', {
                            needToHome: route.params.isFromIncident,
                          })
                        : responseData[0].category === 'Tree'
                        ? navigation.navigate('DetailsScreen')
                        : responseData[0].category === 'Vehicle'
                        ? navigation.navigate('CarScreen')
                        : responseData[0].category === 'Seed'
                        ? navigation.navigate('SeedScreen')
                        : navigation.navigate('DetailsScreen');
                    } else {
                      Utilities.showToast(
                        'Sorry!',
                        'Scanned item not found',
                        'error',
                        'bottom',
                      );
                    }
                  } else {
                    setTimeout(() => {
                      dispatch(settreeIsLoading(false));
                    }, 4000);
                    Utilities.showToast('Sorry!', message, 'error', 'bottom');
                  }
                });
              };

              const backButtonAction = () => {
                navigation.goBack();
              };
              const getAssetByQRValue = qrvalue => {
                return new Promise((resolve, reject) => {
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT * FROM assets WHERE qrvalue = ?',
                      [qrvalue],
                      (_, { rows }) => {
                        // Retrieve the first row (if exists)
                        if (rows.length > 0) {
                          const asset = rows.item(0);
                          resolve(asset);
                        } else {
                          // QR value not found
                          resolve(null);
                        }
                      },
                      error => {
                        reject(error);
                      }
                    );
                  });
                });
              };
              const getNotesByAssetID = qrvalue => {
                return new Promise((resolve, reject) => {
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT DISTINCT * FROM Note WHERE qrvalue = ? ORDER BY recorded_date DESC,recorded_data DESC',
                      [qrvalue],
                      (_, { rows }) => {
                        var array = [];
                        // Retrieve the first row (if exists)
                        if (rows.length > 0) {
                          for (var i = 0; i < rows.length; i++) {
                          const note = rows.item(i);
                          array.push(note);
                          }
                          resolve(array);
                          console.log('note===',array);
                        } else {
                          // QR value not found
                          resolve(null);
                        }
                      },
                      error => {
                        reject(error);
                      }
                    );
                  });
                });
              };
              const getVitalsByAssetID = qrvalue => {
                return new Promise((resolve, reject) => {
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT DISTINCT * FROM Vitalss WHERE qrvalue = ? ORDER BY recorded_date DESC',
                      [qrvalue],
                      (_, { rows }) => {
                        var array = [];
                        // Retrieve the first row (if exists)
                        if (rows.length > 0) {
                          for (var i = 0; i < rows.length; i++) {
                          const vitals = rows.item(i);
                          array.push(vitals);
                          }
                          console.log('vital======',array);
                          resolve(array);
                        } else {
                          // QR value not found
                          resolve(null);
                        }
                      },
                      error => {
                        reject(error);
                      }
                    );
                  });
                });
              };
              const getImagesByAssetID = qrvalue => {
                return new Promise((resolve, reject) => {
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT DISTINCT url FROM  images WHERE qrvalue = ?',
                      [qrvalue],
                      (_, { rows }) => {
                        var array = [];
                        // Retrieve the first row (if exists)
                        if (rows.length > 0) {
                          for (var i = 0; i < rows.length; i++) {
                          const images = rows.item(i);
                          array.push(images);
                          }
                          resolve(array);
                          console.log('setimagedetails===',array)
                        } else {
                          // QR value not found
                          resolve(null);
                        }
                      },
                      error => {
                        reject(error);
                      }
                    );
                  });
                });
              };
              const getIncidentByAssetID = qrvalue => {
                return new Promise((resolve, reject) => {
                  db.transaction(tx => {
                    tx.executeSql(
                      'SELECT DISTINCT * FROM incident WHERE qrvalue = ? ORDER BY timestamp DESC',
                      [qrvalue],
                      (_, { rows }) => {
                        var array = [];
                        // Retrieve the first row (if exists)
                        if (rows.length > 0) {
                          for (var i = 0; i < rows.length; i++) {
                          const incident = rows.item(i);
                          array.push(incident);
                          }
                          resolve(array);
                  console.log('incident333===',array);
                        } else {
                          // QR value not found
                          resolve(null);
                        }
                      },
                      error => {
                        reject(error);
                      }
                    );
                  });
                });
              };
              const onSuccess = e => {
                console.log('qrscan===>>', Utilities.urlValidation(e.data));
                console.log('qrscan===>>', e.data, e.data.length);
                 getAssetByQRValue(e?.data)
                .then(asset => {
                  getNotesByAssetID(asset?.qrvalue)
                  .then(note => {
                  getVitalsByAssetID(asset?.qrvalue)
                  .then(vitals => {
                  getImagesByAssetID(asset?.qrvalue)
                  .then(images => {
                  getIncidentByAssetID(asset?.qrvalue)
                  .then(incident => {
                  if (Utilities.urlValidation(e?.data) !== true) {
                    dispatch(settreeIsLoading(true));
                      if (asset || note || vitals || images || incident) {
                          dispatch(settreeDetails(asset));
                          dispatch(setnoteDetails(note));
                          dispatch(setvitalsDetails(vitals));
                          dispatch(setimagesDetails(images));
                          dispatch(setincidentDetails(incident));
                          if (
                            treeDetails.lat !== null &&
                            treeDetails.lat !== '' &&
                            treeDetails.lng !== null &&
                            treeDetails.lng !== ''
                          ) {
                            getPosition(
                              parseFloat(treeDetails.lat),
                              parseFloat(treeDetails.lng),
                            );
                          }
                          dispatch(setSelectedQr(e.data));
                          setTimeout(() => {
                            dispatch(settreeIsLoading(false));
                          }, 4000);
                          if (Globals.NEED_NAVIGATION_TO_OTHER_VITALS === true) {
                            navigation.push('OtherVital', {isFromDetails: false});
                          } else if (
                            Globals.NEED_NAVIGATION_TO_TREE_VITALS === true &&
                            asset.category === 'Tree'
                          ) {
                            navigation.push('TreeVital');
                          } else {
                            route.params.isFromIncident
                              ? navigation.navigate('TreeEntryScreen', {
                                  needToHome: route.params.isFromIncident,
                                })
                              : asset.category === 'Tree'
                              ? navigation.navigate('DetailsScreen')
                              : asset.category === 'Vehicle'
                              ? navigation.navigate('CarScreen')
                              : asset.category === 'Seed'
                              ? navigation.navigate('SeedScreen')
                              : navigation.navigate('DetailsScreen');
                          }
                        }
                        else {
                          // QR value not found
                          console.log('QR value not found');
                          setTimeout(() => {
                                      dispatch(settreeIsLoading(false));
                                    }, 4000);
                                    Utilities.showToast(
                                      'Sorry!',
                                      'Scanned item not found!',
                                      'error',
                                      'bottom',
                                    );
                                    navigation.goBack();
                                    }
                    // Row found, do something with the asset
                  } else {
                    // QR value not found
                    console.log('QR value not found');
                    setTimeout(() => {
                                dispatch(settreeIsLoading(false));
                              }, 4000);
                              Utilities.showToast(
                                'Sorry!',
                                'Scanned item not found!',
                                'error',
                                'bottom',
                              );
                              navigation.goBack();
                              }
                })
                .catch(error => {
                  console.log('Error retrieving incident:', error);
                });
              })
              .catch(error => {
                console.log('Error retrieving images:', error);
              });
            })
            .catch(error => {
              console.log('Error retrieving vitals:', error);
            });
            })
            .catch(error => {
              console.log('Error retrieving notes:', error);
            });
            })
            .catch(error => {
              console.log('Error retrieving asset:', error);
              setTimeout(() => {
                dispatch(settreeIsLoading(false));
              }, 4000);
              Utilities.showToast(
                'Sorry!',
                'Scanned item not found!',
                'error',
                'bottom',
              );
              navigation.goBack();
            });
            };
              function marker(
                color: string,
                size: string | number,
                borderLength: string | number,
                thickness: number = 2,
                borderRadius: number = 0,
              ): JSX.Element {
                return (
                  <View style={{height: size, width: size}}>
                    <View
                      style={{
                        position: 'absolute',
                        height: borderLength,
                        width: borderLength,
                        top: 0,
                        left: 0,
                        borderColor: color,
                        borderTopWidth: thickness,
                        borderLeftWidth: thickness,
                        borderTopLeftRadius: borderRadius,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        height: borderLength,
                        width: borderLength,
                        top: 0,
                        right: 0,
                        borderColor: color,
                        borderTopWidth: thickness,
                        borderRightWidth: thickness,
                        borderTopRightRadius: borderRadius,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        height: borderLength,
                        width: borderLength,
                        bottom: 0,
                        left: 0,
                        borderColor: color,
                        borderBottomWidth: thickness,
                        borderLeftWidth: thickness,
                        borderBottomLeftRadius: borderRadius,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        height: borderLength,
                        width: borderLength,
                        bottom: 0,
                        right: 0,
                        borderColor: color,
                        borderBottomWidth: thickness,
                        borderRightWidth: thickness,
                        borderBottomRightRadius: borderRadius,
                      }}
                    />
                  </View>
                );
              }
              return (
                <SafeAreaView style={{flex: 1, backgroundColor: Colors.BACKGROUND_COLOR}}>
                  <HeaderScreen
                    title={
                      route?.params?.isFromIncident
                        ? t(Translations.INCIDENTS)
                        : t(Translations.SCAN)
                    }
                    description={
                      route.params.isFromIncident
                        ? t(Translations.VIEW_ALL_INCIDENTS)
                        : t(Translations.SCAN_DESCRIPTION)
                    }
                    onPress={() => navigation.goBack()}
                  />
                  <ItemSeparatorScreen height={responsiveHeight(10)} />
                  {route.params.isFromIncident ? (
                    <Text style={styles.scanqr}>Scan QR</Text>
                  ) : null}
                  {/* <Text>Scan QR</Text> */}
                  <ItemSeparatorScreen height={responsiveHeight(1)} />
                  <LoadingIndicator visible={camLoader} />
                  {showCamera && (
                    <QRCodeScanner
                      reactivate={false}
                      // reactivateTimeout={2000}
                      showMarker={true}
                      fadeIn={false}
                      //flashMode={RNCamera.Constants.FlashMode.torch}
                      onRead={onSuccess}
                      topViewStyle={{flex: 0}}
                      bottomViewStyle={{flex: 0.2}}
                      // checkAndroid6Permissions={true}
                      cameraStyle={{
                        height: responsiveHeight(50),
                        width: responsiveWidth(80),
                        alignSelf: 'center',
                        overflow: 'hidden',
                        position: 'absolute',
                        borderRadius: 20,
                      }}
                      markerStyle={{
                        borderRadius: 20,
                        height: responsiveHeight(50),
                        width: responsiveWidth(80),
                      }}
                      customMarker={marker('#7E7E7E', '80%', '25%', 4, 0)}
                    />
                  )}
                  {route.params.isFromIncident ? (
                    <View style={{marginTop: responsiveHeight(10), flex: 1}}>
                      <Buttons
                        title={'Report Without Scanning'}
                        onPress={() => {
                          navigation.navigate('WithoutScanDetail');
                        }}
                        style={styles.button}
                        textstyle={styles.buttontext}
                      />
                    </View>
                  ) : null}

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={_modalVisible}
                  style={{margin:0}}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 20,
                          borderRadius: 10,
                          alignItems: 'center',
                          width:'90%',
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                          Unable to proceed
                        </Text>
                        <Text style={{ fontSize: 16 }}>Please try again</Text>

                        <TouchableOpacity
                          style={{
                            backgroundColor: '#2196F3',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 20,
                            width:'30%',
                            justifyContent: 'center',
                        alignItems: 'center',

                          }}
                          onPress={()=> navigation.goBack()}
                        >
                          <Text style={{ color: 'white', fontSize: 16 }}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </SafeAreaView>
              );
            };

            export default ScanScreen;

            const styles = StyleSheet.create({
              button: {
                marginTop: responsiveHeight(15),
                height: responsiveHeight(5),
                width: responsiveHeight(27),
                backgroundColor: Colors.GREEN_COLOR,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              },
              buttontext: {
                fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 18,
                letterSpacing: 0.7,
                color: Colors.WHITE_COLOR,
              },
              scanqr: {
                fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 18,
                textAlign: 'center',
                letterSpacing: 0.7,
                color: Colors.GREEN_COLOR,
                height: responsiveHeight(3.6),
              },
            });

