/**
    * Purpose: Create NotificationListScreen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 23 Mar 2023
    * Steps: 1. Create Screen
             2. navigation added
    */

import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Globals, Translations,Images} from '../../constants';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {
  responsiveScreenWidth,
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import APIConnections from '../../helpers/apiManager/APIConnections';
import DataManager from '../../helpers/apiManager/DataManager';
import Utilities from '../../helpers/utils/Utilities';
import {t} from 'i18next';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {setViewNotification} from '../../redux/slice/notificationViewSlice';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const NotificationListScreen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  //redux state
  const {viewNotification} = useSelector(state => state.viewNotification);
  const {notificationCount} = useSelector(state => state.notificationCount);

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

  useFocusEffect(
    React.useCallback(() => {
      if (isConnected) {
        getViewNotificationList();
      }

      return undefined;
    }, []),
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Clean up
      unsubscribe();
    };
  }, []);

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf:'center',
          marginTop: responsiveHeight(40),
        }}>
        <Image style={styles.notificationIcon}
        source={Images.NO_NOTIFICATION_ICON}/>
        <Text style={styles.emptyText}>No Notification</Text>
      </View>
    );
  };

  const dummyNotificationList = [
    {
      id: '1',
      day: 'Today',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '2',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '3',
      day: 'Today',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '4',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '5',
      day: 'Yesterday',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '6',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '7',
      day: 'Yesterday',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '8',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '9',
      day: 'Yesterday',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
    {
      id: '10',
      title: 'New task created for 🌴 Tree Vitals',
      subTitle: 'You have new task created by Admin 2256',
      time: '10:30 AM',
    },
  ];
  // API CALL

  /**
   * Purpose: update notification item
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 27 March 2023
   * Steps:
     1.pass notification id
*/

  const getViewNotificationList = () => {
    // setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'notifications',
      [APIConnections.KEYS.METHOD]: 'get',
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.fetchViewNotificationDetails(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('response data 1 ====>>>>', responseData);
          dispatch(setViewNotification(responseData));
          //  console.log('response data ====>>>>', viewNotification);
          // setTimeout(() => {
          //   setIsLoading(false);
          // }, 3000);
        } else {
          //  setIsLoading(false);
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

  // API CALL

  /**
   * Purpose: read notification item
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 27 March 2023
   * Steps:
     1.read notification id
*/

  const getReadNotificationList = () => {
    // setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.KEY]: Globals.API_KEY,
      [APIConnections.KEYS.RESOURCE]: 'notifications',
      [APIConnections.KEYS.METHOD]: 'read',
    };
    const formBody = Object.keys(_body)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.fetchReadNotificationDetails(formBody).then(
      ([isSuccess, message, responseData]) => {
        if (isSuccess === true) {
          console.log('response data 3 ====>>>>', responseData);
          dispatch(setViewNotification(responseData));
          // console.log('response data ====>>>>', detailSchedule);
          // setTimeout(() => {
          //   setIsLoading(false);
          // }, 3000);
        } else {
          // setIsLoading(false);
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

  const Item = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.flatListBox}
        onPress={() => getReadNotificationList()}>
        <Text style={styles.titleText}>{item.day}</Text>
        <Text style={styles.valueText}>{item.title}</Text>
        <Text style={styles.subTitleText}>{item.subTitle}</Text>
        <Text style={styles.dayText}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title={`🔔 Notifications (${notificationCount})`}
        onPress={() => backButtonAction()}
      />
      <View style={{marginBottom: responsiveHeight(8.5)}}>
        <FlatList
          data={viewNotification}
          renderItem={item => <Item item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => emptyComponent()}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  flatListBox: {
    width: responsiveWidth(100),
    height: responsiveHeight(15),
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: Colors.LIGHT_GREY_COLOR,
    backgroundColor: Colors.RED_SHADE_COLOR,
  },
  valueText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
    marginHorizontal: responsiveHeight(5),
  },
  titleText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.UBUNTU_REGULAR,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
    marginHorizontal: responsiveHeight(2),
    marginTop: responsiveHeight(1.5),
  },
  subTitleText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.UBUNTU_REGULAR,
    color: Colors.ITEM_COLOR,
    letterSpacing: 0.7,
    marginHorizontal: responsiveHeight(5),
    marginTop: responsiveHeight(1),
  },
  dayText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    color: Colors.ROUND_COLOR,
    letterSpacing: 0.7,
    marginHorizontal: responsiveHeight(5),
    marginTop: responsiveHeight(2),
  },
  emptyText: {
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: responsiveFontSize(2),
  },
  notificationIcon:{
    height:55,
    width:55,
    tintColor:Colors.GREEN_COLOR,
  }
});
