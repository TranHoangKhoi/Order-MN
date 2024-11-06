import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { errorLottie } from '~/utils';

export const ErrorLottie = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <LottieView
        source={errorLottie}
        autoPlay
        style={{
          flex: 1,
          width: '50%',
        }}
      />
    </View>
  );
};
