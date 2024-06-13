import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Images} from '../../../constants';

import Modal from 'react-native-modal';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import SearchBox from './SearchBox';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {HelperText} from 'react-native-paper';
const WithoutScanDropdown = ({
  error,
  placeholder,
  style,
  imagestyle,
  visible,
  validationerror,
  validtext,
  setValue,
  value,
}) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [title, setIsTitle] = useState();
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  // const[value,setValue]=useState([]);
  const [departmentValue, setDepartmentValue] = useState([
    placeholder === 'Select Farm'
      ? selectfarm
      : placeholder === 'Select Division'
      ? division
      : placeholder === 'Select Block'
      ? block
      : placeholder === 'Select Row'
      ? row
      : placeholder === 'Select Subrow'
      ? subrow
      : null,
  ]);
  //ReduxState
  
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
  const SelectItem = title => {
    setValue(title);
    setModalVisible(false);
  };
  const closeButtonAction = () => {
    console.log('close');
    setIsLoading(true);
    Keyboard.dismiss();
    setSearch('');
  };
  const searchFilterFunction = text => {
    var _text = '';
    // Check if searched text is not blank
    if (!isNaN(text) && text.charAt(0) !== '+') {
      _text = `${'+'}` + `${text.trim()}`;
    } else {
      _text = text.trim();
    }
    // console.log('_text',  `${'+'}` + `${text}`);
    console.log('search Filter', _text);
    if (departmentValue !== undefined && departmentValue !== null) {
      if (text) {
        if (_text.charAt(0) === '+') {
          const newData = departmentValue.filter(function (item) {
            console('1-======');
            const itemData = Item;
            const textData = _text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          console.log('NewData ====>', newData);
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          console.log('2-======', row);
          const newData = row.filter(function (item) {
            const itemData = row;
            const textData = _text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          console.log('NewData ====>', newData);
          setFilteredDataSource(newData);
          setSearch(text);
        }
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(departmentValue);
        setSearch(text);
        // setCrossButtonVisible(false);
      }
    }
  };
  var item = '';
  const selectfarm = [
    {key: '1', title: 'Select Farm 1'},
    {key: '2', title: 'Select Farm 2'},
    {key: '3', title: 'Select Farm 3'},
    {key: '4', title: 'Select Farm 4'},
    {key: '5', title: 'Select Farm 5'},
    {key: '6', title: 'Select Farm 6'},
    {key: '7', title: 'Select Farm 7'},
  ];
  const division = [
    {key: '1', title: 'Division 1'},
    {key: '2', title: 'Division 2'},
    {key: '3', title: 'Division 3'},
    {key: '4', title: 'Division 4'},
    {key: '5', title: 'Division 5'},
    {key: '6', title: 'Division 6'},
    {key: '7', title: 'Division 7'},
  ];
  const row = [
    {key: '1', title: 'Row 1'},
    {key: '2', title: 'Row 2'},
    {key: '3', title: 'Row 3'},
    {key: '4', title: 'Row 4'},
    {key: '5', title: 'Row 5'},
    {key: '6', title: 'Row 6'},
    {key: '7', title: 'Row 7'},
  ];
  const subrow = [
    {key: '1', title: 'Sub Row 1'},
    {key: '2', title: 'Sub Row 2'},
    {key: '3', title: 'Sub Row 3'},
    {key: '4', title: 'Sub Row 4'},
    {key: '5', title: 'Sub Row 5'},
    {key: '6', title: 'Sub Row 6'},
    {key: '7', title: 'Sub Row 7'},
  ];
  const block = [
    {key: '1', title: 'Block 1'},
    {key: '2', title: 'Block 2'},
    {key: '3', title: 'Block 3'},
    {key: '4', title: 'Block 4'},
    {key: '5', title: 'Block 5'},
    {key: '6', title: 'Block 6'},
    {key: '7', title: 'Block 7'},
  ];
  const Item = ({title}) => {
    item = title;
    console.log('item=====', item);
    return (
      <View style={[styles.item, {marginTop: responsiveHeight(4)}]}>
        <TouchableOpacity
          onPress={() => SelectItem(item)}
          style={[styles.title, {}]}>
          <Text style={[styles.title, {}]}> {title} </Text>
        </TouchableOpacity>
        {/* <Text style={styles.date}>{date}</Text> */}
      </View>
    );
  };
  const SelectChoice = () => {
    // setDepartmentValue()
  };
  return (
    <TouchableOpacity style={{}} onPress={toggleModal}>
      <TextInput
        editable={false}
        multiline
        numberOfLines={1}
        style={[styles.textinput, style]}
        placeholder={placeholder}
        error={validationerror}
        placeholderTextColor={Colors.TEXT_HEAD}
        value={value}
        onChangeText={text => setValue(departmentValue)}
      />
      <HelperText
        type="error"
        visible={departmentValue === undefined}
        style={[styles.error, error]}>
        {validationerror}
      </HelperText>
      <View style={[styles.imagestyle, imagestyle]}>
        <Image
          style={{
            width: responsiveWidth(4),
            height: responsiveHeight(2),
            // tintColor: Colors.PRIMARY_COLOR,
            resizeMode: 'contain',
            position: 'absolute',
            right: 8,
          }}
          source={Images.DROPDOWN_ICON}
        />

        <Modal
          isVisible={isModalVisible}
          style={{justifyContent: 'flex-end', margin: 0}}>
          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              margin: 0,
              backgroundColor: Colors.WHITE_COLOR,
              marginTop: responsiveHeight(50),
            }}>
            <Text
              style={{
                marginTop: responsiveHeight(3),
                marginLeft: responsiveWidth(4),
                fontSize: 20,
              }}>
              {placeholder === 'Select Farm'
                ? 'Select Farm'
                : placeholder === 'Select Division'
                ? 'Select Division'
                : placeholder === 'Select Block'
                ? 'Select Block'
                : placeholder === 'Select Row'
                ? 'Select Row'
                : placeholder === 'Select Subrow'
                ? 'Select Subrow'
                : null}
            </Text>
            <SearchBox
              search={search}
              searchFilterFunction={searchFilterFunction}
              closeButtonAction={closeButtonAction}
            />
            {search ? (
              <Text
                style={{
                  marginLeft: responsiveHeight(3),
                  height: responsiveHeight(20),
                  marginTop: responsiveHeight(5),
                }}>
                {search === item ? title : 'Search not available'}
              </Text>
            ) : (
              <FlatList
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                data={
                  placeholder === 'Select Farm'
                    ? selectfarm
                    : placeholder === 'Select Division'
                    ? division
                    : placeholder === 'Select Block'
                    ? block
                    : placeholder === 'Select Row'
                    ? row
                    : placeholder === 'Select Subrow'
                    ? subrow
                    : null
                }
                renderItem={({item}) => <Item title={item.title} />}
                keyExtractor={(item, index) => index.toString()} //2
                // ListEmptyComponent={listEmptyComponent}
                keyboardShouldPersistTaps={'handled'}
              />
            )}
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
                  //   position:'absolute'
                }}
                source={Images.CLOSE_ICON}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

export default WithoutScanDropdown;

const styles = StyleSheet.create({
  textinput: {
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    marginHorizontal: responsiveWidth(5),
    marginLeft: responsiveWidth(0.5),
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.TEXT_HEAD,
    lineHeight: 18,
    letterSpacing: 0.7,
    padding: 5,
    height: responsiveHeight(5),
  },
  imagestyle: {
    width: responsiveWidth(4),
    height: responsiveHeight(5),
    position: 'absolute',
    marginLeft: responsiveWidth(88),
    marginTop: responsiveHeight(4),
  },
  error: {
    color: Colors.VALIDATION_COLOR,
    fontSize: 12,
    textAlign: 'left',
    marginLeft: responsiveHeight(6),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.7,
    position: 'absolute',
  },
  modalchoice: {
    marginLeft: responsiveWidth(3),
    marginTop: responsiveHeight(3),
    // fontFamily:Fonts.IBM_PLEX_SANS_REGULAR,
    // fontSize:15,
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: Colors.WHITE_COLOR,
  },
  modalchoicetext: {
    marginLeft: responsiveWidth(3),
    marginTop: responsiveHeight(3),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontSize: 15,
    position: 'absolute',
    color: 'black',
  },
  item: {
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    borderBottomColor: Colors.SUBJECT_INPUTLINE_COLOR,
    borderBottomWidth: responsiveWidth(0.3),
    // marginHorizontal:responsiveWidth(5),
    marginLeft: responsiveWidth(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.TEXT_HEAD,
    lineHeight: 10,
    padding: 1,
    // backgroundColor:Colors.FLATLIST_INNER_COLOR,
    // padding: 20,
    // marginVertical: 8,
    // borderWidth:1,
    // borderColor:Colors.FLATLIST_BORDER_COLOR,
    marginHorizontal: responsiveWidth(4),
    // borderRadius:2,
    // width:responsiveWidth(90),
    // height:responsiveWidth(26.6),
  },
  title: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    // lineHeight: 16,
    // letterSpacing: 0.7,
    color: Colors.TEXT_HEAD,
  },
});
