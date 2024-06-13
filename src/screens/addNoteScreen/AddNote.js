/**
// * Purpose: Create New Notes Screen Component
// * Created/Modified By: Monisha Sreejith
// * Created/Modified Date: 8 March 2023

// */

import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import InputScrollView from 'react-native-input-scroll-view';
import Textarea from 'react-native-textarea/src/Textarea';
import {Buttons} from '../../components';
import {Fonts, Globals, Colors} from '../../constants';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {useNavigation} from '@react-navigation/core';
import moment from 'moment';

import {useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {HelperText} from 'react-native-paper';

import {useDispatch} from 'react-redux';

import LoadingIndicator from '../../components/loader/LoadingIndicator';
//Create databse
import {setNotePersist} from '../../redux/slice/reduxPersistSlice';
const AddNote = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');
  const navigation = useNavigation();
  const {treeDetails} = useSelector(state => state.treeDetails);

  const [isConnected, setIsConnected] = useState(true);
  const [noteValidationText, setNoteValidationText] = useState('');
  const {notePersist} = useSelector(state => state.notePersist);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
  const validateNotes = () => {
    let noteIsValid = 0;
    if (note.length <= 0) {
      noteIsValid = 0;
      setNoteValidationText('Enter note');
    } else {
      noteIsValid = 1;
      setNoteValidationText('');
    }
    if (noteIsValid === 1) {
      addNotesToLocalDataBase();
    }
  };

  const createAsset = async (assetId, assetType, noteText, recordedDate) => {
    let noteItem = {
      assetId: assetId,
      assetType: assetType,
      note: noteText,
      recordedDate: recordedDate,
      noteUniqId: `iGrow_note_${moment().valueOf()}`,
    };
    dispatch(setNotePersist([noteItem, ...notePersist]));
    Utilities.showToast(
      'Success',
      'Notes added successfully',
      'success',
      'bottom',
    );
    navigation.goBack();
  };

  /**
    * Purpose: Create and add data to DB
    * Created/Modified By: Sudhin Sudhakran 
    * Created/Modified Date: 9 -  3 -2023

    */
  const addNotesToLocalDataBase = () => {
    createAsset(
      treeDetails.assetid,
      treeDetails?.category?.toLowerCase(),
      note,
      moment().format('YYYY-MM-DD HH:mm:ss'),
    );
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
      }}>
      <InputScrollView
        contentContainerStyle={{}}
        style={styles.container}
        keyboardOffset={285}>
        <HeaderScreen
          onPress={() => navigation.goBack()}
          title={'Add Notes'}
          style={{marginTop: responsiveHeight(5)}}
          titlestyle={{marginTop: responsiveHeight(5)}}
          backbutton={{marginTop: responsiveHeight(6)}}
        />
        <LoadingIndicator visible={isLoading} />
        <View>
          <Text style={styles.text}>Notes</Text>
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
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
          <HelperText
            type="error"
            visible={note.length <= 0}
            style={{
              color: Colors.VALIDATION_COLOR,
              fontSize: 12,
              textAlign: 'center',
              marginTop: responsiveHeight(1),
              fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 18,
              letterSpacing: 0.7,
            }}>
            {noteValidationText}
          </HelperText>
        </View>

        <View style={{}}>
          <Buttons
            title="Submit"
            style={[styles.button, {}]}
            textstyle={[styles.buttontext, {}]}
            onPress={() => validateNotes()}
          />
        </View>
      </InputScrollView>
    </View>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  textareaContainer: {
    height: responsiveHeight(14.8),
    marginTop: responsiveHeight(20),
    marginLeft: responsiveHeight(4),
    width: responsiveWidth(85),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: Colors.GREEN_COLOR,
  },
  textarea: {
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
  buttontext: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: 0.7,
    color: Colors.WHITE_COLOR,
  },
  button: {
    height: responsiveHeight(5),
    marginTop: responsiveHeight(5),
    width: responsiveWidth(35),
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: Colors.GREEN_COLOR,
    //   marginTop: responsiveHeight(3),
    //   alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveWidth(9),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
    marginTop: responsiveHeight(15),
    position: 'absolute',
  },
});
