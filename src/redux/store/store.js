import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import authenticationSlice from '../slice/authenticationSlice';
import lastSyncSlice from '../slice/lastSyncSlice';
import notificationCountSlice from '../slice/notificationCountSlice';
import notificationViewSlice from '../slice/notificationViewSlice';
import profileSlice from '../slice/profileSlice';
import reduxPersistSlice from '../slice/reduxPersistSlice';
import offLineDBPersistSlice from '../slice/offLineDBPersistSlice';
import scheduleDetailSlice from '../slice/scheduleDetailSlice';
import taskSlice from '../slice/taskSlice';
import treeDetailSlice from '../slice/treeDetailSlice';
import userSlice from '../slice/userSlice';

import {persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['assets'],
};

const rootReducer = combineReducers({
  userDetails: userSlice,
  profileData: profileSlice,
  treeDetails: treeDetailSlice,
  treeisLoading: treeDetailSlice,
  vitalsDetails:treeDetailSlice,
  imagesDetails:treeDetailSlice,
  incidentDetails:treeDetailSlice,
  noteDetails:treeDetailSlice,
  incidentIsLoading: treeDetailSlice,
  incidentIsLoadingById: treeDetailSlice,
  reportIncidentsById: treeDetailSlice,
  authorization: authenticationSlice,
  assetList:reduxPersistSlice,
  notePersist: reduxPersistSlice,
  vitalPersist: reduxPersistSlice,
  incidentPersist: reduxPersistSlice,
  detailSchedule: scheduleDetailSlice,
  notificationCount: notificationCountSlice,
  viewNotification: notificationViewSlice,
  startTask: taskSlice,
  endTask: taskSlice,
  addButton: taskSlice,
  lastSyncAt: lastSyncSlice,
  offLineDBState: offLineDBPersistSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
