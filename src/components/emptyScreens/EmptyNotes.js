import { StyleSheet, Text, View,FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constants'
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { useSelector } from 'react-redux'
import ContentLoader,{Rect} from 'react-content-loader/native';
   //Shimmer loader for the flatList

const EmptyNotes = () => {
  return (
    <View style={styles.container}>
              <Text style={styles.empty}>No Notes Added</Text>
    </View>
  )
}

export default EmptyNotes

const styles = StyleSheet.create({
    container:{
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center',
      marginTop:responsiveHeight(20),
    },
    empty:{
        color:Colors.INNERTEXTINPUT_COLOR,
        fontSize:20,
    }
})