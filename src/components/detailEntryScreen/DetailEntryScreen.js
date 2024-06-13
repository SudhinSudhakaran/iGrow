/* eslint-disable react/no-unstable-nested-components */
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,

  FlatList,
  Platform,
  Alert,
  Linking,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors, Fonts, Globals, Images} from '../../constants';
import {TextInput} from 'react-native-gesture-handler';
import DropdownTextInput from '../../screens/shared/textInputs/DropdownTextInput';
import Textarea from 'react-native-textarea/src/Textarea';
import Buttons from '../button/Buttons';
import {useNavigation, useFocusEffect} from '@react-navigation/core';

import Utilities from '../../helpers/utils/Utilities';

import ImagePicker from 'react-native-image-crop-picker';
import {HelperText} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../../helpers/utils/Permission';
import NetInfo from '@react-native-community/netinfo';

import {
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
import moment from 'moment';
import {useRoute} from '@react-navigation/native';
import {setIncidentPersist} from '../../redux/slice/reduxPersistSlice';

const DetailEntryScreen = props => {
  const route = useRoute();
  const dispatch = useDispatch();
  //redux States
  const {treeDetails} = useSelector(state => state.treeDetails);

  const navigation = useNavigation();

  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState({
    id: '',
    name: '',
  });
  const [program, setProgram] = useState({id: '', name: ''});
  const [assignto, setAssignto] = useState({id: '', name: ''});
  const [notes, setNotes] = useState('');
  const [departmentValidation, setDepartmentValidation] = useState('');
  const [programValidation, setProgramValidation] = useState('');
  const [assigntoValidation, setAssigntoValidation] = useState('');
  const [notesValidation, setNotesValidation] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [imageList, setImageList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const {userDetails} = useSelector(state => state.userDetails);
  const {incidentPersist} = useSelector(state => state.incidentPersist);

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
      console.log('useDetails', userDetails);
      console.log('treeDetails=>', treeDetails);

      return () => {};
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
    route?.params?.needToHome === true
      ? navigation.reset({
          index: 0,
          routes: [{name: 'IncidentList'}],
        })
      : navigation.goBack();
  };

  const removeImageArray = _index => {
    const filteredArray = imageList.filter((item, index) => index !== _index);
    setImageList(filteredArray);
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
          // console.log('items: ', imageList);
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

 
  const isValidInputs = () => {
    // console.log(
    //   'department',
    //   department.id.length,
    //   'assignto',
    //   assignto.id.length,
    //   'program',
    //   program.id.length,
    // );
    var _isValidText = 0;
    if (
      subject.length <= 0 ||
      department.id.length <= 0 ||
      assignto.id.length <= 0 ||
      program.id.length <= 0
    ) {
      setNotesValidation('Please enter subject');
      setDepartmentValidation('Please select department');
      setAssigntoValidation('Please select assign');
      setProgramValidation('Please select program');
      _isValidText = 0;
    } else {
      setNotesValidation('');
      setDepartmentValidation('');
      setProgramValidation('');
      setAssigntoValidation('');
      _isValidText = 1;
    }

    if (_isValidText === 1) {
      addIncidentsToLocalDataBase();
    }
  };

  const addIncidentsToLocalDataBase = () => {
    addDataToIncidentsTable(
      department?.id,
      assignto?.id,
      treeDetails?.clientid,
      userDetails?.uid,
      treeDetails?.assetid,
      program?.id,
      userDetails?.email,
      subject,
      notes,
      treeDetails.category.toLowerCase(),
      imageList,
      treeDetails?.farm,
      department.name,
      program.name,
      assignto.name,
    );
  };

  const addDataToIncidentsTable = async (
    _departmentId,
    _adminId,
    _clientId,
    _userId,
    _assetId,
    _projectId,
    _email,
    _subject,
    _notes,
    _assetType,
    _imageList,
    _farm,
    _departmentName,
    _programName,
    _assigntoName,
  ) => {
    const imagesString = JSON.stringify(_imageList);
    let incidentStore = {
      departmentId: _departmentId,
      adminId: _adminId,
      clientId: _clientId,
      userId: _userId,
      assetId: _assetId,
      projectId: _projectId,
      email: _email,
      subject: _subject,
      notes: _notes,
      assetType: _assetType,
      images: imagesString,
      farm: _farm,
      department: _departmentName,
      programme: _programName,
      admin: _assigntoName,
      status: 'Open',
      _id: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      isFromApi: false,
      incidentUniqId: `iGrow_incident_${moment().valueOf()}`,
      recorded_date: moment().format()
    };

    dispatch(setIncidentPersist([incidentStore, ...incidentPersist]));
    Utilities.showToast(
      'Success',
      'Incident added successfully',
      'success',
      'bottom',
    );
    backButtonAction();
  };

  const Item = ({item, index}) => {
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
              // marginTop: responsiveHeight(4),
              // marginLeft: responsiveWidth(90),
              // position:'absolute'
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

    const ListFooterComponent = () => {};
    return (
      <View
        style={[styles.textareaContainer, {flex: 1, borderStyle: 'dashed'}]}>
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
                  marginTop: responsiveHeight(3),
                  marginLeft: responsiveWidth(4),
                }}>
                <Text style={styles.selectoption}> Select an option</Text>
              </View>
              <TouchableOpacity
                onPress={() => openCamera()}
                style={{
                  marginTop: responsiveHeight(4),
                  marginLeft: responsiveWidth(4),

                  width: responsiveScreenWidth(80),
                  height: responsiveHeight(5),
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 15}}> Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openGallery()}
                style={{
                  marginTop: responsiveHeight(4),
                  marginLeft: responsiveWidth(4),

                  width: responsiveScreenWidth(80),
                  height: responsiveHeight(5),
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 15}}>Open Gallery</Text>
              </TouchableOpacity>
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
    );
  };
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
        marginLeft: responsiveWidth(0),
      }}>
      <View
        style={{
          marginLeft: responsiveWidth(5),
          marginTop: responsiveHeight(1.5),
        }}>
        <ScrollView>
          <Text style={styles.heading}>Farm</Text>
          <Text style={styles.content}>{treeDetails?.farm || 'N/A'}</Text>
          <Text style={styles.heading}>Asset</Text>

          <Text style={styles.content}>{treeDetails?.category || 'N/A'}</Text>
          <Text style={styles.heading}>Add</Text>
          <TextInput
            style={[styles.textinput, {marginTop: responsiveHeight(0.5)}]}
            placeholderTextColor={Colors.TEXT_HEAD}
            placeholder={'Subject'}
            value={subject}
            error={notesValidation}
            // onChangeText={setNotes}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            onChangeText={setSubject}
            returnKeyType={'next'}
            // onSubmitEditing={() => {
            //   diameterRef.current.focus();
            // }}
          />
          <HelperText
            type="error"
            visible={subject.length <= 0}
            style={{
              marginLeft: responsiveWidth(1),
              color: Colors.VALIDATION_COLOR,
            }}>
            {notesValidation}
          </HelperText>
          <Text
            style={[
              styles.heading,
              {marginTop: responsiveHeight(31.5), position: 'absolute'},
            ]}>
            Status
          </Text>
          <Text
            style={[
              styles.content,
              {marginTop: responsiveHeight(34), position: 'absolute'},
            ]}>
            Active
          </Text>
          <DropdownTextInput
            placeholder={'Select Department'}
            style={{marginTop: responsiveHeight(9)}}
            imagestyle={{
              marginTop: responsiveHeight(11),
              marginLeft: responsiveWidth(90),
            }}
            error={departmentValidation}
            setValue={setDepartment}
            value={department.name}
          />
          <HelperText
            type="error"
            visible={department.id.length <= 0}
            style={{
              marginLeft: responsiveWidth(1),
              color: Colors.VALIDATION_COLOR,
            }}>
            {departmentValidation}
          </HelperText>
          <DropdownTextInput
            placeholder={'Select Program'}
            imagestyle={{
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(90),
            }}
            style={[styles.textinput, {marginTop: responsiveHeight(1)}]}
            error={programValidation}
            setValue={setProgram}
            value={program.name}
          />
          <HelperText
            type="error"
            visible={program.id.length <= 0}
            style={{
              marginLeft: responsiveWidth(1),
              color: Colors.VALIDATION_COLOR,
            }}>
            {programValidation}
          </HelperText>
          <DropdownTextInput
            placeholder={'Assign to'}
            imagestyle={{
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(90),
            }}
            style={[styles.textinput, {marginTop: responsiveHeight(1)}]}
            error={assigntoValidation}
            setValue={setAssignto}
            value={assignto.name}
          />
          <HelperText
            type="error"
            visible={assignto.id.length <= 0}
            style={{
              marginLeft: responsiveWidth(1),
              color: Colors.VALIDATION_COLOR,
            }}>
            {assigntoValidation}
          </HelperText>
          <View
            style={[
              styles.textareaContainer,
              {
                flex: 1,
                borderStyle: 'dashed',
                width: responsiveWidth(85),
                height: responsiveHeight(7),
                marginLeft: responsiveWidth(2),
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
                    marginTop: responsiveHeight(50),
                  }}>
                  <View
                    style={{
                      marginTop: responsiveHeight(3.5),
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
          <FlatList
            // ref={imageRef}
            contentContainerStyle={{paddingHorizontal: responsiveWidth(2)}}
            data={imageList}
            renderItem={({item, index}) => <Item item={item} index={index} />}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={item => item.id}
          />
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            editable
            value={notes}
            onChangeText={setNotes}
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
      </View>
    </View>
  );
};

export default DetailEntryScreen;

const styles = StyleSheet.create({
  heading: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginLeft: responsiveWidth(1),
    marginTop: responsiveHeight(3),
  },
  content: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveWidth(1),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    // marginTop:responsiveHeight(3),
  },
  textinput: {
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    marginHorizontal: responsiveWidth(4),
    marginLeft: responsiveWidth(0),
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    lineHeight: 18,
    letterSpacing: 0.7,
    padding: 2,
    height: responsiveHeight(5),
  },
  textareaContainer: {
    height: responsiveHeight(15),
    marginTop: responsiveHeight(2),
    marginLeft: responsiveHeight(1.2),
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
    // marginTop:responsiveHeight(2),
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
