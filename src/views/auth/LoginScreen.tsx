import { Alert, Image, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '~/store/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { ButtonCus, InputForm, KeyboardAvoid, TextCom } from '~/components';
import { height, itemFlex } from '~/styles';
import { LocalStorage, SchemaLogin, colors, eye, eye_slash, logo_default } from '~/utils';
import { setLogin, updateUser } from '~/store/features';
import { OneSignal } from 'react-native-onesignal';
import { authAPI } from '~/api';
import { TAppStackParamList, TError, TLogin, TUser } from '~/types';
import { settings } from '~/configs';

export const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isShowPass, setIsShowPass] = useState(false);

  const { control, handleSubmit } = useForm<TLogin>({
    mode: 'onSubmit',
    defaultValues: {
      UserName: 'testthu11',
      Password: '@@Test123',
      Type: settings.deviceOSType,
      DeviceToken: '',
      TypeName: settings.deviceOS,
      CheckBox: true,
    },
    resolver: yupResolver<any>(SchemaLogin),
  });

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await LocalStorage.getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const handleStoreUser = async (data: TUser, isFake: boolean) => {
    await LocalStorage.setIsFake(isFake);
    await LocalStorage.setUser(data);
    dispatch(setLogin(true));
    dispatch(updateUser(data));
  };

  const onSubmit = async (data: TLogin) => {
    if (!data.UserName || !data.Password) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const oneSignalId = OneSignal.User.pushSubscription.getPushSubscriptionId();
    console.log('OneSignal User ID:', oneSignalId);

    setLoading(true);
    try {
      const response = await authAPI.login({
        username: data.UserName,
        password: data.Password,
      });
      await LocalStorage.saveToken(response.data.token);
      const profile = await authAPI.profile();
      handleStoreUser({ Account: profile.data, Key: token }, false);
    } catch (error) {
      const err = error as TError;
      Alert.alert(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoid>
      <View style={Styles.loginContainer}>
        <View style={[Styles.fromTitle, { marginTop: insets.top + height / 10 }]}>
          <Image source={logo_default} resizeMode='cover' style={Styles.img} />
        </View>
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
              name='Password'
              placeholder='Nhập mật khẩu'
              icon={isShowPass ? eye : eye_slash}
              secureTextEntry={!isShowPass}
              onPressIcon={() => setIsShowPass(!isShowPass)}
              disabled={loading}
            />
            <TouchableOpacity
              onPress={() => navigate('ForgetPassword')}
              activeOpacity={0.7}
              style={Styles.forgotPassword}>
              <TextCom text='Quên mật khẩu ?'
                overrideStyle={Styles.registerText}
                type='secondary'
              />
            </TouchableOpacity>
            <ButtonCus
              name='Đăng nhập'
              buttonStyle={Styles.loginButton}
              textStyle={Styles.loginButtonText}
              isLoading={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
          <View style={Styles.regContainer}>
            <TextCom text='Bạn chưa có tài khoản?' overrideStyle={Styles.registerText} type='secondary' />
            <TouchableOpacity
              onPress={() => navigate('Register')}
              activeOpacity={0.7}>
              <TextCom text='Đăng ký ngay'
                overrideStyle={Styles.registerLink}
                type='secondary'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoid>
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
});
