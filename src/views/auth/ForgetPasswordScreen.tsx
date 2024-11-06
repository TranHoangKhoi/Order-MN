import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { ButtonCus, EntypoIcon, InputForm, KeyboardAvoid } from '~/components';
import { height, itemFlex } from '~/styles';
import { SchemaForgotPassword, SchemaResetPassword, colors, logo_default } from '~/utils';
import { authAPI } from '~/api';
import { TAppStackParamList, TError, TForgotPassword, TResetPassword } from '~/types';

export const ForgetPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<TAppStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');

  const { control, handleSubmit } = useForm<TForgotPassword | TResetPassword>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      token: '',
      password: '',
      password_confirmation: '',
    },
    resolver: yupResolver<any>(isReset ? SchemaResetPassword : SchemaForgotPassword),
  });

  const handleForgotPassword = async (data: TForgotPassword) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: data.email });
      Alert.alert('Vui lòng kiểm tra email để nhận mã xác thực.');
      setEmail(data.email);
      setIsReset(true);
    } catch (error) {
      // console.log(error);

      const err = error as TError;
      Alert.alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: TResetPassword) => {
    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email: email,
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      Alert.alert('Đặt lại mật khẩu thành công!');
      navigation.navigate('Login');
    } catch (error) {
      const err = error as TError;
      Alert.alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoid>
      <ScrollView contentContainerStyle={Styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={Styles.container}>
          <View style={[Styles.fromTitle, { marginTop: insets.top + height / 10 }]}>
            <Image source={logo_default} resizeMode='cover' style={Styles.img} />
          </View>
          <TouchableOpacity
            style={[Styles.backButton, { top: insets.top + 10, }]}
            onPress={() => navigation.goBack()}
          >
            <EntypoIcon name="chevron-thin-left" style={Styles.headerIcon} />
          </TouchableOpacity>
          <View style={[Styles.formControl, itemFlex.itemEvenly]}>
            <View style={[Styles.inputsContainer, itemFlex.itemCenter]}>
              {!isReset ? (
                <>
                  <InputForm
                    control={control}
                    name='email'
                    placeholder='Nhập email'
                    disabled={loading}
                  />
                  <ButtonCus
                    name='Gửi mã xác thực'
                    buttonStyle={Styles.button}
                    textStyle={Styles.buttonText}
                    isLoading={loading}
                    onPress={handleSubmit(handleForgotPassword)}
                  />
                </>
              ) : (
                <>
                  <InputForm
                    control={control}
                    name='token'
                    placeholder='Nhập mã xác thực'
                    disabled={loading}
                  />
                  <InputForm
                    control={control}
                    name='password'
                    placeholder='Nhập mật khẩu mới'
                    secureTextEntry
                    disabled={loading}
                  />
                  <InputForm
                    control={control}
                    name='password_confirmation'
                    placeholder='Nhập lại mật khẩu mới'
                    secureTextEntry
                    disabled={loading}
                  />
                  <ButtonCus
                    name='Đặt lại mật khẩu'
                    buttonStyle={Styles.button}
                    textStyle={Styles.buttonText}
                    isLoading={loading}
                    onPress={handleSubmit(handleResetPassword)}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoid>
  );
};

const Styles = ScaledSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  fromTitle: {
    width: '100%',
    paddingHorizontal: '40@s',
    marginBottom: '30@s',
    alignItems: 'center',
  },
  formControl: {
    width: '100%',
  },
  inputsContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    paddingVertical: scale(6),
    color: colors.background,
    fontSize: scale(16),
    textAlign: 'center',
  },
  img: {
    width: '350@s',
    height: '100@s',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
  },
  headerIcon: {
    fontSize: '22@s',
    left: 0,
    color: colors.textPrimary,
    padding: 8,
  },
});