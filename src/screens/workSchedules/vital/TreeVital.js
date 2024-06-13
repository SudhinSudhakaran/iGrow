/* eslint-disable react/no-unstable-nested-components */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Linking,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import HeaderScreen from '../../../components/headerScreen/HeaderScreen';
import {Colors, Images, Fonts, Globals} from '../../../constants';

import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {HelperText} from 'react-native-paper';
import Textarea from 'react-native-textarea/src/Textarea';
import Buttons from '../../../components/button/Buttons';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../../../helpers/utils/Permission';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import Utilities from '../../../helpers/utils/Utilities';
import moment from 'moment';


import Geolocation from 'react-native-geolocation-service';
import ItemSeparatorScreen from '../../../components/itemSeparatorScreen/ItemSeparatorScreen';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {setVitalPersist} from '../../../redux/slice/reduxPersistSlice';
import DeviceInfo from 'react-native-device-info';

const TreeVital = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const heightRef = useRef();
  const diameterRef = useRef();
  const healthRef = useRef();
  const radiusRef = useRef();
  const dateRef = useRef();
  const taskRef = useRef();
  const imageRef = useRef();
  const noteRef = useRef();
  const startRef = useRef();
  const endRef = useRef();
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [health, setHealth] = useState('');
  const [radius, setRadius] = useState('');
  // const [date, setDate] = useState('');
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [textField, setTextField] = useState('');
  const [heightValidation, setHeightValidation] = useState('');
  const [diameterValidation, setDiameterValidation] = useState('');
  const [healthValidation, setHealthValidation] = useState('');
  const [radiusValidation, setRadiusValidation] = useState('');
  const [dateValidation, setDateValidation] = useState('');
  const [taskValidation, setTaskValidation] = useState('');
  const [latitudeValidation, setLatitudeValidation] = useState('');
  const [longitudeValidation, setLongitudeValidation] = useState('');
  const [openEnd, setOpenEnd] = useState(false);
  const [endTime, setEndTime] = useState(
    moment().format('YYYY-MM-DD HH:mm:ss'),
  );
  const [tree, setTree] = useState([]);
  const [date, setDate] = useState(new Date());
  const [addDate, setAddDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [open, setOpen] = useState(false);
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [note, setNote] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [startTime, setStartTime] = useState('');
  const {treeDetails} = useSelector(state => state.treeDetails);
  const [startTimeValidation, setStartTimeValidation] = useState('');
  const [endTimeValidation, setEndTimeValidation] = useState('');
  const [locationValidation, setLocationValiidation] = useState('');
  const [assetIdValidation, setAssetIdValidation] = useState('');
  const [treeVital, setTreeVital] = useState(1);
  const [value, setValue] = useState('');
  const [notHealthy, setNotHealthySelection] = useState(false);
  const [healthy, setHealthySelection] = useState(false);
  const [isHeightModalVisible, setHeightModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [locationFound, setLocationFound] = useState(true);
  const {vitalPersist} = useSelector(state => state.vitalPersist);

  useFocusEffect(
    React.useCallback(() => {
      setStartTime(moment().format('YYYY-MM-DD HH:mm:ss'));
      // getOneTimeLocation();
      return undefined;
    }, []),
  );
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

  const Data = [
    {key: '1', title: 'cm'},
    {key: '2', title: 'mm'},
    {key: '3', title: 'm'},
  ];
  const getOneTimeLocation = () => {
    setShowModal(true);

    Geolocation.getCurrentPosition(
      position => {
        setLongitude(position?.coords?.longitude);
        setLatitude(position?.coords?.latitude);
        console.log('location info------------', position);
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        // Use latitude and longitude
        if (position?.coords?.longitude && position?.coords?.latitude) {
          addVitalsToLocalDB(
            position?.coords?.longitude,
            position?.coords?.latitude,
          );
        } else {
          setLocationFound(false);
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const longitude = position?.coords?.longitude;
          const latitude = position?.coords?.latitude;
          if (longitude && longitude !== 0 && latitude && latitude !== 0) {
            resolve({longitude, latitude});
          } else {
            reject(new Error('Position not found'));
          }
        },
        error => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };

  const backButtonAction = () => {
    // navigation.goBack();
    navigation.pop(2);
  };
  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
  };
  const HeightModal = () => {
    setHeightModalVisible(height.length <= 0 ? false : true);
  };
  const CloseHeight = () => {
    setHeightModalVisible(false);
  };
  const removeImageArray = _index => {
    const filteredArray = imageList.filter((item, index) => index !== _index);
    setImageList(filteredArray);
  };

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
      _openCamera();
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
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };
  const openGallery = async () => {
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
    if (granted) {
      _openGallery();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the storage.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
    }
    else{
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.MEDIA_LIBRARY]
        : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    console.log('isPermissionGranted ===>', isPermissionGranted);
    if (isPermissionGranted) {
      _openGallery();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the storage.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  }
  };
  const _openGallery = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: false,
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        console.log('selected Image', image);
        if (image.length > 0) {
          let imgArray = [];
          image.map((_img, _imgIndex) => {
            let ImageItem = {
              uri: _img.path,
              type: _img.mime,
              name:
                Platform.OS === 'ios'
                  ? _img.filename
                  : `my_profile_${Date.now()}.${
                      _img.mime === 'image/jpeg' ? 'jpg' : 'png'
                    }`,
            };
            imgArray.push(ImageItem);
          });
          let list = [...imageList, ...imgArray];
          setImageList(list);
          // console.log('imageList<>===', imageList);
          setModalVisible(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const _openCamera = () => {
    Geolocation.getCurrentPosition(
      position => {
        // setLatitude(position.coords.latitude);
        // setLongitude(position.coords.longitude);
        ImagePicker.openCamera({
          compressImageQuality: 0.5,
          width: 512,
          height: 512,
          cropping: false,
          includeBase64: true,
          useFrontCamera: false,
          mediaType: 'photo',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then(image => {
            console.log('selected Image', image);
            let ImageItem = {
              uri: image.path,
              type: image.mime,
              name:
                Platform.OS === 'ios'
                  ? image.filename
                  : `my_profile_${Date.now()}.${
                      image.mime === 'image/jpeg' ? 'jpg' : 'png'
                    }`,
            };
            var currentItem = {...imageList, ...ImageItem};
            console.log('itemmap===', currentItem);
            setImageList([...imageList, currentItem]);
            setModalVisible(false);
            console.log('items-camera: ', imageList);
          })
          .catch(err => {
            console.log('catch ==>', err);
          });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const addVitalsToLocalDB = () => {
    addDataToVitalsTable(
      treeDetails.assetid,
      height ?? 0 + 'cm',
      diameter ??0 + 'mm',
      radius ?? 0 + 'cm',
      health ??0,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      note,
      '',
      '',
      imageList,
      startTime,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      treeDetails.category.toLowerCase(),
      treeVital,
    );
  };

  const addDataToVitalsTable = async (
    _id,
    _height,
    _diameter,
    _radius,
    _health,
    _date,
    _note,

    _longitude,
    _latitude,
    _imageList,
    _startTime,
    _endTime,
    _assetType,
    _treeVital,
  ) => {
    const imagesString = JSON.stringify(_imageList);
    let vitalStore = {
      vitalAsset_id: _id,
      height: _height,
      diameter: _diameter,
      radius: _radius,
      health: _health,
      date: _date,
      task: _note,
      lat: _latitude,
      long: _longitude,
      images: imagesString,
      startTime: _startTime,
      endTime: _endTime,
      assetType: _assetType,
      treeVital: '1',
      taskId: Globals?.SELECTED_SCHEDULE_ID?.taskid || '',
      vitalUniqId: `iGrow_vital_${moment().valueOf()}`,
    };

    dispatch(setVitalPersist([vitalStore, ...vitalPersist]));

    setShowModal(false);
    Utilities.showToast(
      'Success',
      'Vitals added successfully',
      'success',
      'bottom',
    );

    backButtonAction();
  };

  const isValidInputs = () => {
    // const isConnected = await NetworkUtils.isNetworkAvailable();

    console.log('addDate', addDate, moment(date).format('DD-MM-YYYY'));
    // var _isValidText = 0;
    // if (
    //   height.length <= 0 ||
    //   health.length <= 0 ||
    //   diameter.length <= 0 ||
    //   radius.length <= 0 ||
    //   startTime.length <= 0 ||
    //   endTime.length <= 0
    // ) {
    //   console.log('date====', addDate);
    //   setTextField('Please enter Fields');
    //   setHeightValidation('Please enter height');
    //   setHealthValidation('Please select health');
    //   setDiameterValidation('Please enter girth');
    //   setRadiusValidation('Please enter canopy diameter');
    //   setDateValidation('Please select date');
    //   setTaskValidation('Please enter task');
    //   // setLatitudeValidation('Please allow location permission');
    //   // setLongitudeValidation('Please allow location permission');
    //   setStartTimeValidation('Please enter start time');
    //   setEndTimeValidation('Please enter end time');
    //   _isValidText = 0;
    // } else {
    //   setHealthValidation('');
    //   setHeightValidation('');
    //   setRadiusValidation('');
    //   setDateValidation('');
    //   setDiameterValidation('');
    //   setTaskValidation('');
    //   setLongitudeValidation('');
    //   setLatitudeValidation('');
    //   setStartTimeValidation('');
    //   setEndTimeValidation('');
    //   _isValidText = 1;
    // }

      addVitalsToLocalDB();
  
    
  };
  const Item = ({item, index}) => {
    console.log('flatlistitem======', item);
    return (
      <View style={[]}>
        <Image
          source={{uri: item.uri}}
          style={{
            height: responsiveHeight(7),
            width: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: responsiveHeight(1),
            marginTop: responsiveHeight(3),
          }}
        />
        <TouchableOpacity
          onPress={() => removeImageArray(index)}
          style={{position: 'absolute', left: 33, bottom: 46}}>
          <Image
            style={{
              width: responsiveWidth(5),
              height: responsiveHeight(3),
              tintColor: Colors.GREEN_COLOR,
              resizeMode: 'contain',
            }}
            source={Images.ROUND_CLOSE_ICON}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const HeightItem = ({title}) => {
    return (
      <View style={[styles.item, {marginTop: responsiveHeight(4)}]}>
        <TouchableOpacity
          onPress={() => SelectItem(title)}
          style={[styles.title, {}]}>
          <Text style={[styles.title, {}]}> {title} </Text>
        </TouchableOpacity>
        {/* <Text style={styles.date}>{date}</Text> */}
      </View>
    );
  };
  const SelectItem = item => {
    console.log('item', item);
    setValue(item);
    setHeight(`${height} ${item}`);
    console.log('====', item);
    setHeightModalVisible(false);
  };
  const CheckBoxHealthy = () => {
    setHealthySelection(true);
    setNotHealthySelection(false);
    setHealth('Healthy');
  };
  const CheckBoxNotHealthy = () => {
    setHealthySelection(false);
    setNotHealthySelection(true);
    setHealth('Not Healthy');
  };
  function _setHeight(height) {
    const heightInCm = height;
    return heightInCm + 'cm'; // return height value with "cm" suffix appended
  }
  function _setDiameter(diameter) {
    const heightInCm = diameter;
    return heightInCm + 'mm'; // return height value with "cm" suffix appended
  }
  function _seRadius(radius) {
    const heightInCm = radius;
    return heightInCm + 'cm'; // return height value with "cm" suffix appended
  }
  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title="Tree Vitals"
        backbutton={{marginTop: responsiveHeight(3)}}
        titlestyle={{fontSize: responsiveFontSize(2.5)}}
        onPress={() => backButtonAction()}
      />
      <Modal isVisible={showModal}>
        <View
          style={{
            backgroundColor: 'white',
            width: responsiveWidth(80),
            height: responsiveHeight(40),
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          {locationFound === true ? (
            <View>
              <ActivityIndicator size={'large'} />
              <Text
                style={{
                  fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                  color: Colors.ITEM_COLOR,
                  fontSize: responsiveFontSize(2.5),
                  marginTop: 20,
                }}>
                Fetching current location
              </Text>
            </View>
          ) : null}

          {locationFound === false ? (
            <View style={{}}>
              <Text
                style={{
                  fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                  color: Colors.ITEM_COLOR,
                  fontSize: responsiveFontSize(2.5),
                  marginTop: 20,
                }}>
                Can't find your location
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: responsiveHeight(5),
                  width: responsiveWidth(50),
                  marginTop: responsiveHeight(2),
                }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={{
                    backgroundColor: Colors.BUTTON_BACKGROUND_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                      color: '#fff',
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <ItemSeparatorScreen width={15} />
                <TouchableOpacity
                  onPress={() => {
                    setLocationFound(true);
                    isValidInputs();
                  }}
                  style={{
                    backgroundColor: Colors.BUTTON_BACKGROUND_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                      color: '#fff',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: responsiveHeight(90)}}>
        <View
          style={{
            flexDirection: 'row',
            height: responsiveScreenHeight(5),
            borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
            borderBottomWidth: responsiveWidth(0.3),
            marginHorizontal: responsiveWidth(5),
            width: responsiveWidth(90),
            marginTop: responsiveHeight(5),
          }}>
          <TextInput
            ref={heightRef}
            style={[styles.textinput, {flex: 1}]}
            placeholderTextColor={Colors.TEXT_HEAD}
            placeholder={'Height (cm)'}
            value={height}
            error={heightValidation}
            onChangeText={setHeight}
            keyboardType={'number-pad'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              diameterRef.current.focus();
            }}
          />
          {height.length > 0 ? (
            <View
              style={{
                width: responsiveScreenHeight(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  position: 'absolute',
                  right: responsiveWidth(5),
                  marginTop: responsiveHeight(7),
                  fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: 14,
                  color: Colors.TEXT_HEAD,
                }}>
                cm
              </Text>
            </View>
          ) : null}
        </View>
        <HelperText
          type="error"
          visible={height.length <= 0}
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
          {heightValidation}
        </HelperText>
        <View
          style={{
            flexDirection: 'row',
            height: responsiveScreenHeight(5),
            borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
            borderBottomWidth: responsiveWidth(0.3),
            marginHorizontal: responsiveWidth(5),
            width: responsiveWidth(90),
          }}>
          <TextInput
            ref={diameterRef}
            placeholder={'Girth (mm)'}
            error={diameterValidation}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={[styles.textinput, {flex: 1}]}
            value={diameter}
            onChangeText={setDiameter}
            keyboardType={'number-pad'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //   healthRef.current.focus();
            // }}
          />
          {diameter.length > 0 ? (
            <View
              style={{
                width: responsiveScreenHeight(7),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: 14,
                  color: Colors.TEXT_HEAD,
                }}>
                mm
              </Text>
            </View>
          ) : null}
        </View>
        <HelperText
          type="error"
          visible={diameter.length <= 0}
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
          {diameterValidation}
        </HelperText>
        <View
          style={{
            flexDirection: 'row',
            height: responsiveScreenHeight(5),
            borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
            borderBottomWidth: responsiveWidth(0.3),
            marginHorizontal: responsiveWidth(5),
            width: responsiveWidth(90),
          }}>
          <TextInput
            ref={radiusRef}
            placeholder={'Canopy Diameter (cm)'}
            error={radiusValidation}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={[styles.textinput, {flex: 1}]}
            value={radius}
            onChangeText={setRadius}
            keyboardType={'number-pad'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //  dateRef.current.focus();
            // }}
          />
          {radius.length > 0 ? (
            <View
              style={{
                width: responsiveScreenHeight(7),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: 14,
                  color: Colors.TEXT_HEAD,
                }}>
                cm
              </Text>
            </View>
          ) : null}
        </View>
        <HelperText
          type="error"
          visible={radius.length <= 0}
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
          {radiusValidation}
        </HelperText>

        {/* <TextInput
            ref={healthRef}
            placeholder={'Health'}
            error={healthValidation}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={styles.textinput}
            value={health}
            onChangeText={setHealth}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              radiusRef.current.focus();
            }}
          /> */}
        <View style={{width: responsiveWidth(90), alignSelf: 'center'}}>
          <Text
            style={[
              styles.textinput,
              {
                borderBottomColor: Colors.WHITE_COLOR,
                borderBottomWidth: responsiveWidth(0),
              },
            ]}>
            Health
          </Text>
        </View>

        <View
          style={[
            styles.textinput,
            {
              borderBottomColor: Colors.WHITE_COLOR,
              borderBottomWidth: responsiveWidth(0),
              flexDirection: 'row',
              width: responsiveWidth(90),
              alignSelf: 'center',
            },
          ]}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                CheckBoxHealthy();
              }}>
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveHeight(2),
                  resizeMode: 'contain',
                  marginTop: responsiveHeight(2),
                  marginLeft: responsiveWidth(0),
                  tintColor: Colors.GREEN_COLOR,
                  // position:'absolute'
                }}
                source={
                  health === 'Healthy'
                    ? Images.RADIO_ON_BUTTON
                    : Images.RADIO_OFF_BUTTON
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.textinput,
                {
                  borderBottomColor: Colors.WHITE_COLOR,
                  borderBottomWidth: responsiveWidth(0),
                  marginTop: responsiveHeight(1.7),
                  marginLeft: responsiveWidth(1),
                },
              ]}>
              Healthy
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginRight: responsiveWidth(20),
            }}>
            <TouchableOpacity
              onPress={() => {
                CheckBoxNotHealthy();
              }}>
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveHeight(2),
                  tintColor: Colors.GREEN_COLOR,
                  resizeMode: 'contain',
                  marginTop: responsiveHeight(2),
                  marginLeft: responsiveWidth(0),
                  // position:'absolute'
                }}
                source={
                  health === 'Not Healthy'
                    ? Images.RADIO_ON_BUTTON
                    : Images.RADIO_OFF_BUTTON
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.textinput,
                {
                  borderBottomColor: Colors.WHITE_COLOR,
                  borderBottomWidth: responsiveWidth(0),
                  marginTop: responsiveHeight(1.7),
                  marginLeft: responsiveWidth(1),
                },
              ]}>
              Not Healthy
            </Text>
          </View>
        </View>
        <HelperText
          type="error"
          visible={health.length <= 0}
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
          {healthValidation}
        </HelperText>

        {/* <TouchableOpacity onPress={() => setOpen(true)}>
            <TextInput
              ref={startRef}
              placeholder={'Start Time'}
              error={startTimeValidation}
              placeholderTextColor={Colors.TEXT_HEAD}
              style={styles.textinput}
              value={startTime}
              editable={false}
              onChangeText={setStartTime}
              keyboardType={'number-pad'}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoComplete={'off'}
              returnKeyType={'next'}
              // onSubmitEditing={() => {
              //   dateRef.current.focus();
              // }}
            />
            <Image
              style={{
                marginTop: responsiveHeight(2),
                marginLeft: responsiveHeight(43),
                tintColor: Colors.TEXT_HEAD,
                height: responsiveHeight(2.5),
                width: responsiveWidth(5),
                // alignSelf: 'center',
                position: 'absolute',
              }}
              source={Images.CLOCK}
            />
            <HelperText
              type="error"
              visible={startTime.length <= 0}
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
              {startTimeValidation}
            </HelperText>
            <DatePicker
              modal
              mode="time"
              open={open}
              date={new Date()}
              // onDateChange={setStartTime?setStartTime:setEndTime}
              onConfirm={date => {
                // console.log('Date ------', date)
                setOpen(false);
                setStartTime(moment(date).format('YYYY-MM-DD HH:mm:ss'));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpenEnd(true)}>
            <TextInput
              ref={endRef}
              placeholder={'End Time'}
              editable={false}
              error={endTimeValidation}
              placeholderTextColor={Colors.TEXT_HEAD}
              style={styles.textinput}
              value={endTime}
              onChangeText={setEndTime}
              keyboardType={'number-pad'}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoComplete={'off'}
              returnKeyType={'next'}
              // onSubmitEditing={() => {
              //   dateRef.current.focus();
              // }}
            />
            <Image
              style={{
                marginTop: responsiveHeight(2),
                marginLeft: responsiveHeight(43),
                tintColor: Colors.TEXT_HEAD,
                height: responsiveHeight(2.5),
                width: responsiveWidth(5),
                // alignSelf: 'center',
                position: 'absolute',
              }}
              source={Images.CLOCK}
            />
            <HelperText
              type="error"
              visible={endTime.length <= 0}
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
              {endTimeValidation}
            </HelperText>
            <DatePicker
              modal
              mode="time"
              open={openEnd}
              date={new Date()}
              // onDateChange={setStartTime?setStartTime:setEndTime}
              onConfirm={date => {
                // console.log('Date ------', date)
                setOpenEnd(false);
                setEndTime(moment(date).format('hh:mm A'));
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />
          </TouchableOpacity> */}
        {/* <TextInput
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
          /> */}
        {/* <View style={{position:'absolute',
          flexDirection:'row',
          flex:1,
          bottom:10,
          right:25}}>
          <TouchableOpacity style={styles.chooseBox}>
          <Text style={styles.chooseBoxText}>{'Choose'}</Text>
          </TouchableOpacity>

          </View> */}

        <View
          style={[
            styles.textareaContainer,
            {
              borderStyle: 'dashed',
              width: responsiveWidth(90),
              height: responsiveHeight(7),
              marginLeft: responsiveWidth(5),
            },
          ]}>
          <TouchableOpacity onPress={toggleModal}>
            <View style={{marginTop: responsiveHeight(1), flex: 1}}>
              <Image
                style={{
                  marginTop: responsiveHeight(0),
                  alignSelf: 'center',
                  position: 'absolute',
                }}
                source={Images.ADD_IMAGE_ICON}
              />
            </View>
            <View style={{marginTop: 0, flex: 1}}>
              <Image
                style={{
                  marginTop: responsiveHeight(0),
                  alignSelf: 'center',
                  position: 'absolute',
                }}
                source={Images.IMAGE_ROUND_ICON}
              />
            </View>
            <Text
              style={[
                styles.textarea,
                {marginTop: responsiveHeight(3.5), alignSelf: 'center'},
              ]}>
              Add Image
            </Text>
            <Modal
              isVisible={isModalVisible}
              style={{justifyContent: 'flex-end', margin: 0}}>
              <View
                style={{
                  height: responsiveHeight(30),
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  margin: 0,
                  backgroundColor: Colors.WHITE_COLOR,
                  marginTop: responsiveHeight(5),
                }}>
                <View
                  style={{
                    marginTop: responsiveHeight(3),
                    marginLeft: responsiveWidth(4),

                    width: responsiveScreenWidth(80),
                    height: responsiveHeight(5),
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.selectoption}> Select an option</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                  }}>
                  <TouchableOpacity
                    onPress={() => openCamera()}
                    style={styles.firstMenu}>
                    <Image
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveHeight(3),
                        tintColor: Colors.GREEN_COLOR,
                      }}
                      source={Images.CAMERA_ICON}
                    />
                    <Text style={{fontSize: 15}}> Open Camera</Text>
                  </TouchableOpacity>
                  <ItemSeparatorScreen width={responsiveWidth(3)} />
                  <TouchableOpacity
                    onPress={() => openGallery()}
                    style={styles.firstMenu}>
                    <Image
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveHeight(3),
                        tintColor: Colors.GREEN_COLOR,
                      }}
                      source={Images.ADD_IMAGE_ICON}
                    />
                    <Text style={{fontSize: 15}}>Open Gallery</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => Close()}
                  style={{position: 'absolute'}}>
                  <Image
                    style={{
                      width: responsiveWidth(4),
                      height: responsiveHeight(2),
                      tintColor: Colors.TEXT_HEAD,
                      resizeMode: 'contain',
                      marginTop: responsiveHeight(4),
                      marginLeft: responsiveWidth(90),
                      // position:'absolute'
                    }}
                    source={Images.CLOSE_ICON}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={imageRef}
          contentContainerStyle={{paddingHorizontal: responsiveWidth(2)}}
          data={imageList}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={item => item.id}
        />

        <View
          style={{
            marginHorizontal: responsiveScreenWidth(5),
            marginTop: responsiveHeight(3),
          }}>
          <Textarea
            containerStyle={styles.noteAreaContainer}
            style={styles.noteArea}
            editable
            // onChangeText={this.onChange}
            // defaultValue={this.state.text}
            // maxLength={120}
            placeholder={'Type something'}
            value={note}
            onChangeText={setNote}
            placeholderTextColor={Colors.TEXT_HEAD}
            underlineColorAndroid={'transparent'}
          />
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
            onPress={() => isValidInputs()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TreeVital;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  textareaContainer: {
    height: responsiveHeight(15),
    marginTop: responsiveHeight(2.9),
    marginLeft: responsiveHeight(2.5),
    width: responsiveWidth(89),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    borderRadius: 4,
    borderWidth: 0.6,
    borderColor: Colors.GREEN_COLOR,
  },
  textarea: {
    textAlign: 'center', // hack android
    height: responsiveHeight(15),
    fontSize: 12,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.TEXT_HEAD,
  },
  textinput: {
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    // borderBottomWidth: responsiveWidth(0.3),

    // marginLeft: responsiveWidth(6),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    width: responsiveWidth(90),
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
  selectoption: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveFontSize(0),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    marginTop: responsiveHeight(0),
  },
  item: {
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    marginHorizontal: responsiveWidth(5),
    marginLeft: responsiveWidth(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.TEXT_HEAD,
    lineHeight: 10,
    padding: 1,
  },
  title: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    // lineHeight: 16,
    // letterSpacing: 0.7,
    color: Colors.ITEM_COLOR,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  firstMenu: {
    borderTopLeftRadius: responsiveHeight(2),
    borderTopRightRadius: responsiveHeight(2),
    borderBottomLeftRadius: responsiveHeight(2),
    borderBottomRightRadius: responsiveHeight(2),
    width: responsiveWidth(40),
    height: responsiveHeight(15),
    borderWidth: 1,
    borderColor: Colors.GREEN_COLOR,
    //  flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_SKY_BLUE,
    marginLeft: responsiveHeight(3),
  },
});
