import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { paymentSupportAPI } from '~/api/payment_support';
import { ButtonCus } from '~/components';
import { DefaultLayout } from '~/layout';
import { TAppStackParamList } from '~/types/navigator';
import { _func, colors } from '~/utils';

export const PaymentSupportDetail = () => {
  const [tongTienTe, setTongTienTe] = useState(0);
  const [tongTienVnd, setTongTienVnd] = useState(0);
  const [giaTienTe, setgiaTienTe] = useState(0);
  const [tiGia, setTiGia] = useState(0);
  const [note, setNote] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const { id } = useRoute<RouteProp<TAppStackParamList, 'OrderDetail'>>().params;

  useEffect(() => {
    if (id) {
      const fetchPaymentSupportDetail = async () => {
        try {
          const data = await paymentSupportAPI.paymentSupportDetail(id)
          const item = data.data

          setTongTienTe(item.amount_total)
          setTongTienVnd(item.amount_total_vn)
          setTiGia(item.cny)
          setNote(item.note)
          setgiaTienTe(item.dataAmount)
          setStatus(item.status)
          console.log('Check Detail: ', item)
        } catch (err) {
          console.error('Error Payment Detail: ', err)
        }
      }
      fetchPaymentSupportDetail()
    }

  }, [id])

  return (
    <DefaultLayout
      screenTitle='Chi tiết thanh toán hộ'
      isShowBottomTab={false}
    >
      <ScrollView style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={giaTienTe.toString()}
            placeholder="Giá tiền (Tệ)"
            keyboardType="numeric"
            editable={false}
            placeholderTextColor={"#c0c0c0"}
          />
          <TextInput
            style={styles.input}
            value={content}
            placeholder="Nội dung"
            editable={false}
            placeholderTextColor={"#c0c0c0"}
          />
        </View>

        <View style={styles.lineHorizontal} />

        <TextInput
          style={styles.fullWidthInput}
          value={tongTienTe.toLocaleString()}
          placeholder="Tổng tiền (Tệ)"
          editable={false}
        />
        <TextInput
          style={styles.fullWidthInput}
          value={tongTienVnd.toLocaleString()}
          placeholder="Tổng tiền (VND)"
          editable={false}
        />
        <TextInput
          style={styles.fullWidthInput}
          value={tiGia.toLocaleString()}
          placeholder="Tỉ giá"
          editable={false}
        />

        <TextInput
          style={styles.fullWidthInput}
          value={note}
          placeholder="Ghi chú"
          multiline
          editable={false}
        />
        <Text style={{ color: '#000', fontSize: 14 }}>Trạng thái: {status}</Text>
      </ScrollView>
    </DefaultLayout>
  );
}

const styles = ScaledSheet.create({
  container: {
    padding: "10@s",
    backgroundColor: colors.background,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "16@s",
  },
  lineHorizontal: {
    height: '0.5@s',
    marginBottom: "16@s",
    backgroundColor: colors.black
  },
  input: {
    flex: 1,
    height: "40@s",
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: "8@s",
    borderRadius: "5@s",
    paddingHorizontal: "8@s",
    color: colors.black,
    fontSize: "14@s"
  },
  fullWidthInput: {
    height: "40@s",
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: "16@s",
    paddingHorizontal: "8@s",
    borderRadius: "5@s",
    color: colors.black
  },
});
