import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Colors } from '../../constants';

let ANIMATION = require('../../assets/animations/Loading.json');
const LoadingIndicator = ({visible}) => {
        const colorFilters = [
          {
            keypath: 'icon 2',
            color: Colors.GREEN_COLOR,
          },
          {
            keypath: 'icon',
            color: Colors.GREEN_COLOR,
          },
        ];
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}>
      <View style={styles.container}>
        <LottieView
          source={ANIMATION}
          autoPlay
          loop
          colorFilters={colorFilters}
          style={{
            width: responsiveWidth(60),
          }}
        />
      </View>
    </Modal>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
//     backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

