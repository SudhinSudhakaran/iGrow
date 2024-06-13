/* eslint-disable react/no-unstable-nested-components */
/**
    * Purpose: Create Navigation container
    * Created/Modified By: Sudhin Sudhakaran
    * Created/Modified Date: 16 Feb 2023
    * Steps: 1. Create NavigationContainer
             2. Import Screens from screen folder
    */

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../../constants';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

import {
  OtpScreen,
  ScanScreen,
  SplashScreen,
  HomePageScreen,
  EmailLoginScreen,
  DetailsScreen,
  SeedScreen,
  CarScreen,
  TreeEntryScreen,
  
  WorkSchedules,
  UserProfile,
  WithoutScanDetail,
  ScheduleDetails,
  NewVitalScreen,
  AddNote,
  TreeVital,
  OtherVital,
  WorkNewVital,
  NotificationListScreen,
  IncidentList,
  IncidentDetail,
} from '../../screens';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    success: props => {
      return props.isVisible ? (
        <BaseToast
          {...props}
          style={{borderLeftColor: Colors.GREEN_COLOR}}
          contentContainerStyle={{paddingHorizontal: 15}}
          text1Style={{
            fontSize: 12,
            marginTop: 5,
            textAlign: 'left',
          }}
          text2Style={{
            fontSize: 10,
            textAlign: 'left',
          }}
        />
      ) : null;
    },
    /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
    error: props => (
      <ErrorToast
        {...props}
        style={{borderLeftColor: 'red'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 12,
          marginTop: 5,
          textAlign: 'left',
        }}
        text2Style={{
          fontSize: 10,
          textAlign: 'left',
        }}
      />
    ),
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    info: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: '#5ED4FF', width: '90%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 12,
          marginTop: 5,
          textAlign: 'left',
        }}
        text2Style={{
          fontSize: 10,
          textAlign: 'left',
        }}
      />
    ),

    /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
    tomatoToast: ({text1, props}) => (
      <View
        style={{
          height: 50,
          width: '80%',
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', textAlign: 'left'}}>{text1}</Text>
      </View>
    ),
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
        <Stack.Screen name="EmailLoginScreen" component={EmailLoginScreen} />
        <Stack.Screen name="WorkSchedules" component={WorkSchedules} />
        <Stack.Screen name="ScheduleDetails" component={ScheduleDetails} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="SeedScreen" component={SeedScreen} />
        <Stack.Screen name="CarScreen" component={CarScreen} />
        <Stack.Screen name="TreeEntryScreen" component={TreeEntryScreen} />
        <Stack.Screen name="WithoutScanDetail" component={WithoutScanDetail} />
        <Stack.Screen name="NewVitalScreen" component={NewVitalScreen} />
        <Stack.Screen name="AddNote" component={AddNote} />
        <Stack.Screen name="TreeVital" component={TreeVital} />
        <Stack.Screen name="OtherVital" component={OtherVital} />
        <Stack.Screen name="IncidentList" component={IncidentList} />
        <Stack.Screen name="IncidentDetail" component={IncidentDetail} />
        <Stack.Screen name="WorkNewVital" component={WorkNewVital} />
        <Stack.Screen
          name="NotificationListScreen"
          component={NotificationListScreen}
        />
      </Stack.Navigator>
      <Toast setRef={Toast.setRootRef} config={toastConfig} />
    </NavigationContainer>
  );
};

export default RootStack;
