/* eslint-disable react/no-unstable-nested-components */
import {BackHandler, StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import InputScrollView from 'react-native-input-scroll-view';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Colors, Fonts, Globals, Images} from '../../constants';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MiddleScreen from '../../components/middleScreen/MiddleScreen';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import APIConnections from '../../helpers/apiManager/APIConnections';
import {useState} from 'react';
import {
  setreportIncidentsById,
  setIncidentIsLoadingById,
} from '../../redux/slice/treeDetailSlice';
import Textarea from 'react-native-textarea/src/Textarea';
import IncidentMiddleScreen from '../../components/middleScreen/IncidentMiddleScreen';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {useFocusEffect} from '@react-navigation/core';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const IncidentDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //redux States

  const {reportIncidentsById} = useSelector(state => state.reportIncidentsById);


  const {incidentIsLoadingById} = useSelector(
    state => state.incidentIsLoadingById,
  );

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // performViewIncidentList();
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
      dispatch(setIncidentIsLoadingById(true));
      setTimeout(() => {
        dispatch(setIncidentIsLoadingById(false));
      }, 2000);
      return undefined;
    }, []),
  );
  //   useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('<><><><><><>use layout effect  called 2<><><><><><><><');
  //     configImageArray();

  //     return undefined;
  //   }, []),
  // );
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

  const backButtonAction = () => {
    navigation.goBack();
  };
  //        /**
  //    * Purpose: Perform view incidents
  //    * Created/Modified By: Monisha Sreejith
  //    * Created/Modified Date: 28 March 2023
  //    * Steps:
  //      1.fetch vital details from API and append to state variable
  // */
  const performViewIncidentList = () => {
    setIsLoading(true);
    // dispatch(setIncidentIsLoadingById(true));
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.METHOD]: 'get',
      [APIConnections.KEYS.RESOURCE]: 'tickets',
      [APIConnections.KEYS.FILTERS_ID]: Globals.SELECTED_SCHEDULE_ID.id,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.viewIncidents(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('response data ====>>>>', responseData);
          dispatch(setreportIncidentsById(responseData[0]));
          setTimeout(() => {
            dispatch(setIncidentIsLoadingById(false));
          }, 3000);
        } else {
          Utilities.showToast('FAILED', message, 'error', 'bottom');
          setIsLoading(false);
        }
      },
    );
  };
  /* Shimmer loader for the flatList */
  const ListLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={500}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="10" ry="10" width="30%" height="16" />
      <Rect x="65%" y="20" rx="10" ry="10" width="30%" height="30" />
      <Rect x="5%" y="40" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="80" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="100" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="140" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="160" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="200" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="220" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="260" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="280" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="320" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="340" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="380" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="400" rx="10" ry="10" width="40%" height="16" />
    </ContentLoader>
  );

  return (
    <View style={{backgroundColor: Colors.WHITE_COLOR}}>
      <InputScrollView
        contentContainerStyle={{}}
        style={styles.container}
        keyboardOffset={285}
        backgroundColor={Colors.WHITE_COLOR}>
        <HeaderScreen
          title={'Incident Details'}
          description={
            reportIncidentsById?.assettype === 'tree' ||
            Globals.SELECTED_INCIDENT_ID?.assetType === 'tree'
              ? 'Detected as Tree 🌲'
              : reportIncidentsById?.assettype === 'seed' ||
                Globals.SELECTED_INCIDENT_ID?.assetType === 'seed'
              ? 'Detected as Seed 🌱'
              : reportIncidentsById?.assettype === 'vehicle' ||
                Globals.SELECTED_INCIDENT_ID?.assetType === 'vehicle'
              ? 'Detected as Vehicle 🚗'
              : null
          }
          onPress={() => navigation.goBack()}
        />
        <IncidentMiddleScreen
          backgroundimage={
            reportIncidentsById?.assettype === 'tree' ||
            Globals.SELECTED_INCIDENT_ID?.assetType === 'tree'
              ? Images.TREE
              : reportIncidentsById?.assettype === 'seed' ||
                Globals.SELECTED_INCIDENT_ID?.assetType === 'seed'
              ? Images.SEED
              : reportIncidentsById?.assettype === 'vehicle' ||
                Globals.SELECTED_INCIDENT_ID?.assetType === 'vehicle'
              ? Images.CAR
              : null
          }
        />
        {incidentIsLoadingById === true ? (
          <ListLoader />
        ) : (
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={styles.heading}>Farm</Text>
              <Text style={styles.content}>
                {Globals.SELECTED_INCIDENT_ID?.farm || 'N/A'}
              </Text>
              <Text style={styles.heading}>Asset</Text>
              <Text style={styles.content}>
                {Globals.SELECTED_INCIDENT_ID?.assettype === 'tree' ||
                Globals.SELECTED_INCIDENT_ID?.assetType === 'tree'
                  ? 'Tree'
                  : Globals.SELECTED_INCIDENT_ID?.assettype === 'seed'
                  ? 'Seed'
                  : Globals.SELECTED_INCIDENT_ID?.assettype === 'vehicle'
                  ? 'Vehicle'
                  : 'N/A'}
              </Text>
              <Text style={styles.heading}>Subject</Text>
              <Text style={styles.content}>
                {reportIncidentsById?.subject ||
                  Globals.SELECTED_INCIDENT_ID?.subject ||
                  'N/A'}
              </Text>
              <Text style={styles.heading}>Department</Text>
              <Text style={styles.content}>
                {reportIncidentsById?.department ||
                  Globals.SELECTED_INCIDENT_ID?.department ||
                  'N/A'}
              </Text>
              <Text style={styles.heading}>Program</Text>
              <Text style={styles.content}>
                {Globals.SELECTED_INCIDENT_ID?.programme || 'N/A'}
              </Text>
              <Text style={styles.heading}>Assigned to</Text>
              <Text style={styles.content}>
                {Globals.SELECTED_INCIDENT_ID?.admin || 'N/A'}
              </Text>
              <Text style={styles.heading}>Notes</Text>
              {/* <Text style={styles.content}>{reportIncidentsById?.notes || 'N/A'}</Text> */}
              <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                editable={false}
                value={
                  reportIncidentsById?.notes ||
                  Globals.SELECTED_INCIDENT_ID?.notes ||
                  'N/A'
                }
                // onChangeText={this.onChange}
                // defaultValue={this.state.text}
                // maxLength={120}
                placeholder={''}
                placeholderTextColor={Colors.TEXT_HEAD}
                underlineColorAndroid={'transparent'}
              />
            </View>
            {reportIncidentsById?.status === 'Answered' ||
            reportIncidentsById?.status === 'Closed' ||
            Globals.SELECTED_INCIDENT_ID?.status === 'Answered' ||
            Globals.SELECTED_INCIDENT_ID?.status === 'Closed' ? (
              <View
                style={[
                  styles.status,
                  {backgroundColor: Colors.RESOLVED_COLOR},
                ]}>
                <Text
                  style={[
                    styles.statustext,
                    {backgroundColor: Colors.RESOLVED_COLOR},
                  ]}>
                  {reportIncidentsById?.status ||
                    Globals.SELECTED_INCIDENT_ID?.status ||
                    'N/A'}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.status,
                  {backgroundColor: Colors.NOT_RESOLVED_COLOR},
                ]}>
                <Text
                  style={[
                    styles.statustext,
                    {backgroundColor: Colors.NOT_RESOLVED_COLOR},
                  ]}>
                  {reportIncidentsById?.status ||
                    Globals.SELECTED_INCIDENT_ID?.status ||
                    'N/A'}
                </Text>
              </View>
            )}
          </View>
        )}
      </InputScrollView>
    </View>
  );
};

