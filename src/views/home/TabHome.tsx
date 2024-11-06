import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { AntDesignIcon, TextCom } from '~/components';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';

export const TabHome = [
  {
    id: 1,
    title: 'Quản lý Đơn hàng',
    icon: <AntDesignIcon
      name={"inbox"}
      style={{
        fontSize: scale(24),
        color: colors.background
      }}
    />,
  },
  {
    id: 2,
    title: 'Dang sách Kiện hàng',
    icon: <AntDesignIcon
      name={"dropbox"}
      style={{
        fontSize: scale(24),
        color: colors.background
      }}
    />,
  },
  {
    id: 3,
    title: 'Quản lý Phiếu xuất',
    icon: <AntDesignIcon
      name={"filetext1"}
      style={{
        fontSize: scale(20),
        color: colors.background
      }}
    />,
  },
  {
    id: 4,
    title: 'Thanh toán hộ',
    icon: <AntDesignIcon
      name={"creditcard"}
      style={{
        fontSize: scale(20),
        color: colors.background
      }}
    />,
  },
]

export const TabHomes = [

  {
    id: 5,
    title: 'Tracking Shop => Kho Trung',
    icon: <AntDesignIcon
      name={"swap"}
      style={{
        fontSize: scale(24),
        color: colors.background
      }}
    />,
  },
  {
    id: 6,
    title: 'Ví điện tử',
    icon: <AntDesignIcon
      name={"wallet"}
      style={{
        fontSize: scale(20),
        color: colors.background
      }}
    />,
  },
  {
    id: 7,
    title: 'Yêu cầu giao hàng',
    icon: <AntDesignIcon
      name={"bells"}
      style={{
        fontSize: scale(20),
        color: colors.background
      }}
    />,
  },
  {
    id: 8,
    title: 'Hàng không Tên',
    icon: <AntDesignIcon
      name={"search1"}
      style={{
        fontSize: scale(20),
        color: colors.background
      }}
    />,
  },
]

export const TabHomeScreen = () => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>()

  const onPress = (item: any) => {
    switch (item.id) {
      case 1:
        navigate('OrderOrder')
        break;
      case 2:
        navigate('PackingListScreen')
        break;
      case 3:
        navigate('DeliveryNoteScreen')
        break;
      case 4:
        navigate('PaymentScreen')
        break;
      case 5:
        navigate('TrackingScreen')
        break;
      case 6:
        navigate('Recharge')
        break;
      case 7:
        navigate('PackingListScreen')
        break;
      case 8:
        navigate('NoNameScreen')
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.main}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: scale(8),
          flex: 1
        }}>
        {TabHome.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              style={[styles.Item]}
              key={index.toString()}>
              <View style={styles.fromIcon}>
                {item.icon}
              </View>
              <TextCom
                text={item.title}
                overrideStyle={styles.textItem}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: scale(8),
          flex: 1
        }}>
        {TabHomes.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              style={[styles.Item, { marginBottom: 0 }]}
              key={index.toString()}>
              <View style={styles.fromIcon}>
                {item.icon}
              </View>
              <TextCom
                text={item.title}
                overrideStyle={styles.textItem}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: "24@s",
    paddingHorizontal: "12@s",
    gap: "12@s",
  },
  copyContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: "8@s",
    paddingVertical: "4@s",
    width: '100%',
    borderRadius: "4@s",
  },
  buttonMore: {
    backgroundColor: colors.primary,
    fontSize: "12@s",
    paddingHorizontal: "8@s",
    paddingVertical: "2@s",
    borderRadius: "4@s",
    color: colors.background,
  },
  text: {
    fontSize: "16@s",
    color: colors.black,
    fontWeight: '600',
  },
  Item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: "12@s",
    marginBottom: "24@s",
    flex: 1,
    height: "90@s",
  },

  fromIcon: {
    backgroundColor: colors.primary,
    borderRadius: "8@s",
    padding: "8@s",
    width: "45@s",
    height: "45@s",
    alignItems: 'center',
    justifyContent: 'center'
  },

  textItem: {
    fontSize: "12@s",
    color: colors.black,
    textAlign: 'center',
  },
});
