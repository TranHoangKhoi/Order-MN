import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { DefaultLayout } from '~/layout'
import { TextCom } from '~/components'
import { _func, colors, eye, eye_slash, LocalStorage, logo_default, logout, nameTag, policy, priceTag, support, video, wallet, withdraw } from '~/utils'
import { logOutUser, RootState, setLogin, useAppDispatch, useAppSelector } from '~/store'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { itemFlex } from '~/styles'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { TAppStackParamList } from '~/types'

const dataListFake = [
  {
    key: 1,
    text: 'Hỗ trợ ngay',
    icon: support,
    color: colors.black,
  },
  {
    key: 2,
    text: 'Hướng dẫn sử dụng',
    icon: video,
    color: colors.black,
  },
  {
    key: 3,
    text: 'Giới thiệu về vận chuyển MINH TÂN',
    icon: nameTag,
    color: colors.black,
  },
  {
    key: 4,
    text: 'Quy định, chính sách',
    icon: policy,
    color: colors.black,
  },
  {
    key: 5,
    text: 'Bảng giá phí vận chuyển',
    icon: priceTag,
    color: colors.black,
  },
  {
    key: 6,
    text: 'Khiếu nại',
    icon: withdraw,
    color: colors.black,
  },
  {
    key: 7,
    text: 'Đăng xuất',
    icon: logout,
    color: colors.danger,
  },
];

export const UserScreen = () => {
  const dispatch = useAppDispatch();
  const { Account } = useAppSelector((state: RootState) => state.user);
  const [hiddenWallet, setHiddenWallet] = useState(true);
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();

  const onSubmit = (item: number) => {
    switch (item) {
      case 1:
        Linking.openURL(`tel:${'0834566952'}`);
        break;
      case 2:
        Linking.openURL(`https://vanchuyenminhtan.com/huong-dan-dat-hang-taobao-1688-tmall-68`);
        break;
      case 3:
        Linking.openURL(`https://vanchuyenminhtan.com/`);
        break;
      case 4:
        Linking.openURL(`https://vanchuyenminhtan.com/chinh-sach`);
        break;
      case 5:
        Linking.openURL(`https://vanchuyenminhtan.com/bang-gia-nhap-hang-56`);
        break;
      case 6:
        navigate('ComplaintScreen');
        break;
      case 7:
        Logout();
        break;
      default:
        break;
    }
  };

  const Logout = () => {
    LocalStorage.logout();
    dispatch(logOutUser());
    dispatch(setLogin(false));
  };

  return (
    <DefaultLayout
      containerOverrideStyle={styles.contanier}
    >
      <View style={[styles.main]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigate('UserProfile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingVertical: scale(12),
            gap: scale(12),
          }}>

          <Image
            source={logo_default}
            style={styles.img}
            resizeMode='cover'
          />

          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              flex: 1,
            }}>
            <TextCom
              text={Account?.username || "Minh Tân LGT"}
              type='primary'
              fontSize={20}
              fontWeight='600'
            />
            <View style={{ flexDirection: "row", alignItems: 'center', gap: 5, justifyContent: 'center' }}>
              <View style={{
                width: scale(10),
                height: scale(10),
                backgroundColor: "green",
                borderRadius: 9999
              }} />
              <TextCom
                text={'Online'}
                type='primary'
                fontSize={14}
                fontWeight='600'
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.fromWallet}>
          <View style={styles.Row}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: scale(4)
                }}>
                <Image
                  source={wallet}
                  style={{ height: scale(20), width: scale(20) }}
                  resizeMode='cover'
                  tintColor={colors.primary}
                />
                <TextCom
                  text={' Ví tiền'}
                  type='secondary'
                  fontSize={14}
                  fontWeight='600'
                />
              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <View style={[itemFlex.itemRowCenter, { gap: 2 }]}>
                  <TextCom
                    text={hiddenWallet ? '**********' : _func.getVND(Account?.balance, '')}
                    type='secondary'
                    fontSize={14}
                    fontWeight='600'
                  />
                  <TextCom
                    text='VNĐ'
                    fontSize={16}
                    fontWeight='600'
                    color={colors.primary}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setHiddenWallet(!hiddenWallet)}>
                  <Image
                    source={!hiddenWallet ? eye : eye_slash}
                    style={{ height: scale(20), width: scale(20) }}
                    tintColor={colors.primary}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: scale(100) }}>
        <View style={{ paddingHorizontal: scale(16) }}>
          {dataListFake.map((item) => {
            return (
              <View key={item.key}>
                <TouchableOpacity
                  style={[
                    styles.item,
                    { borderBottomWidth: item?.key === 9 ? 0 : 1 },
                  ]}
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={() => onSubmit(item.key)}>
                  <Image
                    source={item.icon}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      tintColor: colors.black,
                      marginRight: scale(16),
                    }}
                    resizeMode='contain'
                    tintColor={item.color}
                  />
                  <TextCom
                    text={item.text}
                    color={item.color}
                    type='primary'
                    fontWeight='600'
                    fontSize={14}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ height: scale(50) }} />
      </ScrollView>
    </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  contanier: {
    margin: 0,
    padding: 0
  },
  main: {
    alignItems: 'center',
    padding: "16@s",
    backgroundColor: colors.primary,
  },
  img: {
    width: "80@s",
    height: "80@s",
    borderRadius: 999,
  },

  fromWallet: {
    backgroundColor: colors.background,
    width: '100%',
    height: "45@s",
    borderRadius: "5@s",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: "16@s",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    shadowColor: '#333',
  },
  Row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    marginTop: "16@s",
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.1)',
    paddingBottom: "16@s",
  },
});