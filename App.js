import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect} from 'react';
import {RootStack} from './src/navigators';
import i18next from 'i18next';
import i18n from './src/i18n/i18n';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './src/redux/store/store';
const App = () => {
  return (
    <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <RootStack />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
