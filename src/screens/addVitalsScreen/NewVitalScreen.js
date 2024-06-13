/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create New Vitals Screen Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 22 Feb 2023

    */

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  FlatList,
  TextInput,
  ScrollView,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Linking,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import React, {useEffect, useRef, useState} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors, Globals} from '../../constants';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import {Buttons} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/core';
import InputScrollView from 'react-native-input-scroll-view';

import {useDispatch} from 'react-redux';

import Utilities from '../../helpers/utils/Utilities';
import {HelperText} from 'react-native-paper';

import moment from 'moment';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {PERMISSIONS} from 'react-native-permissions';

import {checkMultiplePermissions} from '../../helpers/utils/Permission';
import {useFocusEffect} from '@react-navigation/core';

import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';

import Geolocation from 'react-native-geolocation-service';
import {setVitalPersist} from '../../redux/slice/reduxPersistSlice';

const NewVitalScreen = () => {
  const dispatch = useDispatch();
  const heightRef = useRef();
  const diameterRef = useRef();
  const healthRef = useRef();
  const radiusRef = useRef();
  const dateRef = useRef();
  const taskRef = useRef();
  const imageRef = useRef();
  const noteRef = useRef();
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [health, setHealth] = useState('');
  const [radius, setRadius] = useState('');
  // const [date, setDate] = useState('');
  const [task, setTask] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const [textField, setTextField] = useState('');
  const [heightValidation, setHeightValidation] = useState('');
  const [diameterValidation, setDiameterValidation] = useState('');
  const [healthValidation, setHealthValidation] = useState('');
  const [radiusValidation, setRadiusValidation] = useState('');
  const [dateValidation, setDateValidation] = useState('');
  const [taskValidation, setTaskValidation] = useState('');
  const [latitudeValidation, setLatitudeValidation] = useState('');
  const [longitudeValidation, setLongitudeValidation] = useState('');
  const [tree, setTree] = useState([]);
  const [date, setDate] = useState(new Date());
  const [addDate, setAddDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [open, setOpen] = useState(false);
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHeightModalVisible, setHeightModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [note, setNote] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [startTime, setStartTime] = useState('');
  const {treeDetails} = useSelector(state => state.treeDetails);
  const {startTask} = useSelector(state => state.startTask);
  const [treeVital, setTreeVital] = useState(1);
  const [value, setValue] = useState('');
  const [notHealthy, setNotHealthySelection] = useState(false);
  const [healthy, setHealthySelection] = useState(false);
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
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.MEDIA_LIBRARY]
        : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    console.log('isPermissionGranted ===>', isPermissionGranted);
    if (isPermissionGranted||granted) {
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

  const addVitalsToLocalDB = () => {
    // console.log('Add vitald', treeDetails, treeDetails.id);
    addDataToVitalsTable(
      treeDetails.assetid,
      height ?? 0 + ' cm',
      diameter ?? 0 + ' mm',
      radius ?? 0 + ' cm',
      health ?? 0,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      task ?? 0,
      // _latitude,
      // _longitude,
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
    _task,
    _latitude,
    _longitude,
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
      task: _task,
      lat: _latitude,
      long: _longitude,
      images: imagesString,
      startTime: _startTime,
      endTime: _endTime,
      assetType: _assetType,
      treeVital: '1',
      taskId: startTask ?? '',
      vitalUniqId: `iGrow_vital_${moment().valueOf()}`,
    };

    dispatch(setVitalPersist([vitalStore, ...vitalPersist]));

    Utilities.showToast(
      'Success',
      'Vitals added successfully',
      'success',
      'bottom',
    );
    console.log('Vitals persist********************', vitalPersist);
    navigation.goBack();
  };

  // const getPosition = () => {
  //   return new Promise((resolve, reject) => {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         console.log('++++++++++++', position);
  //         const longitude = position?.coords?.longitude;
  //         const latitude = position?.coords?.latitude;
  //         if (longitude && longitude !== 0 && latitude && latitude !== 0) {
  //           resolve({longitude, latitude});
  //         } else {
  //           reject(new Error('Position not found'));
  //         }
  //       },
  //       error => {
  //         reject(new Error(`Geolocation error: ${error.message}`));
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   });
  // };
  const isValidInputs = () => {
    // var _isValidText = 0;
    // if (
    //   height.length <= 0 ||
    //   health.length <= 0 ||
    //   diameter.length <= 0 ||
    //   radius.length <= 0
    // ) {
    //   // console.log('date====', addDate);
    //   setTextField('Please enter Fields');
    //   setHeightValidation('Please enter height');
    //   setHealthValidation('Please select health');
    //   setDiameterValidation('Please enter girth');
    //   setRadiusValidation('Please enter canopy diameter');
    //   _isValidText = 0;
    // } else {
    //   setHealthValidation('');
    //   setHeightValidation('');
    //   setRadiusValidation('');
    //   setDiameterValidation('');

    //   _isValidText = 1;
    // }

    addVitalsToLocalDB();
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
  const ListFooterComponent = () => {
    return (
      <View
        style={[styles.textareaContainer, {flex: 1, borderStyle: 'dashed'}]}>
        <TouchableOpacity
          // onPress={openGallery}
          onPress={toggleModal}>
          <View style={{marginTop: responsiveHeight(5), flex: 1}}>
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
        </TouchableOpacity>
      </View>
    );
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
          onPress={() => navigation.goBack()}
          title={'New Vitals'}
          style={{marginTop: responsiveHeight(5)}}
          titlestyle={{marginTop: responsiveHeight(4)}}
          backbutton={{marginTop: responsiveHeight(5)}}
        />

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
            editable={value === '' ? true : false}
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
                width: responsiveScreenHeight(10),
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
            onSubmitEditing={() => {
              taskRef.current.focus();
            }}
          />
          {radius.length > 0 ? (
            <View
              style={{
                width: responsiveScreenHeight(10),
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

        {/* <View>
          <TextInput
            ref={dateRef}
            placeholder={'Recorded Date'}
            error={dateValidation}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={styles.textinput}
            value={addDate}
            editable={false}
            onChangeText={setAddDate}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              taskRef.current.focus();
            }}
          />
          <View style={{position: 'absolute', flex: 1}}>
            <TouchableOpacity style={{}} onPress={() => setOpen(true)}>
              <Image
                style={{
                  marginTop: responsiveHeight(2),
                  marginLeft: responsiveHeight(43),
                  tintColor: Colors.TEXT_HEAD,
                  height: responsiveHeight(3),
                  width: responsiveWidth(6),
                  // alignSelf: 'center',
                  // position: 'absolute',
                }}
                source={Images.CALENDAR_ICON}
              />

              <DatePicker
                modal
                mode="date"
                open={open}
                date={new Date()}
                onDateChange={setAddDate}
                onConfirm={date => {
                  // console.log('Date ------', date)
                  setOpen(false);
                  setDate(date);
                  setAddDate(moment(date).format('DD-MMM-YYYY'));
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </TouchableOpacity>
          </View>
        </View> */}
        {/* <HelperText
            type="error"
            visible={addDate <= 0}
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
            {dateValidation}
          </HelperText> */}
        <View
          style={{
            flexDirection: 'row',
            height: responsiveScreenHeight(10),
            borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
            borderBottomWidth: responsiveWidth(0.3),
            marginHorizontal: responsiveWidth(5),
            width: responsiveWidth(90),
          }}>
          <TextInput
            ref={taskRef}
            placeholder={'Note'}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={[
              styles.textinput,
              {marginTop: responsiveHeight(3), flex: 1},
            ]}
            error={taskValidation}
            value={task}
            onChangeText={setTask}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //   imageRef.current.focus();
            // }}
          />
        </View>
        <HelperText
          type="error"
          visible={task.length <= 0}
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
          {taskValidation}
        </HelperText>
        {/* <TextInput
            // ref={taskRef}
            placeholder={'Longitude'}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={styles.textinput}
            error={textField}
            value={longitude}
            editable={false}
            onChangeText={setLongitude}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //   imageRef.current.focus();
            // }}
          />
            <HelperText
            type="error"
            visible={longitude.length <= 0}
            style={{
              color: Colors.VALIDATION_COLOR,
              fontSize: 12,
              textAlign: 'left',
              marginLeft: responsiveHeight(2),
              // marginTop: responsiveHeight(1),
              fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 18,
              letterSpacing: 0.7,
            }}>
            {longitudeValidation}
          </HelperText>
          <TextInput
            // ref={taskRef}
            placeholder={'Latitude'}
            placeholderTextColor={Colors.TEXT_HEAD}
            style={[styles.textinput, {marginTop: responsiveFontSize(1)}]}
            error={textField}
            value={latitude}
            editable={false}
            onChangeText={setLatitude}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //   imageRef.current.focus();
            // }}
          />
            <HelperText
            type="error"
            visible={latitude.length <= 0}
            style={{
              color: Colors.VALIDATION_COLOR,
              fontSize: 12,
              textAlign: 'left',
              marginLeft: responsiveHeight(2),
              // marginTop: responsiveHeight(1),
              fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 18,
              letterSpacing: 0.7,
            }}>
            {latitudeValidation}
          </HelperText> */}
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
                  marginTop: responsiveHeight(50),
                }}>
                <View
                  style={{
                    marginTop: responsiveHeight(3),
                    marginLeft: responsiveWidth(4),
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
            height: responsiveHeight(12),
            backgroundColor: 'transparent',
          }}>
          <Buttons
            title="Submit"
            style={styles.button}
            textstyle={styles.buttontext}
            onPress={() => {
              isValidInputs();
            }}
          />
        </View>
      </InputScrollView>
    </View>
  );
};

export default NewVitalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  textinput: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    lineHeight: 18,

    letterSpacing: 0.7,
    marginTop: responsiveHeight(0),
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
  buttontext: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.7,
    color: Colors.WHITE_COLOR,
    //   marginTop:responsiveHeight(0.2),
  },
  button: {
    backgroundColor: Colors.GREEN_COLOR,
    marginTop: responsiveHeight(3),
    height: responsiveHeight(6),
    flex: 1,
    marginBottom: responsiveHeight(2),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  choosebutton: {
    backgroundColor: Colors.SUBJECT_INPUTLINE_COLOR,
    marginTop: responsiveHeight(5.4),
    height: responsiveHeight(4),
    flex: 1,
    width: responsiveWidth(35),
    marginBottom: responsiveHeight(2),
    alignSelf: 'center',
    alignItems: 'center',
  },
  imagestyle: {
    marginTop: responsiveHeight(8),
  },
  box: {
    height: responsiveHeight(8),
    width: responsiveHeight(10),
    marginTop: responsiveHeight(4),
    marginLeft: responsiveHeight(2),
    borderWidth: 3,
    borderColor: Colors.SUBJECT_INPUTLINE_COLOR,
    position: 'absolute',
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
