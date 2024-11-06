import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { ButtonCus, EntypoIcon, InputForm, TextCom } from '~/components';
import { height, itemFlex } from '~/styles';
import { colors, eye, eye_slash, logo_default, SchemaRegister } from '~/utils';
import { TAppStackParamList, TError, TRegister } from '~/types';
import { authAPI } from '~/api';

export const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<TAppStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);

  const { control, handleSubmit } = useForm<TRegister>({
    mode: 'onSubmit',
    defaultValues: {
      UserName: '',
      FullName: '',
      Phone: '',
      Email: '',
      Password: '',
      PasswordConfirmation: '',
      ProvinId: 1,
      Token: '',
    },
    resolver: yupResolver<any>(SchemaRegister),
  });

  const onSubmit = async (data: TRegister) => {
    if (!data.UserName || !data.Password || !data.FullName || !data.Phone || !data.Email || !data.PasswordConfirmation) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        username: data.UserName,
        fullname: data.FullName,
        phone: data.Phone,
        email: data.Email,
        password: data.Password,
        password_confirmation: data.PasswordConfirmation,
        provinId: data.ProvinId,
        token: '',
      });
      Alert.alert('Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (error) {
      const err = error as TError;
      Alert.alert(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={Styles.loginContainer}>
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
            <InputForm
              control={control}
              name='UserName'
              placeholder='Nhập Username'
              disabled={loading}
            />
            <InputForm
              control={control}
              name='FullName'
              placeholder='Nhập họ và tên'
              disabled={loading}
            />
            <InputForm
              control={control}
              name='Phone'
              placeholder='Nhập số điện thoại'
              disabled={loading}
            />
            <InputForm
              control={control}
              name='Email'
              placeholder='Nhập email'
              disabled={loading}
            />
            <InputForm
              control={control}
              name='Password'
              placeholder='Nhập mật khẩu'
              icon={isShowPass ? eye : eye_slash}
              secureTextEntry={!isShowPass}
              onPressIcon={() => setIsShowPass(!isShowPass)}
              disabled={loading}
            />
            <InputForm
              control={control}
              name='PasswordConfirmation'
              placeholder='Nhập lại mật khẩu'
              secureTextEntry={!isShowPass}
              disabled={loading}
            />
            <ButtonCus
              name='Đăng ký'
              buttonStyle={Styles.loginButton}
              textStyle={Styles.loginButtonText}
              isLoading={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
          <View style={Styles.regContainer}>
            <TextCom text='Đã có tài khoản?' overrideStyle={Styles.registerText} type='secondary' />
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <TextCom text='Đăng nhập ngay' overrideStyle={Styles.registerLink} type='secondary' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 50 }} />
      </View>
    </ScrollView>
  );
};

const Styles = ScaledSheet.create({
  loginContainer: {
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
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: scale(16),
  },
  loginButton: {
    backgroundColor: colors.primary,
    width: '100%',
  },
  loginButtonText: {
    paddingVertical: scale(6),
    color: colors.background,
    fontSize: scale(16),
  },
  regContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    fontSize: '15@s',
    marginRight: '8@s',
  },
  registerLink: {
    color: colors.primary,
    fontSize: '15@s',
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
    fontSize: "22@s",
    left: 0,
    color: colors.textPrimary,
    padding: 8,
  },
});
