import { Text, View, TextInput, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DefaultLayout } from '~/layout';
import { _func, colors } from '~/utils';
import { ScaledSheet } from 'react-native-size-matters';
import { ButtonCus } from '~/components';
import { walletAPI } from '~/api';

const StatusType = {
  PENDING_APPROVAL: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  CANCELED: 3,
};

const getStatusText = (type) => {
  switch (type) {
    case StatusType.PENDING_APPROVAL:
      return "Chờ duyệt";
    case StatusType.PROCESSING:
      return "Đang xử lý";
    case StatusType.COMPLETED:
      return "Đã hoàn thành";
    case StatusType.CANCELED:
      return "Đã hủy";
    default:
      return "Unknown Status";
  }
};

export const WithdrawMoney = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState('');
  const [numValue, setNumValue] = useState(null);

  const handleConvert = async () => {
    const convertNumber = parseInt(value);
    if (isNaN(convertNumber)) {
      setNumValue(null)
    }else {
      setNumValue(convertNumber)
      await postWithdraw();
    }
  }

  const fetchListWithdraw = async () => {
    setLoading(true);
    try {
      const res = await walletAPI.getWithdraw()

      setTransactions(res.data.data)
    }catch (err) {
      console.log('Error: ', err)
    }finally {
      setLoading(false)
    }
  }
  const postWithdraw = async () => {
    setLoading(true);
    try {
      const res = await walletAPI.postWithdraw({value: numValue})
      if(res.success) {
        Alert.alert('Thành công', res.message);
        fetchListWithdraw();
      }
    }catch (err) {
      console.log('Error: ', err)
      Alert.alert('Thất bại', err.message);
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListWithdraw();
  }, [])

  return (
    <DefaultLayout
      isShowBottomTab={true}
      screenTitle='Rút tiền'
    >
      <View style={styles.container}>
        <TextInput
          onChangeText={(value) => setValue(value)}
          style={styles.input}
          placeholder="Số tiền cần rút"
          keyboardType="numeric"
        />
        <ButtonCus
          name='Yêu cầu rút tiền'
          isLoading={loading}
          textStyle={{ color: "#fff" }}
          onPress={handleConvert}
        />
        <ScrollView style={styles.table}>
          {transactions.map((transaction, index) => (
            <View key={transaction.id}
              style={[styles.tableRow]}
            >
              <Text style={styles.rowText}>STT: {index + 1}</Text>
              <Text style={styles.rowText}>Ngày gửi: {transaction.create_date}</Text>
              <Text style={styles.rowText}>Tổng rút: <Text style={{ color: "red", fontWeight: '500' }}>{_func.getVND(transaction.value)}</Text></Text>
              <Text style={styles.rowText}>Tình trạng: <Text style={{ color: colors.primary, fontWeight: '700' }}>{getStatusText(transaction.status)}</Text></Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: "10@s",
  },
  input: {
    width: '100%',
    height: "45@s",
    borderColor: 'gray',
    borderWidth: 0.7,
    padding: "10@s",
    borderRadius: "5@s"
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  table: {
    marginTop: 20,
    width: '100%',
  },
  tableRow: {
    marginBottom: 10,
    borderColor: '#ccc',
    paddingVertical: 5,
    borderTopWidth: 1,
  },
  rowText: {
    fontSize: 14,
    color: colors.black
  }
});
