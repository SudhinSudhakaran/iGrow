/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Middle Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 17 Feb 2023
    *   * Steps: 1. Add full Image and row images
             2. Add sub headings
    */

import {StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Fonts, Colors, Globals, Images} from '../../constants';
import ItemSeparatorScreen from '../itemSeparatorScreen/ItemSeparatorScreen';

import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import Carousel from 'react-native-snap-carousel';
import {useRef} from 'react';

import {useFocusEffect} from '@react-navigation/core';

const IncidentMiddleScreen = ({
  backgroundimage,
  onpress,
  style,
  textDecorationLine,
}) => {
  const [_imageArray, set_ImageArray] = useState([]);

  const carouselRef = useRef();

  //redux States
  const {assets, incidents, assetsImagesList, incidentsImagesList} =
    useSelector(state => state.offLineDBState);

 

  const {treeisLoading} = useSelector(state => state.treeDetails);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  let prevImages = [];

  useFocusEffect(
    React.useCallback(() => {
      configImageArray();

      return undefined;
    }, [incidentPersist]),
  );

  const MainImageLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={290}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="5%" y="20" rx="0" ry="0" width="90%" height="260" />
    </ContentLoader>
  );

  const renderItem = ({item, index}) => {
    if (typeof item === 'string') {
      return <Image style={styles.image} source={{uri: `file://${item}`}} />;
    } else {
      return (
        <Image
          style={styles.image}
          source={{uri: item.uri}}
          resizeMode="cover"
        />
      );
    }
  };

  const ImageListLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={40}
      //viewBox="0 0 320 "
      backgroundColor={Colors.FLATLIST_INNER_COLOR}
      foregroundColor={Colors.SUBJECT_INPUTLINE_COLOR}
      animate={true}>
      <Rect x="0" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="16%" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="32%" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="48%" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="64%" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="80%" y="0" rx="0" ry="0" width="15%" height="50" />
      <Rect x="96%" y="0" rx="0" ry="0" width="15%" height="50" />
    </ContentLoader>
  );

  const configImageArray = () => {
    console.log(
      'Globals.SELECTED_INCIDENT_ID.isFromApi',
      Globals.SELECTED_INCIDENT_ID.isFromApi,
    );

    prevImages = [];
    let incidentImages = [];
    if (Globals.SELECTED_INCIDENT_ID.isFromApi === true) {
      if (Globals.INCIDENT_IMAGE_LIST && Globals.INCIDENT_IMAGE_LIST.length > 0) {
        prevImages = Globals.INCIDENT_IMAGE_LIST.find(obj => {
          return obj.ticketId === Globals.SELECTED_INCIDENT_ID.ticket;
        });
      }
    } else {
      incidentImages = JSON.parse(Globals?.SELECTED_IMAGE || []);
    }

    console.log(
      'Incident images====',
      incidentImages,
      prevImages?.images || [],
    );
    let allImages = [];
    allImages = [...incidentImages];
    var newImg = [];
    if (allImages.length > 0) {
      allImages.forEach(item => {
        item.isLocal = true;
        newImg.push(item);
      });
    }
    // console.log('images=====>', newImg);
    let _img = [];
    if (prevImages?.images && prevImages?.images.length > 0) {
      _img = [...newImg, ...prevImages?.images];
    } else {
      _img = [...newImg];
    }

    // console.log('images=====><', _img);
    set_ImageArray(_img);
    // dispatch(setDetailsImageList(_img));
  };

  const renderSmallStrip = ({item, index}) => {
    if (typeof item === 'string') {
      return (
        <Image
          style={{
            height: responsiveWidth(10),
            marginTop: responsiveHeight(2),
            aspectRatio: 1.1,
            resizeMode: 'cover',
          }}
          source={{uri: `file://${item}`}}
        />
      );
    } else {
      return (
        <Image
          style={{
            height: responsiveWidth(10),
            marginTop: responsiveHeight(2),
            aspectRatio: 1.1,
            resizeMode: 'cover',
          }}
          source={{uri: item.uri}}
          resizeMode="cover"
        />
      );
    }
  };
  var newImageArray = [..._imageArray];

  return (
    <>
      <View style={{backgroundColor: Colors.WHITE_COLOR}}>
        {treeisLoading === true ? (
          <MainImageLoader />
        ) : newImageArray !== undefined && newImageArray.length > 0 ? (
          <View style={{alignItems: 'center'}}>
            <Carousel
              ref={carouselRef}
              data={newImageArray}
              renderItem={renderItem}
              sliderWidth={responsiveWidth(90)}
              itemWidth={responsiveWidth(90)}
            />
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Image style={styles.image} source={Images.PLACEHOLDER_IMAGE} />
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            marginLeft: responsiveWidth(6),
            marginRight: responsiveWidth(6),
          }}>
          <ItemSeparatorScreen />
          {treeisLoading === true ? (
            <ImageListLoader />
          ) : _imageArray !== undefined && _imageArray.length > 0 ? (
            <FlatList
              horizontal
              data={_imageArray}
              renderItem={renderSmallStrip}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <ItemSeparatorScreen height={responsiveHeight(5)} />
          )}
        </View>
      </View>
      <ItemSeparatorScreen />
      {/* <TabScreen /> */}
    </>
  );
};

export default IncidentMiddleScreen;

const styles = StyleSheet.create({
  backbutton: {
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(7),
    width: responsiveScreenWidth(3),
    height: responsiveScreenHeight(2),
  },
  title: {
    position: 'absolute',
    marginLeft: responsiveWidth(13),
    marginTop: responsiveHeight(5),
    fontSize: responsiveFontSize(4),
    color: '#5A5A5A',
    fontWeight: '500',
    lineHeight: 40,
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
  },
  description: {
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    marginLeft: responsiveScreenWidth(14),
    marginRight: responsiveWidth(32),
    marginTop: responsiveHeight(0),
    width: responsiveWidth(41),
    height: responsiveWidth(4.4),
  },
  image: {
    // marginLeft: responsiveScreenWidth(15),
    // marginRight: responsiveWidth(15),
    marginTop: responsiveHeight(1),
    width: responsiveWidth(88),
    height: responsiveWidth(54),
    // alignSelf: 'center',
    // resizeMode: 'contain',
    resizeMode: 'cover',
  },

  text: {
    marginTop: responsiveHeight(2),
    color: Colors.GREEN_COLOR,
    left: responsiveHeight(2),
    // flex:1,
    // alignItems:'center',
    // justifyContent:'center',
    width: responsiveWidth(20.6),
    // marginBottom:responsiveWidth(3),
  },
  textstyle: {
    color: Colors.GREEN_COLOR,
    fontSize: responsiveFontSize(2.3),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    //  textDecorationLine:textDecoration?'underline':null,
    textDecorationColor: Colors.GREEN_COLOR,
  },
});
