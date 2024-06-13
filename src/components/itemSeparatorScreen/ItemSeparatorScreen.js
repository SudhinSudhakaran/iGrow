/**
    * Purpose: Create common item separator Component
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. Add empty view
             2. styles added
    */

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';


const ItemSeparatorScreen = ({width = 0, height = 0}) => {
  return <View style={{width: width, height: height}} />;
};

export default ItemSeparatorScreen;

const styles = StyleSheet.create({});
