import {StyleSheet, Text, View,TouchableOpacity,TextInput,I18nManager,Image} from 'react-native';
import React from 'react';
import {Colors, Translations, Fonts, Images} from '../../../constants';
import {t} from 'i18next';
import InputScrollView from 'react-native-input-scroll-view';
const SearchBox = props => (
  <View
    style={{
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      height: 40,
      justifyContent: 'center',
      //Shadow props
      borderWidth: 0.1,
      borderColor: Colors.FLATLIST_BORDER_COLOR,
      backgroundColor: Colors.WHITE_COLOR,
      shadowColor: Colors.SHADOW_COLOR,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 8,
    //   backgroundColor: 'red',
    }}>
    <TextInput
      style={{
        marginLeft: 16,
        marginRight: 50,
        color:Colors.TEXT_HEAD
      }}
      editable
      placeholderTextColor={Colors.INNERTEXTINPUT_COLOR}
      placeholder={t(Translations.SEARCH)}
      onChangeText={text => props.searchFilterFunction(text.trimStart())}
      onClear={text => props.searchFilterFunction('')}
      value={props.search}
    />
    {props.search !== '' ? (
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: Colors.WHITE_COLOR,
          position: 'absolute',
          right: 45,
        }}
        onPress={() => props?.closeButtonAction()}>
        <Image
          style={{
            width: 20,
            height: 20,
            transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
          }}
          source={Images.CROSS_BUTTON_ICON}
        />
      </TouchableOpacity>
    ) : null}
    <TouchableOpacity
      style={{
        position: 'absolute',
        right: 8,
        justifyContent: 'center',
        backgroundColor:Colors.SEARCH_BOX_COLOR,
        height: 31,
        width: 31,
        borderRadius: 4,
      }}>
      <Image
        style={{
          width: 16,
          height: 16,
          resizeMode: 'contain',
          tintColor:'blue',
          alignSelf: 'center',
          transform: [
            {
              scaleX: I18nManager.isRTL ? -1 : 1,
            },
          ],
        }}
        source={Images.SEARCH_ICON}
      />
    </TouchableOpacity>
  </View>
);

export default SearchBox;

const styles = StyleSheet.create({});
