import React from 'react';
import { ColorValue, Image, ImageSourcePropType } from 'react-native';
import { imageStyle } from '~/styles';

type TProps = {
  source: ImageSourcePropType;
  iconColor?: ColorValue | undefined;
};

export const ImageCus = ({ source, iconColor = undefined }: TProps) => {
  return (
    <Image
      source={source}
      style={[imageStyle.fullContent]}
      resizeMode='contain'
      tintColor={iconColor}
    />
  );
};
