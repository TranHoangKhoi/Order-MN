import { Alert, Image, ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import { useAppSelector } from '~/store/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { ButtonCus, InputForm } from '~/components';
import { itemFlex, } from '~/styles';
import { SchemaUserProfile, colors, logo_default } from '~/utils';
import { authAPI } from '~/api';
import { TError, TUserProfile, TUpdatePassword } from '~/types';
import { RootState } from '~/store';
import { DefaultLayout } from '~/layout';

type TFormInput = TUserProfile & TUpdatePassword;

export const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const { Account } = useAppSelector((state: RootState) => state.user);

  const { control, handleSubmit, setValue } = useForm<TFormInput>({
    mode: 'onSubmit',
    defaultValues: {
      fullname: Account.fullname || '',
      phone: Account.phone || '',
      email: Account.email || '',
      address: Account.address || '',
      old_password: '',
      password: '',
      password_confirmation: '',
    },
    resolver: yupResolver<any>(SchemaUserProfile),
  });

  const handleUpdate = async (data: TFormInput) => {
    setLoading(true);
    try {
      if (data.old_password && data.password && data.password_confirmation) {
        await authAPI.updatePassword({
          old_password: data.old_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });
        Alert.alert('Cập nhật mật khẩu thành công!');
      } else {
        await authAPI.updateProfile({
          fullname: data.fullname,
          phone: data.phone,
          email: data.email,
          address: data.address,
        });
        Alert.alert('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      const err = error as TError;
      Alert.alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout
      isShowBottomTab={false}
      screenTitle='Cập nhập thông tin cá nhân'
    >
      <ScrollView
        contentContainerStyle={Styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={Styles.container}>
          <View style={[Styles.fromTitle]}>
            <Image
              source={logo_default}
              resizeMode='cover'
              style={[Styles.img]}
            />
          </View>
          <View style={[Styles.formControl, itemFlex.itemEvenly]}>
            <View style={[Styles.inputsContainer, itemFlex.itemCenter]}>
              <InputForm
                control={control}
                name='fullname'
                placeholder='Nhập họ và tên'
                disabled={loading}
              />
              <InputForm
                control={control}
                name='phone'
                placeholder='Nhập số điện thoại'
                disabled={loading}
              />
              <InputForm
                control={control}
                name='email'
                placeholder='Nhập email'
                disabled={loading}
              />
              <InputForm
                control={control}
                name='address'
                placeholder='Nhập địa chỉ'
                disabled={loading}
              />
              <InputForm
                control={control}
                name='old_password'
                placeholder='Nhập mật khẩu cũ'
                secureTextEntry
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
                name='Cập nhật'
                buttonStyle={Styles.button}
                textStyle={Styles.buttonText}
                isLoading={loading}
                onPress={handleSubmit(handleUpdate)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </DefaultLayout>
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

  formControl: {
    width: '100%',
  },
  inputsContainer: {
    width: '100%',
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
  fromTitle: {
    paddingHorizontal: '40@s',
    marginBottom: '30@s',
    alignItems: 'center',
    width: '125@s',
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: "#c0c0c0",
    backgroundColor: colors.background
  },
  img: {
    width: '125@s',
    height: '125@s',
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