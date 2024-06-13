/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/**
    * Purpose: Create Common Vitals Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023
    *   * Steps: 1. Add Vitals

    */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images, Fonts, Colors} from '../../constants';

import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import EmptyVitals from '../emptyScreens/EmptyVitals';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';


import {useFocusEffect} from '@react-navigation/core';
import Tooltip from 'react-native-walkthrough-tooltip';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    height: 'Height',
    diameter: 'Diameter',
    health: 'Health',
    radious: 'Radius',
    date: '23 Jun 2023',
    height_value: '6.5',
    diameter_value: '6.5',
    health_value: '75%',
    radious_value: '6.5',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    height: 'Height',
    diameter: 'Diameter',
    health: 'Health',
    radious: 'Radius',
    date: '24 Jun 2023',
    height_value: '6.5',
    diameter_value: '6.5',
    health_value: '75%',
    radious_value: '6.5',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f60',
    height: 'Height',
    diameter: 'Diameter',
    health: 'Health',
    radious: 'Radius',
    date: '25 Jun 2023',
    height_value: '6.5',
    diameter_value: '6.5',
    health_value: '75%',
    radious_value: '6.5',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f65',
    height: 'Height',
    diameter: 'Diameter',
    health: 'Health',
    radious: 'Radius',
    date: '26 Jun 2023',
    height_value: '6.5',
    diameter_value: '6.5',
    health_value: '75%',
    radious_value: '6.5',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    height: 'Height',
    diameter: 'Diameter',
    health: 'Health',
    radious: 'Radius',
    date: '27 Jun 2023',
    height_value: '6.5',
    diameter_value: '6.5',
    health_value: '75%',
    radious_value: '6.5',
  },
];
const Item = ({
  height,
  health,
  diameter,
  radious,
  date,
  health_value,
  diameter_value,
  height_value,
  radious_value,
}) => {
  const [healthToolTipVisible, setHealthToolTipVisible] = useState(false);
  const [heightToolTipVisible, setHeightToolTipVisible] = useState(false);
  const [radiousToolTipVisible, setRadiousToolTipVisible] = useState(false);
  const [diameterToolTipVisible, setDiameterToolTipVisible] = useState(false);
  const {vitalsDetails} = useSelector(state => state.vitalsDetails);
  const toggleModalHealth = () => {
    setDiameterToolTipVisible(false);
    setHealthToolTipVisible(true);
    setHeightToolTipVisible(false);
    setRadiousToolTipVisible(false);
  };
  const toggleModalRadious = () => {
    setDiameterToolTipVisible(false);
    setHealthToolTipVisible(false);
    setHeightToolTipVisible(false);
    setRadiousToolTipVisible(true);
  };
  const toggleModalHeight = () => {
    setDiameterToolTipVisible(false);
    setHealthToolTipVisible(false);
    setHeightToolTipVisible(true);
    setRadiousToolTipVisible(false);
  };
  const toggleModalDiameter = () => {
    setDiameterToolTipVisible(true);
    setHealthToolTipVisible(false);
    setHeightToolTipVisible(false);
    setRadiousToolTipVisible(false);
  };
  const Close = () => {
    setHealthToolTipVisible(false);
    setDiameterToolTipVisible(false);
    setHeightToolTipVisible(false);
    setRadiousToolTipVisible(false);
  };
  var string = health_value;

  var string_length = string?.length;

  // console.log('=====', string_length);
  return (
    <View style={styles.item}>
      <Text style={styles.date}>{moment(date).format('YYYY MMM DD')}</Text>
      <View style={styles.row}>
        <View>
          <Text style={[styles.title, {marginLeft: responsiveHeight(0.5)}]}>
            Height(cm)
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  {
                    marginTop: responsiveHeight(1),
                    textAlign: 'left',
                    marginLeft: responsiveHeight(1),
                    width: responsiveWidth(10),
                  },
                ]}>
                {height_value || '0'}
              </Text>
            </View>
            {/* tooltip added for view more data  */}
            <Tooltip
              isVisible={heightToolTipVisible}
              content={<Text>{height_value || '0'}</Text>}
              // backgroundColor={'transparent'}
              placement="top"
              onClose={() => Close()}>
              <TouchableOpacity onPress={toggleModalHeight}>
                {height_value.length > 3 ? (
                  <Image
                    source={Images.RIGHT_ARROW}
                    style={[styles.rightarrow]}
                  />
                ) : null}
              </TouchableOpacity>
            </Tooltip>
          </View>
        </View>
        <View>
          <Text style={[styles.title, {marginLeft: responsiveHeight(1.3)}]}>
            Girth(mm)
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  {
                    marginTop: responsiveHeight(1),
                    textAlign: 'left',
                    marginLeft: responsiveHeight(1.3),
                    width: responsiveWidth(10),
                  },
                ]}>
                {diameter_value || '0'}
              </Text>
            </View>
            {/* tooltip added for view more data  */}
            <Tooltip
              isVisible={diameterToolTipVisible}
              content={<Text>{diameter_value || '0'}</Text>}
              // backgroundColor={'transparent'}
              placement="top"
              onClose={() => Close()}>
              <TouchableOpacity onPress={toggleModalDiameter}>
                {diameter_value?.length > 3 ? (
                  <Image
                    source={Images.RIGHT_ARROW}
                    style={[styles.rightarrow]}
                  />
                ) : null}
              </TouchableOpacity>
            </Tooltip>
          </View>
        </View>
        <View>
          <Text style={[styles.title, {marginLeft: responsiveHeight(1.5)}]}>
            Health
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  {
                    marginTop: responsiveHeight(1),
                    textAlign: 'center',
                    marginLeft: responsiveHeight(1.5),
                    width: responsiveWidth(11),
                  },
                ]}>
                {health_value|| '0'}
              </Text>
            </View>
            {/* tooltip added for view more data  */}
            <Tooltip
              isVisible={healthToolTipVisible}
              content={<Text>{health_value || '0'}</Text>}
              // backgroundColor={'transparent'}
              placement="top"
              onClose={() => Close()}>
              <TouchableOpacity onPress={toggleModalHealth}>
                {health_value?.length > 6 ? (
                  <Image
                    source={Images.RIGHT_ARROW}
                    style={[styles.rightarrow]}
                  />
                ) : null}
              </TouchableOpacity>
            </Tooltip>
          </View>
        </View>
        <View>
          <Text style={[styles.title, {marginLeft: responsiveHeight(1)}]}>
            Canopy Diameter(cm)
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text
                // ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  {
                    marginTop: responsiveHeight(1),
                    textAlign: 'center',
                    marginLeft: responsiveHeight(5),
                    width: responsiveWidth(10),
                  },
                ]}>
                {radious_value || '0'}
              </Text>
            </View>
            {/* tooltip added for view more data  */}
            <Tooltip
              isVisible={radiousToolTipVisible}
              content={<Text>{radious_value || '0'}</Text>}
              // backgroundColor={'transparent'}
              placement="top"
              onClose={() => Close()}>
              <TouchableOpacity onPress={toggleModalRadious}>
                {radious_value?.length > 3 ? (
                  <Image
                    source={Images.RIGHT_ARROW}
                    style={[styles.rightarrow, {}]}
                  />
                ) : null}
              </TouchableOpacity>
            </Tooltip>
          </View>
        </View>
      </View>
    </View>
  );
};
const Vitals = () => {
  const [tree, setTree] = useState([]);
  const {vitalPersist} = useSelector(state => state.vitalPersist);

  //redux States
  const {treeDetails} = useSelector(state => state.treeDetails);
  const {treeisLoading} = useSelector(state => state.treeisLoading);
  const {vitalsDetails} = useSelector(state => state.vitalsDetails);

  const [vitalsArray, setVitalsArray] = useState([]);

  useFocusEffect(
    React.useCallback(
      async => {
        getVitalsList();
        console.log('arrayvitals===', vitalsDetails);
        return () => {};
      },
      [vitalPersist],
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
  const getVitalsList = () => {
    let vitalsList = [];
    const _vitalList = vitalPersist;

    _vitalList.forEach(vital => {
      if (vital.vitalAsset_id === treeDetails.assetid) {
        vitalsList.push(vital);
      }
    });

    if (Array.isArray(vitalsDetails)) {
      let array = [];
      vitalsDetails?.map(item => {
        array.push(item);
      });
      setVitalsArray([...vitalsList, ...array]);
    } else {
      setVitalsArray(vitalsList);
    }
  };
  return (
    <View style={styles.container}>
      {treeisLoading ? (
        <ListLoader />
      ) : (
        <FlatList
          data={vitalsArray || []}
          // data={ListLoader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: responsiveHeight(3)}}
          renderItem={({item}) =>           (
            <Item
              height={item.height}
              date={item.recorded_date}
              diameter={item.diameter}
              health={item.health}
              radious={item.radious}
              height_value={item.height}
              diameter_value={item.diameter}
              health_value={item.health}
              radious_value={item.radius}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => <EmptyVitals />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom:responsiveHeight(5),
    marginTop: responsiveHeight(1),
    marginBottom:responsiveHeight(3),
  },
  item: {
    backgroundColor: Colors.FLATLIST_INNER_COLOR,
    marginVertical: 8,
    borderRadius: 2,
    borderWidth: 1,
    marginTop: responsiveHeight(1),
    borderColor: Colors.VITAL_FLATLIST_BORDER,
    marginHorizontal: responsiveWidth(4),
    width: responsiveWidth(93),
    height: responsiveWidth(28),
  },
  rightarrow: {
    tintColor: Colors.VITALS_ITEM_COLOR,
    // marginLeft: responsiveWidth(0),
    marginTop: responsiveHeight(1.5),
    width: responsiveScreenWidth(2),
    height: responsiveScreenHeight(1.4),
  },
  title: {
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    fontStyle: 'normal',
    // paddingRight:responsiveWidth(10),
    marginTop: responsiveHeight(5),
    marginLeft: responsiveHeight(2.6),
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.VITALS_ITEM_COLOR,
    // textAlign: 'right',
  },
  value: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    marginTop: responsiveHeight(1.5),
    marginLeft: responsiveHeight(3),
    width: responsiveWidth(11),
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.ITEM_COLOR,
    flex: 1,
    textAlign: 'left',
  },
  date: {
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.7,
    color: Colors.DATE_COLOR,
    marginLeft: responsiveWidth(1.5),
    marginTop: responsiveHeight(1.5),
    fontWeight: '500',
    textAlign: 'right',
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
});

export default Vitals;
