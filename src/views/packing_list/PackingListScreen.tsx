import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ButtonCus, FeatherIcon, LoadingLottie, MaterialCommunityIcon } from '~/components';
import { DefaultLayout } from '~/layout';
import { colors } from '~/utils';
import { FlashList } from '@shopify/flash-list';
import { scale, ScaledSheet } from 'react-native-size-matters';
import DateInput from '~/components/global/datePicker/DateInput';
import RNPickerSelect from 'react-native-picker-select';
import { transferCodeAPI } from '~/api/packing_list';
import { orderAPI } from '~/api/order_management';
import { shadowStyle } from '~/styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TAppStackParamList } from '~/types';
import Clipboard from '@react-native-clipboard/clipboard';

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


const handleItemPress = (item, navigate) => {
  if (item.orderID != null) {
    navigate('OrderDetail', { id: item.orderID })
  } else {
    Alert.alert('Not found ID', "Please check ID. It is null")
  }
}



const RenderItem = ({ item, navigate }) => {
  const [showCopyButton, setShowCopyButton] = useState('');


  const handleLongPress = (label) => {
    setShowCopyButton(label);
  };

  const handleOutsidePress = () => {
    if (showCopyButton) {
      setShowCopyButton('');
    }
  };

  const handleCopy = (value) => {
    Clipboard.setString(value);
    setShowCopyButton('');
    alert('Copied to clipboard!');
    
  };

  return (
    <TouchableOpacity onPress={() => handleItemPress(item, navigate)}>
      <View style={[styles.packingList, shadowStyle.black]}>
        {[
          { label: 'Mã kiện', value: item.transferID, fontWeight: '700', color: colors.black },
          { label: 'Mã đơn hàng', value: item.identify, fontWeight: '700', color: colors.black },
          { label: 'Trạng thái', value: getStatusText(item.shipStatus), fontWeight: '700', color: colors.primary },
          { label: 'Ngày tạo', value: item.createDate, fontWeight: '500', color: colors.black },
          { label: 'Cân nặng', value: `${item.kg} (kg)`, color: colors.black },
          { label: 'Dài(cm)', value: `${item.long} (cm)`, color: colors.black },
          { label: 'Rộng(cm)', value: `${item.wide} (cm)`, color: colors.black },
          { label: 'Cao(cm)', value: `${item.high} (cm)`, color: colors.black },
          { label: 'Cân quy đổi', value: `${item.kgChange} (kg)`, color: colors.black },
          { label: 'Cân tính tiền', value: `${item.kgPay} (kg)`, color: colors.black },
        ].map(({ label, value, fontWeight, color }: any) => (
          <View style={styles.ctnPackingListText} key={label}>
            <Text style={styles.packingListText}>{label}: </Text>
            <TouchableOpacity
              onLongPress={() => (label === "Mã kiện" || label === 'Mã đơn hàng') && handleLongPress(label) }
              >
              <Text
                style={[styles.packingListText, { fontWeight, color }]}
              >{value}</Text>
            </TouchableOpacity>
            {showCopyButton === label  && (
              <TouchableOpacity style={styles.copyButtonContainer} onPress={() => handleCopy(value)}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  )
};

export const PackingListScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [drop, setDrop] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [packNumber, setPackNumber] = useState('');
  const [date, setDate] = useState('');
  const [listStatus, setListStatus] = useState([]);
  const [shippingStatus, setShippingStatus] = useState('');
  const [page, setPage] = useState({
    currentPgae: 1,
    nextPage: 1,
    lastPgae: 1
  });

  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();

  const fetchTransferCode = useCallback(async () => {
    setLoading(true);
    try {
      const params = { per_page: 5, order: "desc", identify: orderNumber, date, shipStatus: shippingStatus, transferID: packNumber };
      const data = await transferCodeAPI.transferCode({ params });
      setTransferData(data.data);
      setPage({
        currentPgae: data.current_page,
        lastPgae: data.last_page,
        nextPage: data.current_page + 1
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setOrderNumber('');
      setDate('');
      setShippingStatus('');
      setPackNumber('');
    }
  }, [orderNumber, date, shippingStatus, packNumber]);

  const loadMoreData = async () => {
    if(page.nextPage <= page.lastPgae) {
      setLoading(true);
      try {
        const params = {per_page: 5, order: "desc", identify: orderNumber, date, shipStatus: shippingStatus, transferID: packNumber };
        const data = await transferCodeAPI.transferCodePage({ params }, page.nextPage);
        setPage((prev) => ({
          ...prev,
          currentPgae: data.current_page,
          nextPage: data.current_page + 1
        }));
        setTransferData((prev) => ([...prev, ...data.data]));
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  const fetchShippingStatus = useCallback(async () => {
    try {
      const status = await orderAPI.shippingStatus();
      const values = Object.entries(status.data).map(([key, value]) => ({ label: value, value: key }));
      setListStatus(values);
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchTransferCode();
      await fetchShippingStatus();
      setInitialLoading(false);
    };
    fetchData();
  }, []);

  const renderFooter = () => {
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.buttonBottom} onPress={loadMoreData}>
        <Text style={styles.buttonTextBottom}>Tải thêm
        {loading && <ActivityIndicator size='small' color={'#fff'} />}</Text>
          
      </TouchableOpacity>
    </View>
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setOrderNumber('');
    setDate('');
    setShippingStatus('');
    setPackNumber('');
    await fetchTransferCode();
    setRefreshing(false);
  }, [fetchTransferCode]);

  return (
    <DefaultLayout
      isShowBottomTab={false}
      screenTitle='Danh sách kiện hàng'
      iconRight={true}
      showTextRight="Bộ lọc"
      onPressIconRight={() => setDrop(!drop)}
      icon={<FeatherIcon name="filter" size={16} color="#000" />}
    >
      {initialLoading ? <LoadingLottie /> : (
        <View style={{ flex: 1 }}>
          {!drop ? (
            <>
              <TextInput style={styles.input} placeholder="Mã kiện" value={packNumber} onChangeText={setPackNumber} />
              <TextInput style={styles.input} placeholder="Mã đơn hàng" value={orderNumber} onChangeText={setOrderNumber} />
              <DateInput onDateChange={setDate} placeholder="Ngày tạo" />
              <View style={styles.pickerStyles}>
                <RNPickerSelect onValueChange={setShippingStatus} items={listStatus} style={{ inputAndroid: styles.inputAndroid }} />
              </View>
              <ButtonCus
                isLoading={loading}
                onPress={fetchTransferCode}
                name="Tìm kiếm"
                buttonStyle={{ marginTop: 0 }}
                textStyle={{ color: "#fff" }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setDrop(!drop)} style={{ width: "100%", alignItems: 'flex-end', marginBottom: scale(10) }}>
                <MaterialCommunityIcon name={!drop ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'} style={styles.icon} />
              </TouchableOpacity>
            </>
          ): (<>
           <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Mã kiện" value={packNumber} onChangeText={setPackNumber}
            />
      
            <TouchableOpacity
              onPress={fetchTransferCode}
              style={styles.searchButon}
            >
              <Text style={{color: '#fff'}}>Tìm kiếm</Text>
              {loading && <ActivityIndicator size='small' color={'#fff'} />}
            </TouchableOpacity>
          </View>
          </>)}
          <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={transferData}
            renderItem={({ item }) => <RenderItem item={item} navigate={navigate} />}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={page.nextPage <= page.lastPgae ? renderFooter : <></>}
          />
        </View>
      )}
    </DefaultLayout>
  );
};

const styles = ScaledSheet.create({
  packingList: {
    padding: '14@s',
    borderColor: 'gray',
    borderRadius: '5@s',
    backgroundColor: colors.background,
    borderWidth: 0.7,
    marginBottom: '10@s',
  },
  ctnPackingListText: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '5@s',
    justifyContent: 'space-between',
  },
  packingListText: {
    fontSize: scale(14),
    color: colors.black,
  },
  input: {
    height: '40@s',
    borderWidth: '1@s',
    borderColor: 'gray',
    borderRadius: '5@s',
    padding: '10@s',
    marginBottom: '10@s',
  },
  icon: {
    color: colors.primary,
    fontSize: scale(24),
  },
  pickerStyles: {
    height: '50@s',
    borderWidth: '1@s',
    borderColor: 'gray',
    borderRadius: '5@s',
    marginBottom: '10@s',
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
    borderColor: 'black',
  },
  button: {
    backgroundColor: 'blue',
    padding: '10@s',
    alignItems: 'center',
    marginBottom: '10@s',
  },
  buttonText: {
    color: 'white',
    fontSize: '16@s',
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput : {
    height: '40@s',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '10@s',
    padding: '10@s',
    borderRadius: scale(4),
    width: '70%',
    color: 'black'
  },
  searchButon: {
    backgroundColor: colors.primary,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
    fontSize: 14,
    height: '40@s',
    flex: 1,
    borderRadius: scale(4),
    flexDirection: 'row',
    gap: 4
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  buttonBottom: {
    backgroundColor: '#D31E25',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonTextBottom: {
    color: '#fff',
    fontSize: 16,
  },
  containerCopy: {
    position: 'relative',
    padding: 10,
  },
  copyButtonContainer: {
    position: 'absolute',
    top: 0,  // Căn chỉnh vị trí của nút copy
    right: 0, // Căn chỉnh vị trí của nút copy
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // Đổ bóng cho Android
  },
  copyButtonText: {
    color: 'white',
    paddingHorizontal: 6,
    fontWeight: 'bold',
  },
});
