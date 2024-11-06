import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';
import { orderAPI } from '~/api/order_management';
import { DefaultLayout } from '~/layout';
import { shadowStyle } from '~/styles';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { MaterialIcons } from '~/components';
import { transferCodeAPI } from '~/api/packing_list';

const CollapsibleHeader = ({ title, toggleFunction, isExpanded }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={toggleFunction}
    style={[styles.feeContainer, { marginBottom: isExpanded ? scale(10) : 0 }]}
  >
    <Text style={styles.header}>{title}</Text>
    <MaterialIcons name={!isExpanded ? "arrow-drop-up" : "arrow-drop-down"} size={scale(22)} color="#000" />
  </TouchableOpacity>
);

const renderFeeRow = (label, value) => (
  <View style={styles.feeContainer} key={label}>
    <Text style={styles.feeLabel}>{label}</Text>
    <Text style={styles.feeValue}>{value}</Text>
  </View>
);

export const OrderDetail = () => {
  const [notes, setNotes] = useState('');
  const [visibilityState, setVisibilityState] = useState({
    showOrderInfo: true,
    showPaymentDetails: true,
    showShippingDetails: true,
    showOrderCodes: true,
  });
  const [checkboxState, setCheckboxState] = useState({
    isInsuranceChecked: false,
    isSaleChecked: false,
    isWoodenBoxChecked: false,
    isInspectionChecked: false,
  });
  const [orderDetail, setOrderDetail] = useState(null); 
  const [transferData, setTransferData] = useState(null);
  const { id } = useRoute<RouteProp<TAppStackParamList, 'OrderDetail'>>().params;

  const fetchTransferCode = useCallback(async () => {
    try {
      const params = { per_page: 20, identify: orderDetail?.identify};
      const data = await transferCodeAPI.transferCode({ params });
      setTransferData(data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchOrderDetail = async () => {
        try {
          await fetchTransferCode()
          const response = await orderAPI.orderDetail(id);
          setOrderDetail(response.data);
        } catch (error) {
          console.error('Error fetching order detail:', error);
        }
      };
      fetchOrderDetail();
    }
  }, [id]);

  const toggleVisibility = (section) => {
    setVisibilityState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (name) => (value) => {
    setCheckboxState((prevState) => ({ ...prevState, [name]: value }));
  };

  const checkboxLabels = {
    isInsuranceChecked: 'Phí bảo hiểm',
    isSaleChecked: 'Đơn săn sale',
    isWoodenBoxChecked: 'Đóng gỗ',
    isInspectionChecked: 'Kiểm đếm',
  };

  const StatusType = {
    NOT_SHIP: 0,
    DELIVERING: 2,
    WAREHOUSE_VN: 3,
    RETURNED: 5,
    SHIPPING_TO_WAREHOUSE: 10,
  };
  
  const getStatusText = (type) => {
    const statusTexts = {
      [StatusType.NOT_SHIP]: "Chưa ship",
      [StatusType.DELIVERING]: "Đang vận chuyển",
      [StatusType.WAREHOUSE_VN]: "Kho VN",
      [StatusType.RETURNED]: "Đã trả hàng",
      [StatusType.SHIPPING_TO_WAREHOUSE]: "Đang vận chuyển kho đích",
    };
    return statusTexts[type] || "Unknown Status";
  };

  return (
    <DefaultLayout screenTitle="Thông tin đơn hàng" isShowBottomTab={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoContainer, shadowStyle.black]}>
          <CollapsibleHeader
            title="Thông tin đơn hàng"
            toggleFunction={() => toggleVisibility('showOrderInfo')}
            isExpanded={visibilityState.showOrderInfo}
          />
          {visibilityState.showOrderInfo && (
            <>
              <Text style={styles.label}>
                Mã đơn hàng: <Text style={styles.boldText}>{orderDetail?.identify}</Text>
              </Text>
              <Text style={styles.label}>
                Tên khách hàng: <Text style={styles.linkText}>testthu (testthui)</Text>
              </Text>
              <Text style={styles.label}>Nhân viên quản lý: {orderDetail?.orderStaffName}</Text>
              <Text style={styles.label}>
                Tỷ giá áp dụng: <Text style={styles.feeValue}>{_func.getVND(orderDetail?.cny, 'đ')}</Text>
              </Text>
              <Text style={styles.label}>Số lượng sản phẩm: {orderDetail?.quantity?.toString()} / {orderDetail?.totalQuantity.toString()}</Text>
            </>
          )}
        </View>
        <View style={styles.section}>
          <CollapsibleHeader
            title="Tiền hàng"
            toggleFunction={() => toggleVisibility('showPaymentDetails')}
            isExpanded={visibilityState.showPaymentDetails}
          />
          {visibilityState.showPaymentDetails && (
            <>
              {renderFeeRow(`(1) Tiền hàng: ${orderDetail?.actualPayment}¥`, `${_func.getVND(orderDetail?.totalOrder, 'đ')}`)}
              {renderFeeRow('(2) Phí ship nội địa TQ: 0¥', `${_func.getVND(orderDetail?.totalShipVn, 'đ')}`)}
              {renderFeeRow('(3) Phí mua hàng (5%):', `${_func.getVND(orderDetail?.orderFee, 'đ')}`)}
              {renderFeeRow('(4) Phí phát sinh:', `${_func.getVND(orderDetail?.totalIncurred, 'đ')}`)}
              {renderFeeRow('(5) Kiểm đếm:', `${_func.getVND(orderDetail?.discountVoucher, 'đ')}`)}
              {renderFeeRow('(6) Đóng gỗ:', `${_func.getVND(orderDetail?.reinforced, 'đ')}`)}
              {renderFeeRow('(7) Phí ship VN:', `${_func.getVND(orderDetail?.totalShipVn, 'đ')}`)}
              {renderFeeRow('(8) Phí bảo hiểm:', `${_func.getVND(orderDetail?.innsuranceFees, 'đ')}`)}
              {renderFeeRow('(9) Voucher:', `${_func.getVND(orderDetail?.discountVoucher, 'đ')}`)}
            </>
          )}
        </View>
        <View style={styles.section}>
          <CollapsibleHeader
            title="Tất toán đơn hàng"
            toggleFunction={() => toggleVisibility('showShippingDetails')}
            isExpanded={visibilityState.showShippingDetails}
          />
          {visibilityState.showShippingDetails && (
            <>
              {renderFeeRow('Tổng phí:', `${_func.getVND(orderDetail?.totalPayment, 'đ')}`)}
              {renderFeeRow('Đã thanh toán:', `${_func.getVND(orderDetail?.totalPaid, 'đ')}`)}
              {renderFeeRow('Còn thiếu:', `${_func.getVND(orderDetail?.debtAmount, 'đ')}`)}
              <View style={styles.notesContainer}>
                <Text style={styles.label}>Ghi chú:</Text>
                <TextInput
                  style={styles.input}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Nhập ghi chú"
                />
              </View>
            </>
          )}
        </View>
        <View style={styles.section}>
          <CollapsibleHeader
            title="Danh sách mã vận đơn"
            toggleFunction={() => toggleVisibility('showOrderCodes')}
            isExpanded={visibilityState.showOrderInfo}
          />
          {visibilityState.showOrderCodes && (
            <>
              <View style={styles.trackingHeader}>
                <Text style={styles.trackingLabel}>Mã vận đơn:</Text>
                <Text style={styles.trackingLabel}>Trạng thái</Text>
              </View>
              <ScrollView style={{ height: '30%' }}>
                <FlatList
                  data={transferData}
                  renderItem={({ item }) =>
                    <View key={item} style={styles.trackingContainer}>
                    <Text style={styles.trackingLabel}>{item.transferID}</Text>
                    <Text style={[styles.statusButtonText, { color: colors.primary }]}>{getStatusText(item.shipStatus)}</Text>
                  </View>
                  }
                />
              </ScrollView>
              <View style={styles.checkboxContainer}>
                {Object.keys(checkboxState).map((key) => (
                  <View key={key} style={styles.checkboxRow}>
                    <CheckBox value={checkboxState[key]} onValueChange={handleCheckboxChange(key)} />
                    <Text style={styles.checkboxLabel}>{checkboxLabels[key]}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </DefaultLayout>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoContainer: {
    padding: '16@s',
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: '8@s',
    marginBottom: '16@s',
  },
  label: {
    fontSize: '14@s',
    color: 'black',
    marginBottom: '5@s',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
  linkText: {
    color: '#00aaff',
    fontWeight: '600',
  },
  section: {
    padding: '16@s',
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: '8@s',
    marginBottom: '16@s',
    flex: 1
  },
  header: {
    fontWeight: '700',
    fontSize: scale(16),
    color: colors.black
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '10@s',
  },
  feeLabel: {
    color: 'black',
    fontSize: '14@s',
  },
  feeValue: {
    color: 'red',
    fontSize: '14@s',
  },
  notesContainer: {
    marginBottom: '10@s',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    padding: '10@s',
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: 'gray',
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  trackingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10@s',
    backgroundColor: 'white',
    paddingVertical: '8@s',
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  trackingLabel: {
    color: 'black',
    fontSize: '14@s',
  },
  statusButtonText: {
    color: colors.background,
    fontSize: '14@s',
  },
  checkboxContainer: {
    marginTop: '10@s',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10@s',
    flex: 1,
  },
  checkboxLabel: {
    color: 'black',
    marginLeft: '10@s',
    fontSize: '14@s',
  },
});


