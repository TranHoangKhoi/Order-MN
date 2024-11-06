import React from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { colors, hourglass } from '~/utils';
import { TextCom } from '../texts/TextCom';

type TNullPage = {
  text?: string;
  back?: boolean;
  showText?: boolean;
};

export const NullPageScreen = ({ text, back }: TNullPage) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.main, { marginTop: insets.top + scale(30) }]}>
      <Image
        source={hourglass}
        style={{ width: scale(40), height: scale(40), tintColor: colors.primary, left: -5 }}
        resizeMode='contain'
      />
      <View style={{ paddingVertical: scale(16), alignItems: 'center' }}>
        <TextCom
          text={'Opps...'}
          color={colors.primary}
          fontSize={16}
          fontWeight='600'
        />
        <TextCom
          text={'Không tìm thấy kết quả'}
          color={colors.primary}
          fontSize={16}
          fontWeight='600'
        />
        <TextCom
          text={text}
          color={colors.textPrimary}
          fontSize={14}
          fontWeight='400'
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    lineHeight: 30,
  },
  textNone: {
    fontSize: 14,
    marginTop: 8,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 12,
    paddingHorizontal: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBtn: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    fontWeight: '500',
  },
});
