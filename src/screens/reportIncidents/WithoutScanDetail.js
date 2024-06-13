/**
    * Purpose: Create Without scan ReportIncident Screen Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023

    */

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Platform,
  Linking,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {Images, Fonts, Colors, Globals} from '../../constants';
import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
import {
  responsiveFontSize,
  responsiveHeight,

  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import {Buttons} from '../../components';

import {useNavigation} from '@react-navigation/core';

import Textarea from 'react-native-textarea/src/Textarea';
import DropdownTextInput from '../shared/textInputs/DropdownTextInput';
import InputScrollView from 'react-native-input-scroll-view';

import WithoutScanDropdown from '../shared/textInputs/WithoutScanDropdown';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';

import {HelperText} from 'react-native-paper';

import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import Utilities from '../../helpers/utils/Utilities';

import {setreportIncidents} from '../../redux/slice/treeDetailSlice';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../../helpers/utils/Permission';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useFocusEffect} from '@react-navigation/core';


const WithoutScanDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [farm, setFarm] = useState('');
  const [division, setDivision] = useState('');
  const [block, setBlock] = useState('');
  const [row, setRow] = useState('');
  const [subrow, setSubrow] = useState('');
  const [department, setDepartment] = useState('');
  const [program, setProgram] = useState('');
  const [assign, setAssign] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [farmvalidation, setFarmvalidation] = useState('');
  const [divisionvalidation, setDivisionvalidation] = useState('');
  const [blockvalidation, setBlockvalidation] = useState('');
  const [rowvalidation, setRowvalidation] = useState('');
  const [subRowvalidation, setSubRowvalidation] = useState('');
  const [departmentvalidation, setdepartmentvalidation] = useState('');
  const [programvalidation, setProgramvalidation] = useState('');
  const [assigntovalidation, setAssigntovalidation] = useState('');
 
  //ReduxState

  const [isConnected, setIsConnected] = useState(true);
  const [imageList, setImageList] = useState([]);



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
  useFocusEffect(
    React.useCallback(() => {
      // checkLocationPermission();
      return undefined;
    }, []),
  );
 
  const backButtonAction = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomePageScreen'}],
    });
  };
  const removeImageArray = _index => {
    const filteredArray = imageList.filter((item, index) => index !== _index);
    setImageList(filteredArray);
  };
 
 

  //     const selectfarm = [
  //     {key:'1', title:'Select Farm 1'},
  //     {key:'2', title:'Select Farm 2'},
  //     {key:'3', title:'Select Farm 3'},
  //     {key:'4', title:'Select Farm 4'},
  //     {key:'5', title:'Select Farm 5'},
  //     {key:'6', title:'Select Farm 6'},
  //     {key:'7', title:'Select Farm 7'},
  // ]
  // const division = [
  //   {key:'1', title:'Division 1'},
  //   {key:'2', title:'Division 2'},
  //   {key:'3', title:'Division 3'},
  //   {key:'4', title:'Division 4'},
  //   {key:'5', title:'Division 5'},
  //   {key:'6', title:'Division 6'},
  //   {key:'7', title:'Division 7'},
  // ]
  // const row = [
  //   {key:'1', title:'Row 1'},
  //   {key:'2', title:'Row 2'},
  //   {key:'3', title:'Row 3'},
  //   {key:'4', title:'Row 4'},
  //   {key:'5', title:'Row 5'},
  //   {key:'6', title:'Row 6'},
  //   {key:'7', title:'Row 7'},
  // ]
  // const subrow = [
  //   {key:'1', title:'Sub Row 1'},
  //   {key:'2', title:'Sub Row 2'},
  //   {key:'3', title:'Sub Row 3'},
  //   {key:'4', title:'Sub Row 4'},
  //   {key:'5', title:'Sub Row 5'},
  //   {key:'6', title:'Sub Row 6'},
  //   {key:'7', title:'Sub Row 7'},
  // ]
  // const block = [
  //   {key:'1', title:'Block 1'},
  //   {key:'2', title:'Block 2'},
  //   {key:'3', title:'Block 3'},
  //   {key:'4', title:'Block 4'},
  //   {key:'5', title:'Block 5'},
  //   {key:'6', title:'Block 6'},
  //   {key:'7', title:'Block 7'},
  // ]

  /**
   * Purpose: Perform add vitals
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 1 March 2023
   * Steps:
     1.fetch vital details from API and append to state variable
*/
  const performAddReportIncident = () => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append(APIConnections.KEYS.KEY, Globals.API_KEY);
    formData.append(APIConnections.KEYS.METHOD, 'add');
    formData.append(APIConnections.KEYS.RESOURCE, 'tickets');
    formData.append(APIConnections.KEYS.DATA_DERPARTMENTID, '1');
    formData.append(APIConnections.KEYS.DATA_CLIENTID, '3');
    formData.append(APIConnections.KEYS.DATA_USERID, '5');
    formData.append(APIConnections.KEYS.DATA_ASSETID, '24');
    formData.append(APIConnections.KEYS.DATA_PROJECTID, '1');
    formData.append(APIConnections.KEYS.DATA_EMAIL, '');
    formData.append(APIConnections.KEYS.DATA_SUBJECT, 'test-subject');
    formData.append(APIConnections.KEYS.DATA_NOTES, 'test-notes');
    formData.append(APIConnections.KEYS.DATA_ASSETTYPE, 'tree');
    if (imageList.length > 0) {
      for (let i = 0; i < imageList.length; i++) {
        formData.append('file[]', imageList[i]);
      }
    }
    DataManager.performAddReportIncident(formData).then(
      ([isSuccess, message, responseData]) => {
        console.log('response data ====>>>>', responseData);
        if (isSuccess === true) {
          Utilities.showToast(
            'Success',
            'Incidents updated successfully',
            'success',
            'bottom',
          );
          setFarmvalidation('');
          setBlockvalidation('');
          setDivisionvalidation('');
          setRowvalidation('');
          setSubRowvalidation('');
          setdepartmentvalidation('');
          setProgramvalidation('');
          setAssigntovalidation('');
          backButtonAction();
        } else {
          Utilities.showToast('FAILED', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };

  const selectFarmAction = () => {
  
    console.log('farmfunction======');
    setModalVisible(true);
  };
  const Item = ({item,index}) => {
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
  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
  };
  const SelectItem = title => {
    // setDepartmentValue(title)
    setModalVisible(false);
  };
  const closeButtonAction = () => {
    console.log('close');
    setIsLoading(true);
    Keyboard.dismiss();
    setSearch('');
  };
  //Callback from UploadOptions
  const handleUploadOptionSelection = (type: UploadTypes) => {
    console.log('Callback:', type);
    // setSelectedUploadOption(type)
    switch (type) {
      case UploadTypes.camera:
        openCamera();
        break;
      case UploadTypes.image:
        console.log('Opening image picker');
        openGallery();
        break;
    }
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
          console.log('items: ', imageList);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const _openCamera = () => {
    ImagePicker.openCamera({
      width: 512,
      height: 512,
      cropping: false,
      includeBase64: true,
      useFrontCamera: false,
      mediaType: 'photo',
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
  };

  const ListFooterComponent = () => {
    return (
      <View
        style={[styles.textareaContainer, {flex: 1, borderStyle: 'dashed'}]}>
        <TouchableOpacity onPress={openGallery}>
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
  const RenderItem = ({item}) => {
    // console.log('imagelist====', imageList);
    return (
      <View
        style={[styles.textareaContainer, {flex: 1, borderStyle: 'dashed'}]}>
        <Image
          source={{uri: item}}
          style={{
            height: 120,
            width: 60,
            alignSelf: 'center',
            marginTop: responsiveHeight(0),
          }}></Image>
        
      </View>
    );
  };
  const isValidInputs = () => {
    console.log('farm===', farm);
    var _isValidText = 0;
    if (
      farm.length <= 0 ||
      division.length <= 0 ||
      block.length <= 0 ||
      row.length <= 0 ||
      subrow.length <= 0 ||
      department.length <= 0 ||
      program.length <= 0 ||
      assign.length <= 0
    ) {
      setFarmvalidation('Please select farm');
      setDivisionvalidation('Please select division');
      setAssigntovalidation('Please select assign');
      setBlockvalidation('Please select block');
      setRowvalidation('Please select row');
      setSubRowvalidation('Please select subrow');
      setdepartmentvalidation('Please select department');
      setProgramvalidation('Please select program');
      _isValidText = 0;
    } else {
      setFarmvalidation('');
      setBlockvalidation('');
      setDivisionvalidation('');
      setRowvalidation('');
      setSubRowvalidation('');
      setdepartmentvalidation('');
      setProgramvalidation('');
      setAssigntovalidation('');
      _isValidText = 1;
    }

    if (_isValidText === 1) {
      if (isConnected === true) {
        performAddReportIncident();
      } else {
        // addVitalsToLocalDB();
      }
    }
  };
  return (
    <View style={{backgroundColor: Colors.WHITE_COLOR}}>
      <InputScrollView
        contentContainerStyle={{}}
        style={styles.container}
        keyboardOffset={285}>
        <HeaderScreen
          onPress={() => backButtonAction()}
          title={'Report Incidents'}
          style={{marginTop: responsiveHeight(5)}}
          titlestyle={{marginTop: responsiveHeight(5)}}
          backbutton={{marginTop: responsiveHeight(6)}}
        />
        <ScrollView>
          <WithoutScanDropdown
            style={[styles.textinput, {marginTop: responsiveHeight(4)}]}
            imagestyle={{marginTop: responsiveHeight(6)}}
            onPress={() => selectFarmAction()}
            placeholder={'Select Farm'}
            error={farmvalidation}
            setValue={setFarm}
            value={farm}
          />

          <HelperText
            type="error"
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}
            visible={farm.length <= 0}>
            {farmvalidation}
          </HelperText>
          <WithoutScanDropdown
            placeholder={'Select Division'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={styles.textinput}
            error={divisionvalidation}
            setValue={setDivision}
            value={division}
          />
          <HelperText
            type="error"
            visible={division.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {divisionvalidation}
          </HelperText>
          <WithoutScanDropdown
            placeholder={'Select Block'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={styles.textinput}
            error={blockvalidation}
            setValue={setBlock}
            value={block}
          />
          <HelperText
            type="error"
            visible={block.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {blockvalidation}
          </HelperText>
          <WithoutScanDropdown
            placeholder={'Select Row'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={styles.textinput}
            error={rowvalidation}
            setValue={setRow}
            value={row}
          />
          <HelperText
            type="error"
            visible={row.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {rowvalidation}
          </HelperText>
          <WithoutScanDropdown
            placeholder={'Select Subrow'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={styles.textinput}
            error={subRowvalidation}
            setValue={setSubrow}
            value={subrow}
          />
          <HelperText
            type="error"
            visible={subrow.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {subRowvalidation}
          </HelperText>
          <DropdownTextInput
            placeholder={'Select Department'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={styles.textinput}
            error={departmentvalidation}
            setValue={setDepartment}
            value={department}
          />
          <HelperText
            type="error"
            visible={department.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {departmentvalidation}
          </HelperText>
          <DropdownTextInput
            placeholder={'Select Program'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={[styles.textinput, {marginTop: responsiveHeight(3)}]}
            error={programvalidation}
            setValue={setProgram}
            value={program}
          />
          <HelperText
            type="error"
            visible={program.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {programvalidation}
          </HelperText>
          <DropdownTextInput
            placeholder={'Assign to'}
            imagestyle={{marginTop: responsiveHeight(4)}}
            style={[styles.textinput, {marginTop: responsiveHeight(2)}]}
            error={assigntovalidation}
            setValue={setAssign}
            value={assign}
          />
          <HelperText
            type="error"
            visible={assign.length <= 0}
            style={{
              marginLeft: responsiveWidth(3),
              color: Colors.VALIDATION_COLOR,
            }}>
            {assigntovalidation}
          </HelperText>
          <View
            style={[
              styles.textareaContainer,
              {flex: 1, borderStyle: 'dashed'},
            ]}>
            <TouchableOpacity onPress={toggleModal}>
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
                      marginTop: responsiveHeight(3.5),
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
                      marginTop: responsiveHeight(3),
                    }}>
                    <TouchableOpacity
                      onPress={openCamera}
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
                      onPress={openGallery}
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
                        marginTop: responsiveHeight(4.5),
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
            // ref={imageRef}
            contentContainerStyle={{paddingHorizontal: responsiveWidth(2)}}
            data={imageList}
            renderItem={({item,index}) => <Item item={item} index={index} />}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={item => item.id}
          />
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            editable
            // onChangeText={this.onChange}
            // defaultValue={this.state.text}
            // maxLength={120}
            placeholder={'Type something'}
            placeholderTextColor={Colors.TEXT_HEAD}
            underlineColorAndroid={'transparent'}
          />
          <Buttons
            title="Submit"
            style={styles.button}
            textstyle={styles.buttontext}
            onPress={() => isValidInputs()}
          />
        </ScrollView>
      </InputScrollView>
    </View>
  );
};

export default WithoutScanDetail;

const styles = StyleSheet.create({
  textinput: {
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    marginHorizontal: responsiveWidth(9),
    marginLeft: responsiveWidth(6),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    lineHeight: 18,
    letterSpacing: 0.7,
    marginTop: responsiveHeight(2),
    padding: 1,
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
    textAlign: 'left', // hack android
    height: responsiveHeight(15),
    fontSize: 12,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.TEXT_HEAD,
    textAlignVertical: 'top',
    textDecorationColor: 'red',
  },
  buttontext: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
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
  imagestyle: {
    marginTop: responsiveHeight(8),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
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
