/* eslint-disable react/self-closing-comp */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  BackHandler,
  ActivityIndicator,
  Alert,
  Linking,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors, Images, Fonts, Globals} from '../../../constants';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {HelperText} from 'react-native-paper';
import Textarea from 'react-native-textarea/src/Textarea';
import Buttons from '../../../components/button/Buttons';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import HeaderScreen from '../../../components/headerScreen/HeaderScreen';
import Utilities from '../../../helpers/utils/Utilities';

import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';


import Geolocation from 'react-native-geolocation-service';
import geocoder from '@timwangdev/react-native-geocoder';
import InputScrollView from 'react-native-input-scroll-view';
import Modal from 'react-native-modal';
import ItemSeparatorScreen from '../../../components/itemSeparatorScreen/ItemSeparatorScreen';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../../../helpers/utils/Permission';
import {setVitalPersist} from '../../../redux/slice/reduxPersistSlice';
import DeviceInfo from 'react-native-device-info';

const OtherVital = () => {
  const route = useRoute();
  const startRef = useRef();
  const dispatch = useDispatch();
  const endRef = useRef();
  const imageRef = useRef();
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [captureAssetIds, setCaptureIds] = useState('');
  const [captureLocation, setCaptureLocation] = useState('');
  const {treeDetails} = useSelector(state => state.treeDetails);
  const [treeVital, setTreeVital] = useState(0);
  const [imageList, setImageList] = useState([]);

  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [locationStatus, setLocationStatus] = useState('');
  const [startTimeValidation, setStartTimeValidation] = useState('');
  const [endTimeValidation, setEndTimeValidation] = useState('');
  const [locationValidation, setLocationValiidation] = useState('');
  const [assetIdValidation, setAssetIdValidation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const {startTask} = useSelector(state => state.startTask);
  const [showModal, setShowModal] = useState(false);
  const [locationFound, setLocationFound] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const {vitalPersist} = useSelector(state => state.vitalPersist);

  const {isFromDetails} = route.params;
  useEffect(() => {
    const handleBackButton = () => {
      backButtonAction();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      // Clean up
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    setCaptureIds(treeDetails.id);
    setTimeout(() => {
      Refresh();
    }, 2000);
    console.log(' treeDetails in other vitals', treeDetails);
  }, []);
  // useEffect(() => {
  //   Refresh();
  // }, []);
  const Refresh = () => {
    if (
      latitude !== null &&
      latitude !== '' &&
      longitude !== null &&
      longitude !== ''
    ) {
      _getPostion(parseFloat(latitude), parseFloat(longitude));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setStartTime(moment().format('YYYY-MM-DD HH:mm:ss'));
      // getOneTimeLocation();
      return undefined;
    }, []),
  );

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

  const _getPostion = async (myLat, myLon) => {
    console.log('getPostion function called');
    try {
      const position = {lat: myLat, lng: myLon};
      let location = await geocoder.geocodePosition(position);

      setCaptureLocation(location[0]?.locality);
      console.log('location ====> ', location);
      console.log('capturelocation ====> ', captureLocation);

      setIsLoading(false);
    } catch (err) {}
  };
  const backButtonAction = () => {
    if (isFromDetails === true) {
      navigation.goBack();
    } else {
      navigation.pop(2);
    }
  };

  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
  };
  const removeImageArray = _index => {
    const filteredArray = imageList.filter((item, index) => index !== _index);
    setImageList(filteredArray);
  };

  const openCamera = async () => {
    // console.log(' Camera selected');
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [PERMISSIONS.ANDROID.CAMERA];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    // console.log('isPermissionGranted ===>', isPermissionGranted);
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
      compressImageQuality: 0.5,
      width: 512,
      height: 512,
      cropping: false,
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        // console.log('selected Image', image);
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
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      width: 512,
      height: 512,
      cropping: false,
      includeBase64: true,
      useFrontCamera: false,
      mediaType: 'photo',
    })
      .then(image => {
        // console.log('selected Image', image);
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
        // console.log('itemmap===', currentItem);
        setImageList([...imageList, currentItem]);
        setModalVisible(false);
        // console.log('items-camera: ', imageList);
      })
      .catch(err => {
        console.log('catch ==>', err);
      });
  };

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('++++++++++++', position);
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

  const Item = ({item, index}) => {
    // console.log('flatlistitem======', item);
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
  const isValidInputs = () => {
    // const isConnected = await NetworkUtils.isNetworkAvailable();

    var _isValidText = 0;
    if (
      // startTime.length <= 0 ||
      // endTime.length <= 0 ||
      captureAssetIds?.length <= 0
      // captureLocation.length <= 0
    ) {
      // setStartTimeValidation('Please enter start time');
      // setEndTimeValidation('Please enter end time');
      setLocationValiidation('Please allow location permission');
      setAssetIdValidation('Please select valid asset');
      _isValidText = 0;
    } else {
      setStartTimeValidation('');
      setEndTimeValidation('');
      // setLocationValiidation('');
      setAssetIdValidation('');
      _isValidText = 1;
    }

    if (_isValidText === 1) {
      // getOneTimeLocation();
      setShowModal(true);
      getPosition()
        .then(position => {
          console.log('location info------------', position);
          addVitalsToLocalDB(position.longitude, position.latitude);
        })
        .catch(error => {
          console.error(error);
          setLocationFound(false);
        });
    }
  };
  const addVitalsToLocalDB = (_longitude, _latitude) => {
    addDataToVitalsTable(
      treeDetails.assetid,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      startTime,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      treeDetails.category.toLowerCase(),
      _longitude,
      _latitude,
      imageList,
    );
  
  };

  const addDataToVitalsTable = async (
    _id,
    _date,
    _startTime,
    _endTime,
    _assetType,
    _longitude,
    _latitude,
    _imageList,
  ) => {
    const imagesString = JSON.stringify(_imageList);
    let vitalStore = {
      vitalAsset_id: treeDetails.assetid,
      height: '',
      diameter: '',
      radius: '',
      health: '',
      date: _date,
      task: note,
      lat: _latitude,
      long: _longitude,
      images: imagesString,
      startTime: _startTime,
      endTime: _endTime,
      assetType: _assetType,
      treeVital: '0',
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


  //final return
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
        marginBottom: responsiveHeight(0),
      }}>
      <InputScrollView
        contentContainerStyle={{}}
        style={styles.container}
        keyboardOffset={285}>
        <HeaderScreen
          title="Other Vitals"
          backbutton={{marginTop: responsiveHeight(3)}}
          titlestyle={{fontSize: responsiveFontSize(2.5)}}
          onPress={() => backButtonAction()}
        />
        <View style={{marginTop: responsiveHeight(10)}}>
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
              setStartTime(moment(date).format('hh:mm A'));
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
          <TextInput
            // ref={radiusRef}
            placeholder={'Capture asset ids'}
            // error={radiusValidation}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={styles.textinput}
            value={treeDetails.name}
            editable={true}
            // onChangeText={setCaptureIds}
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
            visible={captureAssetIds?.length <= 0}
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
            {assetIdValidation}
          </HelperText>
          {/* <TouchableOpacity activeOpacity={1} onPress={() => Refresh()}>
            <TextInput
              // ref={radiusRef}
              placeholder={'Capture Location'}
              // error={radiusValidation}
              placeholderTextColor={Colors.TEXT_HEAD}
              style={styles.textinput}
              value={captureLocation}
              onChangeText={setCaptureLocation}
              editable={false}
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
              visible={captureLocation.length <= 0}
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
              {locationValidation}
            </HelperText>
          </TouchableOpacity> */}
        </View>

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
                <Image
                  style={{
                    marginTop: responsiveHeight(0),
                    // marginLeft: responsiveHeight(43),
                    tintColor: Colors.BUTTON_BACKGROUND_COLOR,
                    height: responsiveHeight(5),
                    width: responsiveWidth(7.5),
                    alignSelf: 'center',
                    // position: 'absolute',
                  }}
                  source={Images.LOCATION}
                />
                <Text
                  style={{
                    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                    color: Colors.ITEM_COLOR,
                    fontSize: responsiveFontSize(2.5),
                    marginTop: responsiveHeight(1),
                    textAlign: 'center',
                  }}>
                  Can't find your location
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(5),
                    width: responsiveWidth(50),
                    marginLeft: responsiveWidth(5),
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
          style={[
            styles.textareaContainer,
            {
              // flex: 1,
              borderStyle: 'dashed',
              width: responsiveWidth(90),
              height: responsiveHeight(7),
              marginLeft: responsiveWidth(5),
            },
          ]}>
          <TouchableOpacity
            onPress={toggleModal}
            style={{height: responsiveHeight(5), width: responsiveWidth(90)}}>
            <View style={{marginTop: responsiveHeight(1)}}>
              <Image
                style={{
                  marginTop: responsiveHeight(0),
                  alignSelf: 'center',
                  position: 'absolute',
                  // marginLeft:responsiveWidth(5),
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
                  // marginLeft:responsiveWidth(5),
                }}
                source={Images.IMAGE_ROUND_ICON}
              />
            </View>
            <Text
              style={[
                styles.textarea,
                {marginTop: responsiveHeight(3), alignSelf: 'center'},
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
                  marginTop: responsiveHeight(50),
                }}>
                <View
                  style={{
                    marginTop: responsiveHeight(3),
                    marginLeft: responsiveWidth(4),
                  }}>
                  <Text style={styles.selectOption}> Select an option</Text>
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
      </InputScrollView>
    </View>
  );
};

export default OtherVital;

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
  textareaContainer: {
    height: responsiveHeight(14.8),
    marginTop: responsiveHeight(2.9),
    marginLeft: responsiveHeight(4),
    width: responsiveWidth(85),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: Colors.GREEN_COLOR,
  },
  selectOption: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveFontSize(0),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    marginTop: responsiveHeight(0),
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
});
