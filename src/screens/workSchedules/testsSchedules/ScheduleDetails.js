/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create SchedulesDetailScreen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 21 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Translations, Globals} from '../../../constants';
import HeaderScreen from '../../../components/headerScreen/HeaderScreen';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import ItemSeparatorScreen from '../../../components/itemSeparatorScreen/ItemSeparatorScreen';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveWidth} from 'react-native-responsive-dimensions';

import ProductType from '../tabs/ProductType';
import Assets from '../tabs/Assets';
import {t} from 'i18next';
import APIConnections from '../../../helpers/apiManager/APIConnections';
import DataManager from '../../../helpers/apiManager/DataManager';
import Utilities from '../../../helpers/utils/Utilities';
import {useSelector, useDispatch} from 'react-redux';
import {setDetailSchedule} from '../../../redux/slice/scheduleDetailSlice';
import {
  setStartTask,
  setEndTask,
  setAddButton,
} from '../../../redux/slice/taskSlice';
import {useFocusEffect} from '@react-navigation/core';
import NetInfo from '@react-native-community/netinfo';
import HTMLView from 'react-native-htmlview';

import StorageManager from '../../../helpers/storageManager/StorageManager';
const ScheduleDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  //redux state
  const dispatch = useDispatch();
  const {detailSchedule} = useSelector(state => state.detailSchedule);
  // const {taskSilce}=useSelector(state => state.taskSilce)
  const {startTask} = useSelector(state => state.startTask);
  const {endTask} = useSelector(state => state.endTask);
  const {addButton} = useSelector(state => state.addButton);
  const route = useRoute();

  console.log('title==>>', Globals.SELECTED_SCHEDULE_ID);
  useEffect(() => {
    return () => {
      Globals.NEED_NAVIGATION_TO_TREE_VITALS = false;
      Globals.NEED_NAVIGATION_TO_OTHER_VITALS = false;
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
  useFocusEffect(
    React.useCallback(() => {
      NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        setIsConnected(state.isConnected);
        if (state.isConnected) {
           getSchedulesDetails();
        }
      });

      return undefined;
    }, []),
  );
  useFocusEffect(
    React.useCallback(() => {
      // checkLocationPermission();
      return undefined;
    }, []),
  );
  /* Shimmer loader for the flatList */
  const ListLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={1000}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="40" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="80" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="100" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="140" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="160" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="200" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="220" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="260" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="280" rx="10" ry="10" width="40%" height="16" />
      <Rect x="55%" y="260" rx="10" ry="10" width="30%" height="16" />
      <Rect x="55%" y="280" rx="10" ry="10" width="43%" height="16" />
      <Rect x="5%" y="320" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="340" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="380" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="400" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="440" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="460" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="500" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="520" rx="10" ry="10" width="50%" height="16" />
      <Rect x="5%" y="560" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="580" rx="10" ry="10" width="50%" height="16" />
      <Rect x="2%" y="650" rx="0" ry="0" width="30%" height="40" />
      <Rect x="35%" y="650" rx="0" ry="0" width="30%" height="40" />
      <Rect x="68%" y="650" rx="0" ry="0" width="30%" height="40" />
    </ContentLoader>
  );

  // API CALL

  /**
               * Purpose: Perform schedulesDetail
               * Created/Modified By: Loshith C H
               * Created/Modified Date: 20 March 2023
               * Steps:
                 1.fetch schedule details from API and append to state variable
            */

  const getSchedulesDetails = () => {
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'schedules',
      [APIConnections.KEYS.METHOD]: 'show',
      [APIConnections.KEYS.FILTERS_ID]: Globals.SELECTED_SCHEDULE_ID.id,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.fetchSchedulesDetails(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('response data ====>>>>>>>>>>', responseData);
          dispatch(setDetailSchedule(responseData));
          // dispatch(setAddButton(detailSchedule.taskid));
          // dispatch(setStartTask(detailSchedule.taskid));
          console.log('response data ====>>>>', detailSchedule);
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        } else {
          setIsLoading(false);
    
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      },
    );
  };
  /**
               * Purpose: Perform start button action
               * Created/Modified By: Loshith C H
               * Created/Modified Date: 22 March 2023
               * Steps:
                 1.perform start button action from API and append to state variable
            */

  const getStartButtonDetails = () => {
    // setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'schedules',
      [APIConnections.KEYS.METHOD]: 'edit',
      [APIConnections.KEYS.DATA_STATUS]: 'In Progress',
      [APIConnections.KEYS.DATA_ID]: Globals.SELECTED_SCHEDULE_ID.id,
      [APIConnections.KEYS.DATA_TASK_ID]: Globals.SELECTED_SCHEDULE_ID.taskid,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.fetchStartButtonDetails(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('sucess happen====');
          console.log('response data ====>>>>', responseData);
          dispatch(setDetailSchedule(responseData));
          StorageManager.saveStaredTask(Globals.SELECTED_SCHEDULE_ID.id);
          getSchedulesDetails();
          dispatch(setStartTask(responseData.taskid));
          console.log('vvvvv', responseData.taskid);
          setTimeout(() => {
            setIsLoading(false);
            dispatch(setStartTask(responseData.taskid));
          }, 3000);
        } else {
          setIsLoading(false);
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      },
    );
  };
  /**
               * Purpose: Perform End button action
               * Created/Modified By: Loshith C H
               * Created/Modified Date: 22 March 2023
               * Steps:
                 1.perform end button action from API and append to state variable
            */

  const getEndButtonDetails = () => {
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'schedules',
      [APIConnections.KEYS.METHOD]: 'edit',
      [APIConnections.KEYS.DATA_STATUS]: 'Completed',
      [APIConnections.KEYS.DATA_ID]: Globals.SELECTED_SCHEDULE_ID.id,
      [APIConnections.KEYS.DATA_TASK_ID]: detailSchedule.taskid,
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.fetchEndButtonDetails(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('///end====', Globals.SELECTED_SCHEDULE_ID);
          dispatch(setDetailSchedule({}));
          dispatch(setStartTask(null));
          // dispatch(setEndTask(detailSchedule.taskid));
          dispatch(setAddButton(null));
          StorageManager.saveStaredTask(null);
          Globals.NEED_NAVIGATION_TO_HOME = true;
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'WorkSchedules',
              },
            ],
          });
          setTimeout(() => {
            setIsLoading(false);
            dispatch(setStartTask(null));
            // dispatch(setEndTask(detailSchedule.taskid));
            dispatch(setAddButton(null));
          }, 3000);
        } else {
          setIsLoading(false);
          Utilities.showToast(
            t(Translations.FAILED),
            message,
            'error',
            'bottom',
          );
        }
      },
    );
  };
  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name === 'p') {
      return (
        <Text
          key={index}
          style={{
            // position:'absolute',
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.7,
            color: Colors.ITEM_COLOR,
          }}>
          {defaultRenderer(node.children, parent)}
        </Text>
      );
    }
  };
  const backButtonAction = () => {
    navigation.goBack();
  };
  const onPressAction = () => {
    if (startTask !== null || Globals.SELECTED_SCHEDULE_ID?.status === 'In Progress') {
      if (Globals.SELECTED_SCHEDULE_ID?.type==='Tree Vitals') {
        Globals.NEED_NAVIGATION_TO_TREE_VITALS = true;
        setTimeout(() => {
          navigation.push('ScanScreen', {isFromIncident: false});
        }, 1000);
        StorageManager.saveStaredTask(Globals.SELECTED_SCHEDULE_ID.id);
        dispatch(setAddButton(detailSchedule.taskid));
        dispatch(setStartTask(detailSchedule.taskid));
      } else {
        // other withal

        Globals.NEED_NAVIGATION_TO_OTHER_VITALS = true;
        setTimeout(() => {
          navigation.push('ScanScreen', {isFromIncident: false});
        }, 1000);
        StorageManager.saveStaredTask(Globals.SELECTED_SCHEDULE_ID.id);
        dispatch(setAddButton(detailSchedule.taskid));
        dispatch(setStartTask(detailSchedule.taskid));
      }
    } else {
      Utilities.showToast('Sorry!', 'Please start task', 'error', 'bottom');
    }
  };
  const startButtonAction = () => {
    if (detailSchedule?.status === 'To Do') {
      getStartButtonDetails();
    } else {
      Utilities.showToast('Sorry!', 'Task already ended', 'error', 'bottom');
    }
  };

  const endButtonAction = () => {
    if (addButton !== null) {
      getEndButtonDetails();
    } else if (detailSchedule?.type === 'Tree Vitals') {
      Utilities.showToast('Sorry!', 'Please add vitals', 'error', 'bottom');
    } else {
      Utilities.showToast('Sorry!', 'Please add vitals', 'error', 'bottom');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: responsiveHeight(90)}}>
        <HeaderScreen
          title={Globals.SELECTED_SCHEDULE_ID.programme}
          backbutton={{marginTop: responsiveHeight(3)}}
          titlestyle={{fontSize: responsiveFontSize(1.9)}}
          onPress={() => backButtonAction()}
        />

        <ItemSeparatorScreen height={responsiveHeight(3)} />
        {isLoading === true ? (
          <ListLoader />
        ) : (
          <>
            <View style={{marginHorizontal: responsiveScreenWidth(5)}}>
              <Text style={styles.titleText}>{'Task Name'}</Text>

              <Text style={styles.valueText}>
                {isConnected === true
                  ? detailSchedule?.name
                  : Globals.SELECTED_SCHEDULE_ID.name}
              </Text>
            </View>
            <ItemSeparatorScreen height={responsiveHeight(3)} />
            <View style={{marginHorizontal: responsiveScreenWidth(5)}}>
              <Text style={styles.titleText}>{'Type'}</Text>

              <Text style={styles.valueText}>
                {isConnected === true
                  ? detailSchedule?.type
                  : Globals.SELECTED_SCHEDULE_ID.type}
              </Text>
            </View>
            <ItemSeparatorScreen height={responsiveHeight(3)} />
            <View style={{marginHorizontal: responsiveScreenWidth(5)}}>
              <Text style={styles.titleText}>{'Farm'}</Text>
              <Text style={styles.valueText}>
                {isConnected === true
                  ? detailSchedule?.farm
                  : Globals.SELECTED_SCHEDULE_ID.farm}
              </Text>
            </View>
            <ItemSeparatorScreen height={responsiveHeight(3)} />
            <View style={{marginHorizontal: responsiveScreenWidth(5)}}>
              <Text style={styles.titleText}>{'Programme'}</Text>

              <Text style={styles.valueText}>
                {isConnected === true
                  ? detailSchedule?.programme
                  : Globals.SELECTED_SCHEDULE_ID.programme}
              </Text>
            </View>
            <ItemSeparatorScreen height={responsiveHeight(3)} />
            {/* date section */}
            <View
              style={{
                marginHorizontal: responsiveScreenWidth(5),
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{'Start date'}</Text>
                <Text style={styles.valueText}>
                  {isConnected === true
                    ? detailSchedule?.startdate
                    : Globals.SELECTED_SCHEDULE_ID.startdate}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{'End date'}</Text>
                <Text style={styles.valueText}>
                  {isConnected === true
                    ? detailSchedule?.duedate
                    : Globals.SELECTED_SCHEDULE_ID.duedate}
                </Text>
              </View>
            </View>
            <ItemSeparatorScreen height={responsiveHeight(3)} />
            <View
              style={{
                marginHorizontal: responsiveScreenWidth(5),
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    fontFamily: Fonts.IBM_PLEX_SANS_SEMIBOLD,
                    color: Colors.ROUND_COLOR,
                    letterSpacing: 0.7,
                  }}>{`Round  ${
                  isConnected === true
                    ? detailSchedule?.round
                    : Globals.SELECTED_SCHEDULE_ID.round
                }`}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginBottom: responsiveHeight(4),
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      marginLeft:
                        detailSchedule?.status === 'Completed' ||
                        detailSchedule?.status === 'In Review' ||
                        detailSchedule?.status === 'In Progress'
                          ? responsiveWidth(0)
                          : responsiveWidth(2),
                    },
                  ]}>
                  <Text style={styles.buttonText}>
                    {isConnected === true
                      ? detailSchedule?.status
                      : Globals.SELECTED_SCHEDULE_ID.status}
                  </Text>
                </TouchableOpacity>
                <ItemSeparatorScreen width={responsiveWidth(3)} />
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>
                    {isConnected === true
                      ? detailSchedule?.priority
                      : Globals.SELECTED_SCHEDULE_ID.priority}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ItemSeparatorScreen height={responsiveHeight(1)} />
            <View
              style={{
                marginHorizontal: responsiveScreenWidth(5),
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{'Assigned by'}</Text>
                <Text style={styles.valueText}>
                  {isConnected === true
                    ? detailSchedule?.admin
                    : Globals.SELECTED_SCHEDULE_ID.admin}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{'Assigned to'}</Text>
                <Text style={styles.valueText}>
                  {isConnected === true
                    ? detailSchedule?.user
                    : Globals.SELECTED_SCHEDULE_ID.user}
                </Text>
              </View>
            </View>

            <ItemSeparatorScreen height={responsiveHeight(3)} />

            {detailSchedule &&
            detailSchedule.chemicals &&
            detailSchedule.chemicals.length > 0 ? (
              <ProductType />
            ) : null}

            <Assets
              asset={
                isConnected === true
                  ? detailSchedule?.asset
                  : Globals.SELECTED_SCHEDULE_ID.asset
              }
              type={
                isConnected === true
                  ? detailSchedule?.assettype
                  : Globals.SELECTED_SCHEDULE_ID.assettype
              }
            />

            <View
              style={{
                flex: 1,
                marginHorizontal: responsiveScreenWidth(5),
                flexDirection: 'column',
              }}>
              <Text style={styles.titleText}>{'Description'}</Text>
              {/* <Textarea
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
                      /> */}
              <View style={styles.item}>
                <HTMLView
                  scrollEnabled
                  value={
                    isConnected === true
                      ? detailSchedule?.description
                      : Globals.SELECTED_SCHEDULE_ID.description
                  }
                  renderNode={renderNode}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                marginHorizontal: responsiveWidth(2),
                // bottom: responsiveHeight(0),
                //      position:'absolute'
              }}>
              <TouchableOpacity
                style={{
                  height: responsiveHeight(6),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    (startTask !== null && endTask !== null) ||
                    detailSchedule?.status === 'In Progress' ||
                    detailSchedule?.status === 'In Review' ||
                    Globals.SELECTED_SCHEDULE_ID?.status === 'In Progress' ||
                    Globals.SELECTED_SCHEDULE_ID?.status === 'In Review'
                      ? Colors.BLACK_SHADE_COLOR
                      : Colors.GREEN_COLOR,
                  marginTop: responsiveWidth(10),
                  width: responsiveWidth(31),
                  borderRadius: 2,
                }}
                onPress={() => startButtonAction()}
                disabled={
                  (startTask !== null && endTask !== null) ||
                  detailSchedule?.status === 'In Progress' ||
                  detailSchedule?.status === 'In Review' ||
                  Globals.SELECTED_SCHEDULE_ID?.status === 'In Progress' ||
                  Globals.SELECTED_SCHEDULE_ID?.status === 'In Review'

                  ? true
                    : false
                }>
                <Text style={styles._buttontext}>{`Start\nTask`}</Text>
              </TouchableOpacity>
              <ItemSeparatorScreen
                height={'100%'}
                width={responsiveWidth(1.5)}
              />

              <TouchableOpacity
                style={{
                  height: responsiveHeight(6),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    endTask !== null ||
                    detailSchedule?.status === 'Completed' ||
                    detailSchedule?.status === 'Done'||
                    Globals.SELECTED_SCHEDULE_ID?.type==='Completed'||
                    Globals.SELECTED_SCHEDULE_ID?.type==='Done'
                      ? Colors.BLACK_SHADE_COLOR
                      : Colors.GREEN_COLOR,
                  marginTop: responsiveWidth(10),
                  width: responsiveWidth(31),
                  borderRadius: 2,
                }}
                onPress={() => onPressAction()}
                disabled={
                  (startTask === null && endTask !== null) ||
                  detailSchedule?.status === 'Completed' ||
                  Globals.SELECTED_SCHEDULE_ID?.status==='Completed'||
                  Globals.SELECTED_SCHEDULE_ID?.status==='Done'||
                  detailSchedule?.status === 'Done'
                    ? true
                    : false
                }>
                <Text style={styles._buttontext}>
                  {
                  Globals.SELECTED_SCHEDULE_ID?.type==='Tree Vitals'
                    ? `Add Tree\nVitals`
                    : `Scan\nAsset`}
                </Text>
              </TouchableOpacity>
              <ItemSeparatorScreen
                height={'100%'}
                width={responsiveWidth(1.5)}
              />
              <TouchableOpacity
                style={{
                  height: responsiveHeight(6),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    (startTask === null && addButton !== null) ||
                    detailSchedule?.status === 'Completed' ||
                    detailSchedule?.status === 'Done' ||
                    Globals.SELECTED_SCHEDULE_ID?.status === 'Completed' ||
                    Globals.SELECTED_SCHEDULE_ID?.status === 'Done'
                      ? Colors.BLACK_SHADE_COLOR
                      : Colors.GREEN_COLOR,
                  marginTop: responsiveWidth(10),
                  width: responsiveWidth(31),
                  borderRadius: 2,
                }}
                onPress={() => endButtonAction()}
                disabled={
                  (startTask === null && addButton !== null) ||
                  detailSchedule?.status === 'Completed' ||
                  detailSchedule?.status === 'Done' ||
                  Globals.SELECTED_SCHEDULE_ID?.status === 'Completed' ||
                  Globals.SELECTED_SCHEDULE_ID?.status === 'Done'
                    ? true
                    : false
                }>
                <Text style={styles._buttontext}>{`End\nTask`}</Text>
              </TouchableOpacity>
            </View>
            <ItemSeparatorScreen
              height={responsiveHeight(3)}
              width={responsiveWidth(1.5)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  titleText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
  },
  valueText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SCHEDULE_DETAIL_BUTTON_BG,
    borderRadius: responsiveWidth(1),
    height: responsiveHeight(3),
    borderColor: Colors.SCHEDULE_DETAIL_BUTTON_TEXT,
    borderWidth: responsiveHeight(0.1),
  },
  buttonText: {
    marginHorizontal: responsiveWidth(4),
    color: Colors.SCHEDULE_DETAIL_BUTTON_TEXT,
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.ROBOTO_Medium,
  },
  _buttontext: {
    // flex:1,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.7,
    color: Colors.BUTTON_TEXT_COLOR,
  },
  _button: {
    height: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_COLOR,
    marginTop: responsiveWidth(10),
    width: responsiveWidth(31),
    // marginLeft: responsiveHeight(3),
    // flex: 1,
    borderRadius: 2,
  },
  textareaContainer: {
    height: responsiveHeight(14.8),
    marginTop: responsiveHeight(2),
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
  item: {
    marginTop: responsiveHeight(1),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.FLATLIST_BORDER_COLOR,
    alignSelf: 'center',
    borderRadius: 2,
    width: responsiveWidth(90),
    // height: responsiveWidth(26.6),
  },
});
