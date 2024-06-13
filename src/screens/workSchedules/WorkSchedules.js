/* eslint-disable space-infix-ops */
/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create WorkSchedules Screen Component
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
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Translations, Globals} from '../../constants';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/core';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {t} from 'i18next';

import {useSelector} from 'react-redux';

import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

import moment from 'moment';
const DATA = [
  {
    id: '1',
    title: '585858',
    subTitle: 'Daily',
    boxText: 'Tree tagging',
    status: 'Not Started',
  },
  {
    id: '2',
    title: '646564',
    subTitle: 'Weekly',
    boxText: 'Pest & Diseases',
    status: 'Not Started',
  },
  {
    id: '3',
    title: '858750',
    subTitle: 'Weekly',
    boxText: 'Pest & Diseases',
    status: 'Not Started',
  },
];

const WorkSchedules = () => {
  // const dispatch=useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredScheduleList, setFilteredScheduleList] = useState([]);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  //redux States

  const {userDetails} = useSelector(state => state.userDetails);

  const {scheduleList} = useSelector(state => state.offLineDBState);

  const navigation = useNavigation();
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
      configData();
      return undefined;
    }, []),
  );

  const configData = () => {
    // console.log('scheduleList in scheduleList', scheduleList);

    const newData = scheduleList.filter(item => {
      if (userDetails?.name === item?.admin) {
        return item;
      }
    });
    setFilteredScheduleList(newData);
    setIsLoading(false);
  };

  const EmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: responsiveHeight(40),
        }}>
        <Text style={styles.emptyText}>No entries to show</Text>
      </View>
    );
  };

  const ScheduleLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={300}
      marginTop={responsiveHeight(1)}
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="0" ry="0" width="90%" height="90" />
      <Rect x="5%" y="120" rx="0" ry="0" width="90%" height="90" />
      <Rect x="5%" y="220" rx="0" ry="0" width="90%" height="90" />
    </ContentLoader>
  );

  const backButtonAction = () => {
    if (Globals.NEED_NAVIGATION_TO_HOME === true) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomePageScreen',
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  };
  // console.log('item===',scheduleList)
  const Item = ({item}) => (
    <TouchableOpacity
      style={styles.flatListBox}
      onPress={() => {
        Globals.SELECTED_SCHEDULE_ID = item;
        navigation.navigate('ScheduleDetails');
      }}>
      <View style={styles.innerBox}>
        <Text style={styles.innerBoxText}> {item.name} </Text>
      </View>
      <View
        style={[
          styles.status,
          {
            marginRight:
              item?.status === 'Done' || item?.status === 'To Do'
                ? responsiveHeight(2)
                : responsiveHeight(0),
          },
        ]}>
        <Text style={styles.StatusText}>
          {item?.duedate >= date ||
          item?.status === 'Completed' ||
          item?.status === 'Done'
            ? item?.status
            : 'Overdue'}
        </Text>
      </View>
      <View style={{width: responsiveWidth(50)}}>
        <Text
          style={[
            styles.titleText,
            {
              width: responsiveWidth(50),
            },
          ]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item.programme}
        </Text>
      </View>
      <Text style={styles.subTitleText}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderScreen
        title={t(Translations.WORK_SCHEDULES)}
        description={t(Translations.VIEW_ALL_WORK_SCHEDULES)}
        onPress={() => backButtonAction()}
      />
      {isLoading ? (
        <ScheduleLoader />
      ) : (
        <FlatList
          data={filteredScheduleList}
          renderItem={({item}) =>
            item.programme === false ? null : <Item item={item} />
          }
          keyExtractor={item => item.id}
          ListEmptyComponent={EmptyComponent}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkSchedules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  flatListBox: {
    width: responsiveWidth(90),
    height: responsiveHeight(11),
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: Colors.LIGHT_GREY_COLOR,
    marginLeft: responsiveHeight(2),
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    backgroundColor: Colors.RED_SHADE_COLOR,
    padding: 10,
  },
  titleText: {
    fontFamily: Fonts.ROBOTO_Medium,
    color: Colors.BLACK_SHADE_COLOR,
    marginTop: responsiveHeight(-3),
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.3,
  },
  subTitleText: {
    fontFamily: Fonts.ROBOTO,
    color: Colors.BLACK_SHADE_COLOR,
    marginTop: responsiveHeight(0.7),
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.3,
  },
  innerBox: {
    flexDirection: 'row',
    height: responsiveHeight(3),
    width: responsiveWidth(25),
    backgroundColor: Colors.LEAF_GREEN_COLOR,
    marginLeft: responsiveHeight(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  innerBoxText: {
    color: Colors.WHITE_COLOR,
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  status: {
    flexDirection: 'row',
    // marginLeft: responsiveHeight(30),
    position: 'absolute',
    right: responsiveHeight(3),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: responsiveHeight(4),
  },
  StatusText: {
    fontFamily: Fonts.ROBOTO,
    color: Colors.BLACK_SHADE_COLOR,
    marginTop: responsiveHeight(1.5),
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginRight: responsiveHeight(1),
  },
  emptyText: {
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: responsiveFontSize(2),
  },
});
