/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-trailing-spaces */
/**
    * Purpose: Create Common Incidents Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023
    *   * Steps: 1. Add Incidents

    */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Fonts, Colors, } from '../../constants';

import {useSelector} from 'react-redux';
import EmptyIncidents from '../emptyScreens/EmptyIncidents';
import ContentLoader, {Rect} from 'react-content-loader/native';

import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Tree is dry',
    name: 'John Doe George',
    notresolved: 'Not Resolved',
    date: '23 Jun 2023',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Tree is dry',
    resolved: 'Resolved',
    name: 'John Doe George',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Tree is dry',
    notresolved: 'Not Resolved',
    name: 'John Doe George',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d75',
    title: 'Tree is dry',
    notresolved: 'Not Resolved',
    name: 'John Doe George',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d77',
    title: 'Tree is dry',
    notresolved: 'Not Resolved',
    name: 'John Doe George',
    date: '23 Jun 2023',
  },
];

const Incidents = () => {
  //redux States

  const {treeDetails} = useSelector(state => state.treeDetails);
  const {treeisLoading} = useSelector(state => state.treeisLoading);
  const {userDetails} = useSelector(state => state.userDetails);
  const [incidentsArray, setIncidentsArray] = useState([]);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  const {incidentDetails} = useSelector(state => state.incidentDetails);

  useFocusEffect(
    React.useCallback(
      async => {
        getAllIncidents();
        console.log('arrayincident===', incidentDetails);
        return () => {};
      },
      [incidentPersist],
    ),
  );
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
  const getAllIncidents = () => {
    let incidentsList = [];
    const _incidents = incidentPersist;

    _incidents.forEach(incident => {
      // console.log('Incident>>>>>>>>>>>>>>>>>>>>>>>>>', incident)
      if (incident.assetId === treeDetails.assetid) {
        incidentsList.push(incident);
      }
    });

    if (Array.isArray(incidentDetails)) {
      let array = [];
      incidentDetails?.map(item => {
        array.push(item);
      });

      setIncidentsArray([...incidentsList, ...array]);
    } else {
      setIncidentsArray(incidentsList);
    }
  };

  const Item = item => {
    // console.log('item', item);
    return (
      <View style={styles.item}>
        <Text style={styles.title}numberOfLines={1}>{item?.item.subject}</Text>
        <Text style={styles.name}>
          {item?.item.assignuser || userDetails?.name}
        </Text>
        <Text style={styles.date}>
          {moment(item.item.timestamp).format('YYYY MMM DD')}
        </Text>

        {item.item.status === 'Answered' || item.item.status === 'Closed' ? (
          <View
            style={[styles.button, {backgroundColor: Colors.RESOLVED_COLOR}]}>
            <Text style={styles.text}>{item.item.status}</Text>
          </View>
        ) : (
          <View style={styles.button}>
            <Text style={styles.text}>{item.item.status}</Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {treeisLoading ? (
        <ListLoader />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: responsiveHeight(3)}}
          data={incidentsArray || []}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => <EmptyIncidents />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsiveHeight(1),
    marginBottom:responsiveHeight(3),
    // height:responsiveHeight(100),
  },
  item: {
    flex: 1,
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.INCIDENT_FLATLIST_BORDER,
    marginHorizontal: responsiveWidth(4),
    width: responsiveWidth(93),
    height: responsiveWidth(25),
  },
  title: {
    fontSize: 14,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.7,
    color: Colors.DATE_COLOR,
  },
  name: {
    fontSize: 12,
    marginRight: responsiveWidth(3),
    marginTop: responsiveWidth(3),
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.DATE_COLOR,
    textAlign: 'right',
    // position:'absolute',
    alignItems: 'flex-start',
  },
  date: {
    // position:'absolute',
    alignItems: 'flex-start',
    fontSize: 12,
    marginRight: responsiveWidth(3),
    marginTop: responsiveWidth(1),
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.DATE_COLOR,
    textAlign: 'right',
  },
  button: {
    height: responsiveHeight(3.6),
    width: responsiveWidth(26),
    marginTop: responsiveWidth(14),
    marginLeft: responsiveWidth(4),
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: Colors.NOT_RESOLVED_COLOR,
    borderRadius: 3,
  },
  text: {
    textAlign: 'center',
    fontFamily: Fonts.ROBOTO,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 12,
    letterSpacing: -0.3,
    fontSize: 10,
    color: Colors.WHITE_COLOR,
  },
});

export default Incidents;
