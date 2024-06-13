import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Timer = () => {
  return (
    <View
    style={{
      height: 40,
      alignSelf: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '25%',
      marginTop: 15,
    }}>
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 9,
        backgroundColor:'#898989',
      }}
    />
    <Text
      style={{
        marginTop: 2,
        fontSize: 12,
        marginLeft: 8,
        color: '#898989',
        
      }}>
       sec
    </Text>
  </View>
  )
}

export default Timer

const styles = StyleSheet.create({})