/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Common Notes Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023
    *   * Steps: 1. Add Notes

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
import HTMLView from 'react-native-htmlview';

import {RectButton, ScrollView} from 'react-native-gesture-handler';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {Images, Fonts, Colors, Globals} from '../../constants';
import EmptyNotes from '../emptyScreens/EmptyNotes';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

import {useFocusEffect} from '@react-navigation/core';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: '23 Jun 2023',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d76',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: '23 Jun 2023',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d70',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: '23 Jun 2023',
  },
];

const Notes = () => {
  //redux States
  const {treeDetails} = useSelector(state => state.treeDetails);
  const {treeisLoading} = useSelector(state => state.treeisLoading);
  const {noteDetails} = useSelector(state => state.noteDetails);
  const [notesArray, setNotesArray] = useState([]);
  const {notePersist} = useSelector(state => state.notePersist);
  const {vitalPersist} = useSelector(state => state.vitalPersist);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  
  const {_assets, _incidents, _assetsImagesList, _incidentsImagesList} =
    useSelector(state => state.offLineDBState);
    const {incidentDetails} = useSelector(state => state.incidentDetails);
    const [incidentsArray, setIncidentsArray] = useState([]);

    useFocusEffect(
    React.useCallback(
      async => {
        getNotes();
        getAllIncidents();
        console.log('arraynotes===', incidentsArray);
        return () => {};
      },
      [notePersist, vitalPersist, incidentPersist],
    ),
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

  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name === 'p') {
      return (
        <Text key={index} style={[styles.title]}>
          {defaultRenderer(node.children, parent)}
        </Text>
      );
    }
  };
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
  const getNotes = () => {
      const _notes = [];
      notePersist?.map((item)=>{
      if (item.assetId === treeDetails.assetid) {
        let obj = {
          note: item.note,
          recorded_date: item.recordedDate,
        };
        _notes.push(obj);
      }
    })
console.log('vitalpersist',vitalPersist);
console.log('incidentPersist',incidentPersist);
    const _vitalList = vitalPersist;
    let vitalsNotes = [];
    _vitalList.forEach(vital => {
      if (vital.vitalAsset_id === treeDetails.assetid) {
        if (vital.task !== undefined && vital.task !== '') {
          let obj = {
            note: vital.task,
            recorded_date: vital.startTime,
          };
          vitalsNotes.push(obj);
        }
      }
    });
    console.log('vitalsNotes', vitalsNotes);
    const _incidentNotes = incidentPersist;
    let incidentNotes = [];
    _incidentNotes.forEach(incident => {
      //  console.log('Incident>>>>>>>>>>>>>>>>>>>>>>>>>', incident)
      if (incident.assetId === treeDetails.assetid) {
        if (incident.notes !== undefined && incident.notes !== '') {
          let obj = {
            note: incident.notes,
            recorded_date: incident.recorded_date,
          };
          incidentNotes.push(obj);
        }
      }
    });
    console.log('incidents notes', incidentNotes)
    NoteArray([..._notes, ...vitalsNotes]);
    console.log('2333',_notes)
  };
  const NoteArray = notes => {
    if (Array.isArray(noteDetails)) {
      let array = noteDetails?.filter(
        obj =>
          (obj.note !== undefined && obj.note !== '') &&
          (obj.notes !== undefined && obj.notes !== '')
      );
      let incidentsList = [];
    const _incidents = incidentPersist;

    _incidents.forEach(incident => {
      // console.log('Incident>>>>>>>>>>>>>>>>>>>>>>>>>', incident)
      if (incident.assetId === treeDetails.assetid) {
        incidentsList.push(incident);
      }
    });
      setNotesArray([...notes, ...array]);
    } else {
      setNotesArray(notes);
    }
  };
  const Item = ({item}) => {
    return (
      <View style={styles.item}>
        <HTMLView
          scrollEnabled
          value={item?.notes || item?.note ||item?.task}
          renderNode={renderNode}
        />
        <Text style={styles.date}>
          {moment(item?.recorded_data || item?.recorded_date).format(
            'YYYY MMM DD',
          )}
        </Text>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
        {incidentsArray?.map((incidentitem)=>{
          return(
          treeisLoading ? (
              <ListLoader />
            ) : 
           <View style={styles.item}>
             <HTMLView
       scrollEnabled
       value={incidentitem?.notes}
       renderNode={renderNode}
     />
     <Text style={styles.date}>
       {moment(incidentitem?.timestamp).format(
         'YYYY MMM DD',
       )}
     </Text>
     </View>
          )
})}
      {treeisLoading ? (
        <ListLoader />
      ) : 
        <FlatList
          contentContainerStyle={{paddingBottom: responsiveHeight(3)}}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={notesArray || []}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={incidentsArray?.length<=0&&notesArray?.length<=0?EmptyNotes:null}
        />
}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsiveHeight(1),
    marginBottom:responsiveHeight(3),
  },
  item: {
    marginTop: responsiveHeight(1),
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.FLATLIST_BORDER_COLOR,
    marginHorizontal: responsiveWidth(4),
    borderRadius: 2,
    width: responsiveWidth(90),
    // height: responsiveWidth(26.6),
  },
  title: {
    // position:'absolute',
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.ITEM_COLOR,
  },
  date: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'right',
    letterSpacing: 0.7,
    color: Colors.DATE_COLOR,
    // marginTop: responsiveHeight(10),
    paddingRight: responsiveHeight(2),
    fontWeight: '500',
    // position:'absolute',
    alignSelf: 'flex-end',
  },
});

export default Notes;
