/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Middle Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 17 Feb 2023
    *   * Steps: 1. Add full Image and row images
             2. Add sub headings
    */

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Fonts, Images, Colors, Globals} from '../../constants';
import ItemSeparatorScreen from '../itemSeparatorScreen/ItemSeparatorScreen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Buttons from '../button/Buttons';
import {useNavigation} from '@react-navigation/core';
import TabScreen from '../tabScreen/TabScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

import {GetImage} from '../getImage/GetImage';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import Carousel from 'react-native-snap-carousel';
import {useRef} from 'react';

import {useFocusEffect} from '@react-navigation/core';
import {useDispatch} from 'react-redux';
import {setDetailsImageList, setimagesDetails} from '../../redux/slice/treeDetailSlice';
import { openDatabase } from 'react-native-sqlite-storage';
import { addIncidentsImagesList } from '../../redux/slice/offLineDBPersistSlice';

const db = openDatabase({
  name: 'AddTree',
});
const MiddleScreen = ({
  backgroundimage,
  onpress,
  style,
  textDecorationLine,
}) => {
  const carouselRef = useRef();
  let prevImages = [];
  const dispatch = useDispatch();
  //redux States
  const {treeDetails, treeisLoading, detailsImageList, isFormAddVitals} =
    useSelector(state => state.treeDetails);
    const {imagesDetails} = useSelector(state => state.imagesDetails);

  const {assets, assetsImagesList, incidentsImagesList} = useSelector(
    state => state.offLineDBState,
  );

  const {notePersist} = useSelector(state => state.notePersist);
  const {vitalPersist} = useSelector(state => state.vitalPersist);
  const {incidentPersist} = useSelector(state => state.incidentPersist);
  const [incidentsArray, setIncidentsArray] = useState([]);
  const {incidentDetails} = useSelector(state => state.incidentDetails);
  const [_imageArray, set_ImageArray] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
    listincidentImages();
    },[incidentPersist, vitalPersist])
  )
  useFocusEffect(
    React.useCallback(() => {
      // if(vitalPersist?.length>0||incidentPersist?.length>0||detailsImageList?.length>0||imagesDetails?.length>0){
      // configImageArray();
      // }
      console.log('imagedetails',imagesDetails,incidentsImagesList);
      return undefined;
    }, []),
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
      return (
        <Image
          style={styles.image}
          source={{uri: `file://${item}`}}
          resizeMode="cover"
        />
      );
    }
    else {
      return (
        <>
        {!item?.uri ?
        <Image
        // style={{
        //   // marginTop: responsiveHeight(10),
        //   // aspectRatio: 1.1,
        // }}
        style={styles.image}
        resizeMode= "cover"
          source={{   uri:item?.images
            ? 'http://' + item.images
            : `file://${item?.url}`}}
        />
       : <Image
        style={
          styles.image
        }
        source={{uri:item?.uri}}
        resizeMode="cover"
      />
      }
      </>
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
  const listincidentImages = () => {
    let sql = "SELECT DISTINCT * FROM incidentimages";
    db.transaction((tx) => {
        tx.executeSql(sql, [], (tx, resultSet) => {
            var length = resultSet.rows.length;
            var newIncidentImageArray=[];
            for (var i = 0; i < length; i++) {
                incidentDetails?.map((item)=>{
                  if(item.id===resultSet?.rows?.item(i).ticketId){
                    newIncidentImageArray.push(resultSet?.rows?.item(i))
                  }
                })
            }
            console.log('function calll????????')
            dispatch(addIncidentsImagesList([...newIncidentImageArray]));
            configImageArray([...newIncidentImageArray]);
          }, (error) => {
            console.log("List incident images error", error);
        })
    })
}
  const configImageArray = (_incidentArray) => {
    // console.log('assetsImagesList ===', assetsImagesList);
    prevImages = [];
    let vitalsImages = [];
    const _vitalsImages = vitalPersist;
    _vitalsImages?.forEach(obj => {
      if (obj?.vitalAsset_id === treeDetails?.assetid) {
        let images = JSON.parse(obj?.images);
        vitalsImages?.push(...images);
      }
    });

    let incidentImages = [];
    const _incidentImages = incidentPersist;
    _incidentImages?.forEach(obj => {
      if (obj?.assetId === treeDetails?.assetid) {
        let images = JSON.parse(obj?.images);
        incidentImages?.push(...images);
      }
    });
    // console.log(
    //   'vitallistimages==================',
    //   vitalsImages,
    //   'incidentImages',
    //   incidentImages,
    // );
    let allImages = [];
    if (isFormAddVitals === true) {
      allImages = [...vitalsImages,...incidentImages,];
    } else {
      allImages = [...incidentImages];
    }

    //treeDetails?.images
    var newImg = [];
    console.log('allimages',allImages);

    if (allImages?.length > 0) {
      allImages?.forEach(item => {
        item.isLocal = true;
        newImg?.push(item);
      });
    }
    dispatch(setDetailsImageList([..._incidentArray]));

     if(incidentPersist?.length>0||vitalPersist?.length>0){
      dispatch(setDetailsImageList([...newImg]));
      if(imagesDetails!==null||imagesDetails?.length>0&&newImg?.length>0){
        dispatch(setDetailsImageList([...newImg,...imagesDetails]));
      }
      if(imagesDetails!==null||imagesDetails?.length>0&&newImg?.length>0&&_incidentArray?.length>0){
        dispatch(setDetailsImageList([...newImg,...imagesDetails,..._incidentArray]));
      }
      if(imagesDetails?.length>0&&_incidentArray?.length>0){
        dispatch(setDetailsImageList([...newImg,...imagesDetails,..._incidentArray]));
      }
    }
    else if(_incidentArray?.length>0){
    dispatch(setDetailsImageList([...imagesDetails,..._incidentArray]));
    console.log('configImageArrayelseif called', detailsImageList);
  }
  else{
    if(imagesDetails!==null||imagesDetails.length>0){
      dispatch(setDetailsImageList([...imagesDetails]));
    }
  }
  };
  const renderSmallStrip = ({item, index}) => {
    // console.log('3333',item,`http://{item?.url}`)
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
          resizeMode="cover"
        />
      );
    } else {
      return (
        <>
        {!item?.uri ?
        <Image
          style={{
            height: responsiveWidth(10),
            marginTop: responsiveHeight(2),
            aspectRatio: 1.1,
            resizeMode: 'cover',
          }}
          source={{   uri:item?.images
            ? 'http://' + item?.images
            : `file://${item?.url}`}}
            />
       : <Image
        style={{
          height: responsiveWidth(10),
          marginTop: responsiveHeight(2),
          aspectRatio: 1.1,
          resizeMode: 'cover',
        }}
        source={{uri:item?.uri}}
        resizeMode="cover"
      />
        }
        </>
      );
    }
  };

  const CarouselEmptyComponent = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image style={styles.image} source={Images.PLACEHOLDER_IMAGE} />
      </View>
    );
  };
  return (
    <>
      <View style={{backgroundColor: Colors.WHITE_COLOR}}>
        {treeisLoading === true ? (
          <MainImageLoader />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Carousel
              ref={carouselRef}
              data={detailsImageList || []}
              // data={prevImages.images}
              renderItem={renderItem}
              sliderWidth={responsiveWidth(90)}
              itemWidth={responsiveWidth(90)}
              ListEmptyComponent={treeisLoading ? null : CarouselEmptyComponent}
            />
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
          ) : detailsImageList !== undefined && detailsImageList?.length > 0 && detailsImageList !== null ? (
            <FlatList
              horizontal
              data={detailsImageList || []}
              renderItem={renderSmallStrip}
              keyExtractor={(item, index) => index.toString()}
            />
          ) 
         : (
            <ItemSeparatorScreen height={responsiveHeight(5)} />
          )}
        </View>
      </View>
      <ItemSeparatorScreen />
      <TabScreen />
    </>
  );
};

export default MiddleScreen;

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
    height: responsiveHeight(30),
    // alignSelf: 'center',
    // resizeMode: 'contain',
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
