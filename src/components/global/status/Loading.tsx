import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import { colors, loading } from '~/utils';
import { TextCom } from '../texts/TextCom';
import { scale } from 'react-native-size-matters';

type TProps = {
  title?: string;
};

export const LoadingLottie = ({ title = '' }: TProps) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <LottieView
        source={loading}
        autoPlay
        style={{
          height: scale(80),
          width: scale(80),
        }}
      />
      {title && (
        <TextCom
          text={title}
          overrideStyle={{ color: colors.primary, fontSize: scale(16) }}
        />
      )}
    </View>
  );
};
