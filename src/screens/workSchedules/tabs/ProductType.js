import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constants';
import {
  responsiveScreenWidth,
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';

const DATA = [
  {
    id: '1',
    productType: 'Insecticide',
    product: 'SNT Hybric Frass',
  },
  {
    id: '2',
    productType: 'Insecticide',
    product: 'SNT Hybric Frass',
  },
];

const ProductType = () => {
  const {detailSchedule} = useSelector(state => state.detailSchedule);

  const Item = ({item}) => {
    console.log('item==', item);
    return (
      <View style={{flex: 1, marginTop: responsiveHeight(2)}}>
      
      <Text style={styles.titleText}>Product :</Text>
        <Text style={styles.valueText}>{item.product}</Text>

        <View style={{flexDirection:'row',marginTop:responsiveHeight(2)}}>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Product Type :</Text>
        <Text style={styles.valueText}>{item.producttype}</Text>
        </View>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Dosage Type :</Text>
        <Text style={styles.valueText}>{item.dosagetype}</Text>
        </View>
        </View>
       
        
        <View style={{flexDirection:'row',marginTop:responsiveHeight(1)}}>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Dosage Metric :</Text>
        <Text style={styles.valueText}>{item.dosagemetric||0}</Text>
        </View>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Dosage Unit :</Text>
        <Text style={styles.valueText }>{item.dosageunit}</Text>
        </View>
        </View>
        
      
    
        
        <View style={{flexDirection:'row', marginTop:responsiveHeight(1)}}>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Mixing Medium :</Text>
        <Text style={styles.valueText}>{item.mixingmedium}</Text>
        </View>
        <View style={{flex:1}}>
        <Text  style={styles.titleText}>Mixing Base Metric :</Text>
        <Text style={styles.valueText}>{item.mixingbasemetric||0}</Text>
        </View>
        </View>
       
       
       
        <View style={{marginTop:responsiveHeight(1)}}>
        <Text  style={styles.titleText}>Mixing Medium Unit :</Text>
        </View>
        <Text style={styles.valueText}>{item.mixingmediumunit}</Text>
      </View>
    );
  };
  return (
    <View
      style={{
        marginHorizontal: responsiveScreenWidth(5),
        flexDirection: 'column',
      }}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: responsiveFontSize(2.5),
            fontFamily: Fonts.IBM_PLEX_SANS_SEMIBOLD,
            color: Colors.ROUND_COLOR,
            letterSpacing: 0.7,
          }}>
          {'Chemicals'}
        </Text>
      </View>
      <View style={{marginTop: responsiveHeight(0)}}>
        <FlatList
          scrollEnabled={false}
          data={detailSchedule?.chemicals}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
          // ListEmptyComponent={() => emptyComponent()}
        />
      </View>

      {/* <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Foliar'}</Text>
            <Text style={styles.valueText}></Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Foliar'}</Text>
            <Text style={styles.valueText}></Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Insecticide'}</Text>
            <Text style={styles.valueText}></Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Fungicide'}</Text>
            <Text style={styles.valueText}></Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.titleText}>{'Fungicide'}</Text>
            <Text style={styles.valueText}></Text>
          </View> */}
    </View>
  );
};

export default ProductType;

const styles = StyleSheet.create({
  titleText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.IBM_PLEX_SANS_BOLD,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
  },
  valueText: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
    color: Colors.SCHEDULE_TEXT,
    letterSpacing: 0.7,
    marginTop:responsiveHeight(.3),
    marginLeft:responsiveHeight(0)
  },
  flatListBox: {
    width: responsiveWidth(85),
    height: responsiveHeight(5),
    borderWidth: 0.4,
    borderRadius: 2,
    borderColor: Colors.LIGHT_GREY_COLOR,
    marginLeft: responsiveHeight(0.5),
    backgroundColor: Colors.RED_SHADE_COLOR,
    // flexDirection:'row',
    justifyContent: 'space-evenly',
  },


});
