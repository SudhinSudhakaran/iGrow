import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Globals} from '../../../constants';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';

const Assets = ({type, asset}) => {
  const {detailSchedule} = useSelector(state => state.detailSchedule);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    console.log('detailSchedule', detailSchedule);

    return () => {};
  }, []);

  return (
    <View
      style={{
        marginHorizontal: responsiveScreenWidth(5),
        flexDirection: 'column',
      }}>
      <View style={{flex: 1, marginTop: 5}}>
        <Text
          style={{
            fontSize: responsiveFontSize(2.5),
            fontFamily: Fonts.IBM_PLEX_SANS_SEMIBOLD,
            color: Colors.ROUND_COLOR,
            letterSpacing: 0.7,
          }}>
          {'Assets'}
        </Text>
        <Text style={styles.valueText}>{asset}</Text>
      </View>
      <View style={{marginBottom: 15, marginTop: 25}}>
        <Text style={styles.titleText}>{'Type'}</Text>
        <Text style={[styles.valueText, {textTransform: 'capitalize'}]}>
          {type}
        </Text>
      </View>
      {/* <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Division -  Block name'}</Text>
            <Text style={styles.valueText}></Text>
          </View> */}
    </View>
  );
};

export default Assets;

const styles = StyleSheet.create({
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
});
