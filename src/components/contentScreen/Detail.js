/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Common Detail Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 17 Feb 2023
    *   * Steps: 1. Add details

    */

import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {Images, Fonts, Colors, Globals} from '../../constants';
import Buttons from '../button/Buttons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ItemSeparatorScreen from '../itemSeparatorScreen/ItemSeparatorScreen';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import {useSelector} from 'react-redux';
import moment from 'moment';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const Detail = ({headingtext, content, headingtextright, contentright}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  //redux States
  const {treeDetails, assetLocation} = useSelector(state => state.treeDetails);
  console.log('=====', treeDetails);
  const {treeisLoading} = useSelector(state => state.treeisLoading);
  useEffect(() => {}, [assetLocation]);
  const fullName = assetLocation[0]?.locality
    ? assetLocation[0]?.locality?.split(' ')
    : null;
  var lastName =
    assetLocation[0]?.locality && fullName[(0, 1)] ? fullName[(0, 1)] : '';
  var firstName = assetLocation[0]?.locality ? assetLocation[0]?.locality : '';
  var nameSlice = assetLocation[0]?.locality
    ? firstName?.slice(0, 1) + lastName?.slice(0, 1)
    : '';
  console.log('nameSlice', nameSlice);
  {
    /* Shimmer loader for the flatList */
  }
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
      <Rect x="5%" y="40" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="80" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="100" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="140" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="160" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="200" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="220" rx="10" ry="10" width="40%" height="16" />
      <Rect x="5%" y="260" rx="10" ry="10" width="30%" height="16" />
      <Rect x="5%" y="280" rx="10" ry="10" width="40%" height="16" />

      <Rect x="3%" y="330" rx="0" ry="0" width="30%" height="40" />
      <Rect x="35%" y="330" rx="0" ry="0" width="30%" height="40" />
      <Rect x="67%" y="330" rx="0" ry="0" width="30%" height="40" />

      <Rect x="57%" y="20" rx="10" ry="10" width="30%" height="16" />
      <Rect x="57%" y="40" rx="10" ry="10" width="40%" height="16" />
      <Rect x="57%" y="80" rx="10" ry="10" width="30%" height="16" />
      <Rect x="57%" y="100" rx="10" ry="10" width="40%" height="16" />
      <Rect x="57%" y="140" rx="10" ry="10" width="30%" height="16" />
      <Rect x="57%" y="160" rx="10" ry="10" width="40%" height="16" />
      <Rect x="57%" y="200" rx="10" ry="10" width="30%" height="16" />
      <Rect x="57%" y="220" rx="10" ry="10" width="40%" height="16" />
      <Rect x="57%" y="260" rx="10" ry="10" width="30%" height="16" />
      <Rect x="57%" y="280" rx="10" ry="10" width="40%" height="16" />
    </ContentLoader>
  );
  {
    /* Shimmer loader for the buttons */
  }
  const ButtonLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={300}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="2%" y="20" rx="0" ry="0" width="30%" height="40" />
      <Rect x="35%" y="20" rx="0" ry="0" width="30%" height="40" />
      <Rect x="68%" y="20" rx="0" ry="0" width="30%" height="40" />
    </ContentLoader>
  );
  useEffect(() => {
    console.log('assetlocation', assetLocation);
  }, [treeDetails, assetLocation]);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {treeisLoading ? (
        <ListLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: Colors.BACKGROUND_COLOR,
            paddingBottom: 100,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.heading}>Farm</Text>
            <Text style={styles.content}>{treeDetails?.farm || 'N/A'}</Text>
            <Text style={styles.heading}>Name</Text>
            <Text style={styles.content}>{treeDetails?.name || 'N/A'}</Text>
            <Text style={styles.heading}>Assigned user</Text>
            <Text style={styles.content}>
              {treeDetails?.assigneduser || 'N/A'}
            </Text>
            <Text style={styles.heading}>Variety = (Cultivar + Variety)</Text>
            <Text style={styles.content}>
              {treeDetails?.variety === ' ' || null || undefined
                ? 'N/A'
                : treeDetails?.variety}
            </Text>
            <Text style={styles.heading}>Seed Batch</Text>
            <Text style={styles.content}>{treeDetails?.seed || 'N/A'}</Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                marginHorizontal: responsiveWidth(2),
                marginTop: responsiveHeight(0),
                // position:'absolute'
              }}>
              <Buttons
                title={`Add\nNotes`}
                textstyle={styles.buttontext}
                style={styles.button}
                onPress={() => navigation.navigate('AddNote')}
              />
              <ItemSeparatorScreen
                height={'100%'}
                width={responsiveWidth(1.5)}
              />
              <Buttons
                title={`Add\nVitals`}
                textstyle={styles.buttontext}
                style={styles.button}
                onPress={() => {
                  Globals.IF_VITALS_BUTTON_SELECTED = true;
                  navigation.navigate('NewVitalScreen');
                }}
              />
              <ItemSeparatorScreen
                height={'100%'}
                width={responsiveWidth(1.5)}
              />
              <Buttons
                title={`Add\nIncident`}
                textstyle={styles.buttontext}
                style={styles.button}
                onPress={() => {
                  Globals.IF_VITALS_BUTTON_SELECTED = false;
                  navigation.navigate('TreeEntryScreen');
                }}
              />
              <ItemSeparatorScreen
                height={'100%'}
                width={responsiveWidth(1.5)}
              />
              <Buttons
                title={`Tag\nTree`}
                textstyle={styles.buttontext}
                style={styles.button}
                onPress={() => {
                  Globals.IF_VITALS_BUTTON_SELECTED = false;
                  navigation.navigate('OtherVital', {isFromDetails: true});
                }}
              />
            </View>
            <ItemSeparatorScreen height={100} />
          </View>

          <View
            style={{
              flex: 1,
              height: responsiveHeight(53.4),
              position: 'absolute',
              left: responsiveWidth(10),
            }}>
            <Text style={styles.headingright}>Category</Text>
            <Text style={styles.contentright}>
              {treeDetails?.category || 'N/A'}
            </Text>
            <Text style={styles.headingright}>Status</Text>
            <Text style={styles.contentright}>
              {treeDetails?.status || 'N/A'}
            </Text>
            <Text style={styles.headingright}>Date of Planting</Text>
            <Text style={styles.contentright}>
              {moment(treeDetails?.dateofplanting).format('YYYY MMM DD')}
            </Text>

            <Text style={styles.headingright}>
              {assetLocation[0]?.locality || assetLocation[0]?.country
                ? 'Location'
                : null}
            </Text>
            <Text style={styles.contentright}>
              {assetLocation[0]?.locality || assetLocation[0]?.country
                ? nameSlice + ',' + assetLocation[0]?.country
                : null}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  heading: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginLeft: responsiveFontSize(2),
    marginTop: responsiveHeight(3),
  },
  content: {
    color: Colors.TEXT_HEAD,
    marginLeft: responsiveFontSize(2),
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
    marginTop: responsiveHeight(0.5),
  },
  headingright: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    marginLeft: responsiveWidth(45),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginTop: responsiveHeight(3),
  },
  contentright: {
    marginLeft: responsiveWidth(45),
    textAlign: 'left',
    color: Colors.TEXT_HEAD,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
    marginTop: responsiveHeight(0.5),
  },
  locationright: {
    color: Colors.TEXT_HEAD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.7,
    marginLeft: responsiveWidth(10),
    fontFamily: Fonts.IBM_PLEX_SANS_Light,
    marginTop: responsiveHeight(10),
  },
  locationvalueright: {
    marginLeft: responsiveWidth(10),
    color: Colors.TEXT_HEAD,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontFamily: Fonts.IBM_PLEX_SANS,
  },
  buttontext: {
    // flex:1,
    fontFamily: Fonts.IBM_PLEX_SANS_MEDIUM,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  button: {
    height: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_COLOR,
    marginTop: responsiveWidth(10),
    width: responsiveWidth(23),
    // marginLeft: responsiveHeight(3),
    // flex: 1,
    borderRadius: 2,
  },
});
