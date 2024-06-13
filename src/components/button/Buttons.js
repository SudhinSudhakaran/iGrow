import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import { Colors } from '../../constants';

const Buttons = ({title, onPress, style,textstyle}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: responsiveWidth(50),
          height: responsiveWidth(15),
        //  backgroundColor:Colors.BUTTON_BACKGROUND_COLOR,
          borderRadius:responsiveWidth(1),
          alignItems:'center',
          justifyContent:'center'
        },
        style,
      ]}>
      <Text style={[{color:Colors.BUTTON_TEXT_COLOR},textstyle]}>{title || ''}</Text>
    </TouchableOpacity>
  );
};

export default Buttons;

const styles = StyleSheet.create({});
