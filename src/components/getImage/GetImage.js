import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '../../constants';

const GetImage = ({style, uri}) => {
  let url = `http://${uri}`;
  const [isImageError, setIsImageError] = useState(false);
  //var primaryColor = Colors.PRIMARY_COLOR;

  //console.log(`GetImage received url: ${url}`);

  return (
    <FastImage
      style={style}
      resizeMode="contain"
      source={{
        uri: url,

        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }}
      onError={() => {
        //console.log(`Image Error fullName: ${fullName}`);
        setIsImageError(true);
      }}
    />
  );
};

export {GetImage};
