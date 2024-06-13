/* eslint-disable react/no-unstable-nested-components */
import {
  StyleSheet,
  Text,
  View,
  Image,

  FlatList,
  TouchableOpacity,
  TextInput,
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
import {HelperText} from 'react-native-paper';
import {useSelector} from 'react-redux';
const DropdownTextInput = ({
  placeholder,
  style,
  imagestyle,
  validation,
  value,
  setValue,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [departmentValue, setDepartmentValue] = useState([
    placeholder === 'Assign to'
      ? assign
      : placeholder === 'Select Program'
      ? program
      : placeholder === 'Select Department'
      ? department
      : null,
  ]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);

 

  const {admins, departments, programmes} = useSelector(
    state => state.offLineDBState,
  );
  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
    setSearch('');
  };

  const closeButtonAction = () => {
    console.log('close');
    setIsLoading(true);
    Keyboard.dismiss();
    setSearch('');
  };
  const array = [departments];
  const searchFilterFunction = text => {
    // check the dropdowns
    if (placeholder === 'Assign to') {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the admin and update FilteredDataSource
        const newData = admins?.filter(function (item) {
          // Applying filter for the inserted text in search bar
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();

          return itemData.indexOf(textData) > -1;
        });

        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with admin
        setFilteredDataSource(admins);
        setSearch(text);
      }
    } else if (placeholder === 'Select Program') {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the program and update FilteredDataSource
        const newData = programmes.filter(function (item) {
          // Applying filter for the inserted text in search bar
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          console.log('===', itemData);
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with program
        setFilteredDataSource(programmes);
        setSearch(text);
      }
    } else if (placeholder === 'Select Department') {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the departments and update FilteredDataSource

        const newData = departments?.filter(function (item) {
          // Applying filter for the inserted text in search bar
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          console.log('===', array);
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with departments
        setFilteredDataSource(departments);
        setSearch(text);
      }
    }
  };
  const SelectItem = item => {
    console.log('item', item);
    setValue(item);

    setModalVisible(false);
  };
  const department = [
    {key: '1', title: 'Department 1'},
    {key: '2', title: 'Department 2'},
    {key: '3', title: 'Department 3'},
    {key: '4', title: 'Department 4'},
    {key: '5', title: 'Department 5'},
    {key: '6', title: 'Department 6'},
    {key: '7', title: 'Department 7'},
  ];
  const program = [
    {key: '1', title: 'Program 1'},
    {key: '2', title: 'Program 2'},
    {key: '3', title: 'Program 3'},
    {key: '4', title: 'Program 4'},
    {key: '5', title: 'Program 5'},
    {key: '6', title: 'Program 6'},
    {key: '7', title: 'Program 7'},
  ];
  const assign = [
    {key: '1', title: 'Assign 1'},
    {key: '2', title: 'Assign 2'},
    {key: '3', title: 'Assign 3'},
    {key: '4', title: 'Assign 4'},
    {key: '5', title: 'Assign 5'},
    {key: '6', title: 'Assign 6'},
    {key: '7', title: 'Assign 7'},
  ];
  const Item = ({item}) => {
    return (
      <View style={[styles.item, {marginTop: responsiveHeight(3)}]}>
        <TouchableOpacity
          onPress={() => SelectItem(item)}
          style={[styles.title, {}]}>
          <Text style={[styles.title, {}]}>{item.name}</Text>
        </TouchableOpacity>
        {/* <Text style={styles.date}>{date}</Text> */}
      </View>
    );
  };
  const EmptyComponent = () => {
    return (
      <View>
        <Text
          style={[
            styles.title,
            {
              alignSelf: 'center',
              marginTop: responsiveHeight(10),
            },
          ]}>
          {placeholder === 'Assign to'
            ? 'No assign available'
            : placeholder === 'Select Program'
            ? 'No program available'
            : placeholder === 'Select Department'
            ? 'No department available'
            : []}
        </Text>
      </View>
    );
  };
  const SelectChoice = () => {
    // setDepartmentValue()
  };
  return (
    <View>
      <TouchableOpacity style={{}} onPress={toggleModal}>
        <TextInput
          editable={false}
          multiline
          numberOfLines={1}
          style={[styles.textinput, style]}
          placeholder={placeholder}
          placeholderTextColor={Colors.TEXT_HEAD}
          value={value}
          onChangeText={text => setValue(departmentValue)}
        />
        <HelperText
          type="error"
          visible={validation}
          style={{
            color: Colors.VALIDATION_COLOR,
            fontSize: 12,
            textAlign: 'left',
            marginLeft: responsiveHeight(0),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
            letterSpacing: 0.7,
            position: 'absolute',
          }}>
          {validation}
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
                minHeight: responsiveHeight(50),
              }}>
              <Text
                style={{
                  marginTop: responsiveHeight(3),
                  marginLeft: responsiveWidth(4),
                  fontSize: 20,
                }}>
                {placeholder === 'Assign to'
                  ? 'Assign to'
                  : placeholder === 'Select Program'
                  ? 'Select Program'
                  : placeholder === 'Select Department'
                  ? 'Select Department'
                  : null}
              </Text>
              <SearchBox
                search={search}
                // onChangeText={(text) => searchFilterFunction(text)}
                // value={search}
                searchFilterFunction={searchFilterFunction}
                closeButtonAction={closeButtonAction}
              />
              <FlatList
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                data={
                  placeholder === 'Assign to'
                    ? search
                      ? filteredDataSource
                      : admins || []
                    : placeholder === 'Select Program'
                    ? search
                      ? filteredDataSource
                      : programmes || []
                    : placeholder === 'Select Department'
                    ? search
                      ? filteredDataSource
                      : departments || []
                    : []
                }
                renderItem={({item}) => <Item item={item} />}
                keyExtractor={(item, index) => index.toString()} //2
                ListEmptyComponent={EmptyComponent}
                keyboardShouldPersistTaps={'handled'}
              />
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
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DropdownTextInput;

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
});
