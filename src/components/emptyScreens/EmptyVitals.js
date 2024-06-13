import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants'
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { useSelector } from 'react-redux'

const EmptyVitals = () => {
     //redux States
     const {treeDetails}=useSelector(state=>state.treeDetails);
  return (
    <View style={styles.container}>
      <Text style={styles.empty}>No Vitals Added</Text>
    </View>
  )
}

export default EmptyVitals

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