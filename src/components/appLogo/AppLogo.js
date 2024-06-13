import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import {Colors, Fonts, Images} from '../../constants'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
  } from 'react-native-responsive-dimensions'

const AppLogo = () => {

  return (
    <View style={styles.container}>
      <Image source={Images.APP_LOGO}/>
      <Text style={{
        fontFamily:Fonts.UBUNTU_REGULAR,
        color:Colors.LOGOTEXT_COLOR,
        textAlign:'center',
        fontSize:responsiveFontSize(4)
      }}>
        igrow
      </Text>
    </View>
  )
}

export default AppLogo;

const styles = StyleSheet.create({
})