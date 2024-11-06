import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '~/utils';

interface ITextCom {
  text: string;
  type?: 'primary' | 'secondary';
  color?: string;
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800';
  fontSize?: number;
  overrideStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export const TextCom = ({
  text,
  color,
  type = 'primary',
  fontWeight = "400",
  fontSize = 16,
  overrideStyle,
  numberOfLines,
}: ITextCom) => {
  const textColor = type === 'primary' ? colors.background : type === 'secondary' ? colors.textSecondary : 'black';

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ color: color ? color : textColor, fontSize: scale(fontSize), fontWeight }, overrideStyle]}>
      {text}
    </Text>
  );
};
