import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { TextCom } from '~/components';
import { RootState, useAppSelector } from '~/store';
import { itemFlex } from '~/styles';
import { TAppStackParamList } from '~/types';
import { bellActive, colors, eye, eye_slash, logo_default, wallet } from '~/utils';
import { _func } from '~/utils/func';

export const HeaderHome = () => {
  const inset = useSafeAreaInsets();
  const [hiddenWallet, setHiddenWallet] = useState(true);
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();
  const { Account } = useAppSelector((state: RootState) => state.user);

  return (
    <>
      <View style={[{ paddingTop: inset.top + scale(24) }, styles.main]}>
        <View style={styles.from}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('User')}
            style={styles.fromImg}>
            <Image
              source={logo_default}
              style={styles.fromIcon}
              resizeMode='cover'
            />
            <View style={{ flex: 1 }}>
              <TextCom
                text='Xin chào'
                type='primary'
                fontSize={13}
              />
              <TextCom
                text={Account?.username || 'Minh Tân LGT'}
                type='primary'
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('NoteScreen')}
            style={{ marginLeft: 14 }}>
            <Image
              source={bellActive}
              style={{ width: scale(25), height: scale(25), tintColor: colors.background }}
              resizeMode='contain'
            />
            <View style={styles.Number} />
          </TouchableOpacity>
        </View>

        <View style={styles.fromWallet}>
          <View style={styles.Row}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8
                }}>
                <Image
                  source={wallet}
                  style={{ height: scale(20), width: scale(20) }}
                  resizeMode='cover'
                  tintColor={colors.primary}
                />
                <TextCom
                  text='Ví tiền'
                  fontSize={14}
                  color={colors.black}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <View style={[itemFlex.itemRowCenter, { gap: 2 }]}>
                  <TextCom
                    text={hiddenWallet ? '**********' : _func.getVND(Account?.balance, '')}
                    fontSize={16}
                    color={colors.black}
                  />
                  <TextCom
                    text='VNĐ'
                    fontSize={16}
                    color={colors.primary}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
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

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: scale(12),
          width: "100%"
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Linking.openURL('https://vanchuyenminhtan.com/huong-dan-su-dung-vi-dien-tu-63')}
          >
            <TextCom
              type='primary'
              text='Hướng dẫn - Nạp tiền '
              fontSize={14}
              fontWeight='600'
            />
          </TouchableOpacity>
          <TextCom
            type='primary'
            text='Tỷ giá : 3,560 Đ/Y'
            fontSize={14}
            fontWeight='600'
          />
        </View>
      </View>
    </>
  );
};

const styles = ScaledSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: "24@s",
    backgroundColor: colors.primary
  },
  from: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: "16@s",
  },
  fromImg: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  fromIcon: {
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: "45@s",
    height: "45@s",
    borderRadius: 999,
    marginRight: "16@s",
    backgroundColor: colors.background,
  },
  fromWallet: {
    backgroundColor: colors.background,
    width: '100%',
    height: "45@s",
    borderRadius: "8@s",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: "16@s",
  },
  Row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Number: {
    width: "10@s",
    height: "10@s",
    backgroundColor: 'red',
    borderRadius: 999,
    left: "14@s",
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.background,
    borderWidth: 1,
    position: 'absolute',
  },
  fromCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "16@s",
    gap: "12@s",
  },
  btnCategory: {
    width: "35@s",
    height: "35@s",
    backgroundColor: colors.background,
    borderRadius: "4@s",
    marginBottom: "8@s",
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCategory: {
    fontSize: "14@s",
    color: colors.background,
    fontWeight: '600',
  },
});