export default IncidentDetail;

const styles = StyleSheet.create({
  heading: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(1.5),
  },
  content: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    // marginTop:responsiveHeight(3),
  },
  status: {
    borderWidth: 0.4,
    height: responsiveHeight(3.6),
    width: responsiveWidth(26),
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(70),
    textAlign: 'center',
    position: 'absolute',
    borderColor: Colors.INCIDENT_LIST_STATUS,
    backgroundColor: Colors.INCIDENT_LIST_STATUS_TEXT,
    borderRadius: 3,
  },
  statustext: {
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 12,
    letterSpacing: -0.3,
    fontSize: 10,
    // color: Colors.INCIDENT_LIST_STATUS,
    color: Colors.WHITE_COLOR,
    marginTop: responsiveWidth(2),
    // marginLeft: responsiveWidth(60),
    textAlign: 'center',
    // position:'absolute',
    backgroundColor: Colors.INCIDENT_LIST_STATUS_TEXT,
    borderRadius: 3,
  },
  textareaContainer: {
    // height: responsiveHeight(14.8),
    marginTop: responsiveHeight(0),
    marginLeft: responsiveHeight(2),
    width: responsiveWidth(85),
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: Colors.WHITE_COLOR,
  },
  textarea: {
    textAlign: 'left', // hack android
    fontSize: 16,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.7,
    color: Colors.TEXT_HEAD,
    textAlignVertical: 'top',
  },
});
