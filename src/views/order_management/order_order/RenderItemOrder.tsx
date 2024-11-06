import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';

export const StatusType = {
  WAITING_DEPOSIT: 1,
  PLACING_ORDER: 2,
  ORDERED: 3,
  SHOP_DELIVERING: 4,
  CANCELED: 5,
  RETURNED: 6,
  WAITING_QUOTE: 7,
  SHIPPING: 8,
  WAREHOUSE_RECEIVED: 9,
  SHIPPING_TO_DESTINATION: 10,
  DEPOSITED: 11,
};

const statusTexts = {
  [StatusType.WAITING_DEPOSIT]: "Chờ đặt cọc",
  [StatusType.PLACING_ORDER]: "Đang đặt hàng",
  [StatusType.ORDERED]: "Đã đặt hàng",
  [StatusType.SHOP_DELIVERING]: "Shop xưởng giao",
  [StatusType.CANCELED]: "Đã hủy",
  [StatusType.RETURNED]: "Đã trả hàng",
  [StatusType.WAITING_QUOTE]: "Chờ báo giá",
  [StatusType.SHIPPING]: "Đang vận chuyển",
  [StatusType.WAREHOUSE_RECEIVED]: "Kho VN nhận",
  [StatusType.SHIPPING_TO_DESTINATION]: "Đang vận chuyển kho đích",
  [StatusType.DEPOSITED]: "Đã đặt cọc",
  default: "Unknown Status",
};

interface Item {
  image: string;
  province_name: string;
  status: keyof typeof StatusType;
  paymentDate: string;
}

interface RenderItemProps {
  item: Item | any;
}

export const RenderItemOrder = React.memo(({ item }: RenderItemProps) => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();

  const getStatusText = (type: keyof typeof StatusType): string => {
    return statusTexts[type] || statusTexts.default;
  };

  return (
    <TouchableOpacity onPress={() => navigate('OrderDetail', { id: item.orderID })}
      style={styles.container}>
      <View style={styles.productContainer}>
        <Image source={{ uri: _func.addDomainToImage(item.image) }} style={styles.image} />
        <View style={styles.productDetails}>
          <Text style={styles.title}>
            Kho đích: {item.province_name}
          </Text>
          <Text style={[styles.productSize, { color: colors.primary }]} numberOfLines={3}>
            {getStatusText(item.status)}
          </Text>
          <Text style={styles.productSize} numberOfLines={3}>{item.paymentDate}</Text>
          <TouchableOpacity onPress={() => navigate('OrderDetail', { id: item.orderID })}>
            <Text numberOfLines={3} style={styles.linkText}>Xem chi tiết đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput style={styles.noteInput} placeholder="Ghi chú cho sản phẩm" />
    </TouchableOpacity>
  );
});

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: "12@s",
    marginBottom: "16@s",
    backgroundColor: '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "8@s",
  },
  image: {
    width: "100@s",
    height: "100@s",
    marginRight: "16@s",
    borderRadius: "4@s"
  },
  title: {
    fontSize: "12@s",
    fontWeight: '600',
    color: 'gray'
  },
  productDetails: {
    flex: 1,
  },
  productSize: {
    fontSize: "12@s",
    color: '#666',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
    padding: "8@s",
    marginBottom: "8@s",
  },
  linkText: {
    color: 'blue',
    fontSize: "12@s",
  }
});