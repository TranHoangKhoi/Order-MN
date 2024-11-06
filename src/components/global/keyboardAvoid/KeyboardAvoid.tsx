import React, { ReactElement, ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { height } from '~/styles';

type TProps = {
  children: ReactNode | ReactElement;
};

export const KeyboardAvoid = ({ children }: TProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={20}
          overScrollMode='never' // android
          bounces={false} // ios
        >
          <View
            style={{
              flex: 1,
              height: height,
            }}>
            {children}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
