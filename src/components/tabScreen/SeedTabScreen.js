import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import {Colors, Fonts} from '../../constants';
import { DetailsTreeScreen, IncidentsTreeScreen, NotesTreeScreen, VitalsTreeScreen } from '../../screens';
import SeedDetail from '../contentScreen/SeedDetail';
import Vitals from '../contentScreen/Vitals';
import Incidents from '../contentScreen/Incidents';
import Notes from '../contentScreen/Notes';
const FirstRoute = () => (
  <SeedDetail/>
);

const SecondRoute = () => (
  <Notes/>
);

const ThirdRoute = () => (
  <Vitals/>
);
const FourthRoute = () => (
  <Incidents />
);

const renderScene = SceneMap({
  details: FirstRoute,
  notes: SecondRoute,
  vitals: ThirdRoute,
  incidents: FourthRoute,
});

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor:'transparent',height:responsiveHeight(0.2),marginLeft:responsiveHeight(1),
     }}
    pressColor={'transparent'}
    tabBarIndicatorStyle={{
      width: responsiveWidth(5),
    }}
    bounces={false}
    style={{
      backgroundColor:Colors.WHITE_COLOR,
      elevation: 0,
      height: 35,
      shadowColor: 'transparent',
      shadowOpacity: 0,
      marginTop: responsiveHeight(1),
      marginLeft:responsiveHeight(1),
      marginRight:responsiveHeight(8),

    }}
    renderLabel={({route, focused, color}) => (
      <View
        style={{
          height: 30,
          backgroundColor: 'transparent',
          borderBottomColor:focused?'green':'transparent',
          borderBottomWidth:responsiveWidth(1.5),
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            backgroundColor: 'transparent',
            borderBottomColor:focused?'green':'transparent',
            borderBottomWidth:responsiveWidth(0.4),
            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
            color: Colors.GREEN_COLOR,
            // backgroundColor: 'transparent',
            lineHeight: 18,
            letterSpacing: 0.7,
            textAlign: 'left',
            fontStyle:'normal',
            position:'absolute'
          }}>
          {route.title}
        </Text>
      </View>
    )}
    tabStyle={{
      // backgroundColor:'yellow',
      alignItems: 'flex-start',
    }}
    labelStyle={{}}
    getLabelText={({route}) => route.title}
  />
);

const SeedTabScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'details', title: 'Details'},
    {key: 'notes', title: 'Notes'},
    {key: 'vitals', title: 'Vitals'},
    {key: 'incidents', title: 'Incidents'},
  ]);
  return (
    <View
      style={{
        height: responsiveHeight(60),
        // marginHorizontal: responsiveWidth(0),
        backgroundColor:Colors.WHITE_COLOR,
      }}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

export default SeedTabScreen;

const styles = StyleSheet.create({});
