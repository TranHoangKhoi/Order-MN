import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { paymentSupportAPI } from '~/api/payment_support';
import { ButtonCus } from '~/components';
import { DefaultLayout } from '~/layout';
import { TAppStackParamList } from '~/types/navigator';
import { colors } from '~/utils';

const tiGia = 3655;

export const PaymentScreen = () => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>()
  
  const [invoices, setInvoices] = useState([{ id: Date.now(), giaTien: '', noiDung: '' }]);
  const [tongTienTe, setTongTienTe] = useState(0);
  const [tongTienVnd, setTongTienVnd] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    const totalTe = invoices.reduce((total, invoice) => {
      const giaTien = parseFloat(invoice.giaTien) || 0;
      return total + giaTien;
    }, 0);
    setTongTienTe(totalTe);
    const totalVnd = totalTe * tiGia;
    setTongTienVnd(totalVnd);

  }, [invoices, tiGia]);


  const handleAddInvoice = () => {
    setInvoices([...invoices, { id: Date.now(), giaTien: '', noiDung: '' }]);
  };

  const handleRemoveInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const handleInvoiceChange = (id, field, value) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, [field]: value } : invoice
    ));
  };

  const handleSubmit = async () => {
    const filterInvoice = invoices.map(item => ({
      price: item.giaTien,
      note: item.noiDung
    }))
    try{
      const params = {
        totalCNY: tongTienTe,
        totalVN: tongTienVnd,
        amount: filterInvoice,
        txtCny: tiGia,
        note: note
      }
      const data = await paymentSupportAPI.sendPaymentSupport(params)
      if (data.data != null && tongTienTe != 0) {
        Alert.alert("Gửi đơn thành công!")
        setInvoices([{ id: Date.now(), giaTien: '', noiDung: '' }])
        setNote('')
      }
      else {
        Alert.alert("Hãy nhập đủ thông tin trước khi gửi đơn!")
      }
    }catch(err) {
      console.log("Error Payment Support: ", err)
    }
  };

  const handleCancel = () => {
    setInvoices([{ id: Date.now(), giaTien: '', noiDung: '' }])
  };

  return (
    <DefaultLayout
      screenTitle='Thanh toán hộ'
      isShowBottomTab={false}
    >
      <ScrollView style={styles.container}>
        {invoices.map((invoice, index) => (
          <View key={invoice.id} style={styles.inputRow}>
            <View style={{flexDirection: 'column'}}>
              <TextInput
                style={styles.input}
                value={invoice.giaTien}
                onChangeText={(value) => handleInvoiceChange(invoice.id, 'giaTien', value)}
                placeholder="Giá tiền (Tệ)"
                keyboardType="numeric"
                placeholderTextColor={"#c0c0c0"}
              />
            </View>
            <TextInput
              style={styles.input}
              value={invoice.noiDung}
              onChangeText={(value) => handleInvoiceChange(invoice.id, 'noiDung', value)}
              placeholder="Nội dung"
              placeholderTextColor={"#c0c0c0"}
            />
            {index > 0 && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveInvoice(invoice.id)}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddInvoice}>
          <Text style={styles.addButtonText}>+ Thêm hóa đơn thanh toán hộ</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.fullWidthInput}
          value={tongTienTe.toString()}
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
          value={tiGia.toString()}
          placeholder="Tỉ giá"
          editable={false}
        />

        <TextInput
          style={styles.fullWidthInput}
          value={note}
          onChangeText={(value) => setNote(value)}
          placeholder="Ghi chú"
          multiline
        />
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={() => navigate('PaymentSupport')}>
            <Text style={{color: colors.textSuccess, textDecorationLine: 'underline'}}>Danh sách thanh toán hộ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <ButtonCus
            name='Gửi đơn'
            onPress={handleSubmit}
            textStyle={{ color: '#fff' }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ButtonCus
            name='Hủy đơn'
            buttonStyle={{ backgroundColor: 'gray' }}
            onPress={handleCancel}
            textStyle={{ color: '#fff' }}
          />
        </View>
      </View>
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
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: "10@s",
    borderRadius: "5@s",
  },
  deleteButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: "10@s",
    borderRadius: "5@s",
    marginBottom: "16@s",
  },
  addButtonText: {
    color: colors.background,
    fontWeight: 'bold',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: "16@s",
    paddingBottom: "16@s",
    gap: "16@s"
  },
});
