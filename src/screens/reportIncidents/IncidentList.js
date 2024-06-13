/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create IncidentList Screen
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 28 March 2023
    * Steps: 1. Create Incidents-listing

    */

import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useState} from 'react';
import {useEffect} from 'react';
import {Buttons} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/core';
import {Fonts, Colors, Globals} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import HeaderScreen from '../../components/headerScreen/HeaderScreen';
import {setIncidentIsLoading} from '../../redux/slice/treeDetailSlice';
import EmptyIncidents from '../../components/emptyScreens/EmptyIncidents';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const IncidentList = () => {
  const dispatch = useDispatch();
  //redux States

  const navigation = useNavigation();
  const [incidentsArray, setIncidentsArray] = useState([]);
  const {incidents} = useSelector(state => state.offLineDBState);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  const {incidentIsLoading} = useSelector(state => state.incidentIsLoading);

  useEffect(() => {
    setIncidentIsLoading(true);
    setTimeout(() => {
      setIncidentIsLoading(false);
    }, 2000);
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
  const backButtonAction = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomePageScreen'}],
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      // checkLocationPermission();
      getAllIncidents();
      return undefined;
    }, [incidentPersist]),
  );

  //Shimmer loader for the flatList
  const ListLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={300}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="0" ry="0" width="90%" height="90" />
      <Rect x="5%" y="120" rx="0" ry="0" width="90%" height="90" />
      <Rect x="5%" y="220" rx="0" ry="0" width="90%" height="90" />
    </ContentLoader>
  );

  const Item = ({item, index}) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            Globals.SELECTED_INCIDENT_ID = item?.item;
            Globals.SELECTED_IMAGE = item?.item?.images || [];
            navigation.navigate('IncidentDetail');
          }}>
          <Text style={styles.title}ellipsizeMode='tail' numberOfLines={2}>{item?.item?.subject}</Text>
          <Text style={styles.text}>
            {item?.item?.assettype === 'tree' ||
            item?.item?.assetType === 'tree'
              ? 'Tree'
              : item?.item?.assettype === 'seed' ||
                item?.item?.assetType === 'seed'
              ? 'Seed'
              : item?.item?.assettype === 'vehicle' ||
                item?.item?.assetType === 'vehicle'
              ? 'Vehicle'
              : 'N/A'}
          </Text>
          {item.item.status === 'Answered' || item.item.status === 'Closed' ? (
            <View
              style={[styles.status, {backgroundColor: Colors.RESOLVED_COLOR}]}>
              <Text style={[styles.statustext, {}]}>{item.item.status}</Text>
            </View>
          ) : (
            <View
              style={[
                styles.status,
                {backgroundColor: Colors.NOT_RESOLVED_COLOR},
              ]}>
              <Text style={[styles.statustext, {}]}>{item.item.status}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const getAllIncidents = () => {
   console.log('Incidents from api ', incidents);
    let array = [];

    incidents.map(item => {
      let obj = {...item};
      obj.isFromApi = true;
      array.push(obj);
    });
    if (incidentPersist.length > 0) {
      setIncidentsArray([...incidentPersist, ...array.reverse()]);
    } else {
      setIncidentsArray([...array.reverse()]);
    }
    setTimeout(() => {
      dispatch(setIncidentIsLoading(false));
    }, 3000);
  };

  return (
    <View style={{backgroundColor: Colors.WHITE_COLOR, flex: 1}}>
      <HeaderScreen
        onPress={() => backButtonAction()}
        title={'Incidents'}
        description={'View all incidents'}
        style={{marginTop: responsiveHeight(5)}}
        titlestyle={{marginTop: responsiveHeight(3)}}
        backbutton={{marginTop: responsiveHeight(4)}}
      />
      {incidentIsLoading ? (
        <ListLoader />
      ) : (
        <View style={{flex: 1}}>
          <View style={{height: responsiveHeight(80)}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(3),
              }}
              data={incidentsArray}
              renderItem={(item, index) => <Item item={item} index={index} />}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => <EmptyIncidents />}
            />
          </View>

          <Buttons
            title="Scan QR"
            style={styles.button}
            textstyle={styles.buttontext}
            onPress={() =>
              navigation.navigate('ScanScreen', {isFromIncident: true})
            }
          />
        </View>
      )}
    </View>
  );
};

export default IncidentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0),
    // height:responsiveHeight(100),
  },
  item: {
    flex: 1,
    marginTop: responsiveHeight(2),
    backgroundColor: Colors.RED_SHADE_COLOR,
    padding: 6,
    borderWidth: 0.4,
    borderColor: Colors.LIGHT_GREY_COLOR,
    marginHorizontal: responsiveWidth(4),
    width: responsiveWidth(93),
    height: responsiveWidth(23),
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '500',
    // lineHeight: 19,
    letterSpacing: -0.3,
    width:responsiveWidth(58),
    color: Colors.BLACK_SHADE_COLOR,
  },
  text: {
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: -0.3,
    fontSize: 12,
    color: Colors.BLACK_SHADE_COLOR,
    height: responsiveHeight(3.6),
    width: responsiveWidth(26),
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(2),
  },
  status: {
    borderWidth: 0.4,
    height: responsiveHeight(3.6),
    width: responsiveWidth(26),
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(60),
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
    // backgroundColor: Colors.INCIDENT_LIST_STATUS_TEXT,
    borderRadius: 3,
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
    // marginTop: responsiveHeight(2),
    height: responsiveHeight(6),
    flex: 1,
    marginBottom: responsiveHeight(2),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 4,
    // position: 'absolute',
    // bottom: 150,
  },
});
