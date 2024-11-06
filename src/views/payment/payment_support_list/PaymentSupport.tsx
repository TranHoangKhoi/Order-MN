import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { paymentSupportAPI } from '~/api/payment_support';
import { ButtonCus } from '~/components';
import { DefaultLayout } from '~/layout';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';

const StatusType = {
  TOP_UP: 1,
  WITHDRAW: 2,
  ORDER_PAYMENT: 3,
  ORDER_DEPOSIT: 4,
  ORDER_SETTLEMENT: 5,
  REFUND: 6,
  PAYMENT_ON_BEHALF: 7,
  DEPOSIT_REQUEST: 8,
};

const getStatusText = (type) => {
  switch (type) {
    case StatusType.TOP_UP:
      return "Nạp tiền";
    case StatusType.WITHDRAW:
      return "Rút tiền";
    case StatusType.ORDER_PAYMENT:
      return "Thanh toán đơn hàng";
    case StatusType.ORDER_DEPOSIT:
      return "Đặt cọc đơn hàng";
    case StatusType.ORDER_SETTLEMENT:
      return "Tất toán đơn hàng";
    case StatusType.REFUND:
      return "Hoàn lại tiền";
    case StatusType.PAYMENT_ON_BEHALF:
      return "Thanh toán hộ";
    case StatusType.DEPOSIT_REQUEST:
      return "Đặt cọc yêu cầu giao";
    default:
      return "Unknown Status";
  }
};

const renderTransactionRow = (label, value, additionalStyles = {}) => (
  <View style={styles.ctntransactionText}>
    <Text style={styles.transactionText}>{label}</Text>
    <Text style={[styles.transactionText, { fontWeight: "600" }, additionalStyles]}>{value}</Text>
  </View>
)

const RenderItem = ({ item, navigate }) => {

  return (
    <View style={styles.transaction}>
      {renderTransactionRow("Mã đơn: ", item.id)}
      {renderTransactionRow("Ngày gửi: ", `${_func.getShortVNDate(item.create_time)}`)}
      {renderTransactionRow("Tổng tiền (¥): ", `${_func.getNumber(item.amount_total)}`)}
      {renderTransactionRow("Tổng tiền (VNĐ): ", `${_func.getVND(item.amount_total_vn)}`, { color: colors.primary })}
      {renderTransactionRow("Tỉ giá: ", `${_func.getNumber(item.cny)}`, { color: colors.primary })}
      {renderTransactionRow("Trạng thái: ", `${item.status}`)}
      <TouchableOpacity onPress={() => navigate('PaymentSupportDetail', { id: item.id })}>
        {renderTransactionRow("Thao tác: ", "Xem chi tiết", { textDecorationLine: 'underline', color: colors.textSuccess })}
      </TouchableOpacity>
    </View >
  )
}

export const PaymentSupport = () => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();

  const [paymentSupport, setPaymentSupport] = useState([])

  const fetchPaymentSupport = async () => {
    try {
      const data = await paymentSupportAPI.getPaymentSupport({ per_page: 20 })
      console.log("Data Payment: ", data.data)
      setPaymentSupport(data.data)
    } catch (error) {
      console.log("Error List Payment Support: ", error)
    }
  }

  useEffect(() => {
    fetchPaymentSupport();
  }, [])

  return (
    <DefaultLayout
      screenTitle='Danh sách thanh toán hộ'
      isShowBottomTab={false}
    >
      <ScrollView style={styles.container}>
        <FlatList
          scrollEventThrottle={20}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={paymentSupport?.reverse()}
          renderItem={({ item }) => <RenderItem item={item} navigate={navigate} />}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  container: {
    marginBottom: '20@s',
    padding: "10@s",
    backgroundColor: colors.background,
    flex: 1,
  },
  transaction: {
    marginBottom: '10@s',
    borderRadius: '10@s',
    padding: '10@s',
    borderWidth: '1@s',
    borderColor: '#ccc'
  },
  ctntransactionText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  transactionText: {
    fontSize: scale(14),
    marginBottom: '5@s',
    color: colors.black,
    fontWeight: '400'
  },
});
