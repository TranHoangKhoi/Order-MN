import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { cartAPI } from '~/api/cart';
import { ButtonCus, FeatherIcon, LoadingLottie, MaterialCommunityIcon } from '~/components';
import DateInput from '~/components/global/datePicker/DateInput';
import { DefaultLayout } from '~/layout';
import { _func, colors } from '~/utils';
import RNPickerSelect from 'react-native-picker-select';
import { scale, ScaledSheet } from 'react-native-size-matters';

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

const renderTransactionRow =  (label, value, additionalStyles = {}) => (
  <View style={styles.ctntransactionText}>
    <Text style={styles.transactionText}>{label}</Text>
    <Text style={[styles.transactionText, { fontWeight: "600"}, additionalStyles]}>{value}</Text>
  </View>
)

const RenderItem = ({ item }) => {
  const dau = item.type == 1 || item.type == 6 ? "+" : '-';

  return (
    <View style={styles.transaction}>
      {renderTransactionRow("Mã giao dịch: ", `${item.id}`)}
      {renderTransactionRow("Giá trị GD: ", `${dau} ${_func.getVND(item.value, 'đ')}`, {color: colors.primary})}
      {renderTransactionRow("Số dư cuối: ", `${_func.getVND(item.balance, 'đ')}`, {color: colors.primary})}
      {renderTransactionRow("Ngày: ", `${item.create_date}`)}
      {renderTransactionRow("Loại giao dịch: ", `${getStatusText(item.type)}`, { color: colors.primary, fontWeight: "700" })}
      {renderTransactionRow("Nội dung: ", `${item.sapo}`)}
    </View >
  )
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [drop, setDrop] = useState<boolean>(true);
  const [listStatus, setListStatus] = useState([]);


  const handleValueChange = (value) => {
    setType(value)
  };

  const handleStartDateChange = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatDate = `${year}-${month}-${day}`
    setStartDate(formatDate)
  }

  const handleEndDateChange = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatDate = `${year}-${month}-${day}`
    setEndDate(formatDate)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const params = {
      per_page: 20,
      order_number: orderNumber,
      start_date: startDate,
      end_date: endDate,
      type: type
    };
    const newParams = {
      per_page: 20,
      order_number: orderNumber,
      start_date: startDate,
      end_date: endDate,
      type: type
    };
    if (JSON.stringify(params) === JSON.stringify(newParams)) {
      setStartDate('')
      setEndDate('')
      setType('')
      setOrderNumber('')
    }
    await cartAPI.fetchTransactions(params)
      .then(data => {
        // console.log("data: ", data);
        setTransactions(data.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchStatusTransaction = async () => {
    setInitialLoading(true)
    const status = await cartAPI.statusTransactions()
    const values = Object.entries(status.data).map(([key, value]) => ({
      label: value,
      value: key
    }));
    setListStatus(values)
    // console.log('Check status transactions: ', values)
  }

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchTransactions();
      await fetchStatusTransaction();
      setInitialLoading(false);
    };
    fetchData();
  }, []);


  return (
    <DefaultLayout
      isShowBottomTab={true}
      screenTitle='Lịch sử giao dịch'
      iconRight={true}
      showTextRight={"Bộ lọc"}
      onPressIconRight={() => setDrop(!drop)}
      icon={<FeatherIcon name="filter" size={16} color={"#000"} />}
    >
      {initialLoading ? (
        <LoadingLottie />
      ) : (
        <View style={{ flex: 1 }}>
          {!drop &&
            <>
              <TextInput
                style={styles.input}
                placeholder="Mã đơn hàng..."
                value={orderNumber}
                onChangeText={setOrderNumber}
              />
              <DateInput onDateChange={handleStartDateChange} placeholder="Từ ngày" />
              <DateInput onDateChange={handleEndDateChange} placeholder="Đến ngày" />
              <View style={styles.pickerStyles}>
                <RNPickerSelect
                  style={{ inputAndroid: styles.inputAndroid }}
                  onValueChange={handleValueChange}
                  items={listStatus}
                />
              </View>

              <ButtonCus
                isLoading={loading}
                onPress={fetchTransactions}
                name="Tìm kiếm"
                buttonStyle={{ marginTop: 0 }}
                textStyle={{ color: "#fff" }}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setDrop(!drop)}
                style={{ width: "100%", alignItems: 'flex-end' }}>
                <MaterialCommunityIcon
                  name={!drop ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </>
          }
          <FlashList
            scrollEventThrottle={20}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            data={transactions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
            estimatedItemSize={10}
            onEndReachedThreshold={0.1}
          />
        </View>
      )}
    </DefaultLayout>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    padding: '20@s'
  },
  input: {
    height: '40@s',
    borderWidth: '1@s',
    borderColor: 'gray',
    borderRadius: '5@s',
    padding: '10@s',
    marginBottom: '10@s',
  },
  button: {
    backgroundColor: 'blue',
    padding: '10@s',
    alignItems: 'center',
    marginBottom: '10@s'
  },
  buttonText: {
    color: 'white',
    fontSize: scale(16)
  },
  icon: {
    color: colors.primary,
    fontSize: scale(24)
  },
  inforTransaction: {
    fontWeight: 'bold',
    fontSize: scale(16),
    color: 'black',
    marginBottom: '5@s'
  },
  transaction: {
    padding: '10@s',
    borderBottomWidth: '1@s',
    borderBottomColor: '#ccc'
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
  pickerStyles: {
    height: '45@s',
    borderWidth: '1@s',
    borderColor: 'gray',
    borderRadius: '4@s',
    marginBottom: '20@s'
  },
  inputAndroid: {
    fontSize: scale(14),
    color: 'black',
    height: '50@s',
    paddingBottom: '10@s',
    marginBottom: '20@s',
    marginLeft: '10@s',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: '1@s',
    borderColor: 'black'
  },
  content: {
    width: '70%',
    alignItems: 'flex-end',
  }
});
