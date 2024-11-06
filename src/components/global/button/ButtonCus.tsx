import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { itemFlex, shadowStyle } from '~/styles';
import { colors } from '~/utils';
import { ImageCus } from '../image';
import { TextCom } from '../texts/TextCom';

interface TButtonCus {
  name: string;
  icon?: ImageSourcePropType;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  isLoading?: boolean;
  disabled?: boolean;
  iconColor?: ColorValue | undefined;
}

export const ButtonCus = ({
  name,
  icon,
  iconStyle,
  textStyle,
  onPress,
  buttonStyle,
  isLoading = false,
  disabled = false,
  iconColor = undefined,
}: TButtonCus) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        buttonStyle,
        disabled ? styles.disabled : null,
        itemFlex.itemRowCenter,
        shadowStyle.black,
      ]}
      onPress={() => onPress()}
      disabled={disabled || isLoading}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {icon && (
          <View style={[{ width: scale(20), height: scale(20) }, iconStyle]}>
            <ImageCus iconColor={iconColor} source={icon} />
          </View>
        )}

        <TextCom
          text={name}
          overrideStyle={[styles.text, textStyle]}
        />
        {isLoading && <ActivityIndicator size='small' color={'#fff'} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    padding: "10@s",
    borderRadius: "5@s",
    width: '100%',
    marginVertical: "16@s",
  },
  text: {
    color: colors.textPrimary,
    fontSize: "16@s",
    textAlign: 'center',
    marginRight: "8@s",
  },
  disabled: {
    opacity: 0.4,
  },
});
