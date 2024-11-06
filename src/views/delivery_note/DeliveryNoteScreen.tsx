import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { RefreshControl, View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { ButtonCus, FeatherIcon, LoadingLottie, MaterialCommunityIcon } from '~/components';
import { DefaultLayout } from '~/layout';
import { _func, colors } from '~/utils';
import { FlashList } from '@shopify/flash-list';
import { scale, ScaledSheet } from 'react-native-size-matters';
import DateInput from '~/components/global/datePicker/DateInput';
import RNPickerSelect from 'react-native-picker-select';
import { shadowStyle } from '~/styles';
import { deliveryNoteAPI } from '~/api/delivery_note';
import Clipboard from '@react-native-clipboard/clipboard';


const StatusType = {
  WAITING: 1,
  DONE: 2,
};

const getStatusText = (type) => {
  const statusTexts = {
    [StatusType.WAITING]: "Chờ xuất",
    [StatusType.DONE]: "Hoàn thành",
  };
  return statusTexts[type] || "Unknown Status";
};

const RenderItem = ({ item, index }) => {
  const [show, checkShow] = useState(false);
  const [listDetail, setListDetail] = useState([]);
  const [showCopyButton, setShowCopyButton] = useState('');

  const onShowDetail = async () => {
    checkShow(!show)
    if (!show) {
      const res = await deliveryNoteAPI.deliveryNoteDetail(item.id)
      setListDetail(res.data.items)
    }
  }
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
   <>
    <TouchableOpacity
    activeOpacity={1}
    onPress={handleOutsidePress}
    >
      <View
        style={[styles.packingList, shadowStyle.black]}>
        {[
          { label: 'Vị trí', value: ++index, fontWeight: '700', color: colors.black },
          { label: 'Mã phiếu', value: item.delivery_id, fontWeight: '700', color: colors.black },
          { label: 'Cân nặng', value: `${item.kg} kg`, color: colors.black },
          { label: 'Tổng tiền', value: _func.getVND(item.total_price_kg, 'đ'), fontWeight: '700', color: colors.primary },
          { label: 'Ngày tạo', value: _func.getDay(item.create), fontWeight: '500', color: colors.black },
          { label: 'Ngày giao', value: _func.getDay(item.paymentDate), fontWeight: '500', color: colors.black },
          { label: 'Trạng thái', value: getStatusText(item.status), fontWeight: '700', color: colors.primary },
        ].map(({ label, value, fontWeight, color }: any) => (
          <View style={styles.ctnPackingListText} key={label}>
            <Text style={styles.packingListText}>{label}: </Text>

            <TouchableOpacity
                onLongPress={() => label === "Mã phiếu" && handleLongPress(label) }
                style={styles.containerCopy}
                >
                <Text style={[styles.packingListText, { fontWeight, color }]}>{value || "--"}</Text>
              </TouchableOpacity>
              {showCopyButton === label  && (
                <TouchableOpacity style={styles.copyButtonContainer} onPress={() => handleCopy(value)}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              )}
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onShowDetail}
          style={{ width: "100%", alignItems: 'flex-end', marginBottom: show ? 8 : 0 }}>
          <MaterialCommunityIcon
            name={show ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'}
            style={styles.icon}
          />
        </TouchableOpacity>

        {show &&
          <FlashList
            data={listDetail}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{ borderTopWidth: 1, borderColor: 'gray', padding: 8 }}>
                  {[
                    { label: 'STT', value: index + 1, fontWeight: '700', color: colors.black },
                    { label: 'Mã Vận Đơn', value: item.shippingCode, fontWeight: '700', color: colors.black },
                    { label: 'MĐH', value: item.identify, fontWeight: '700', color: colors.black },
                    { label: 'Cân nặng', value: `${item.kg} kg`, fontWeight: '700', color: colors.black },
                    { label: 'Dài', value: `${item.long} m`, fontWeight: '500', color: colors.black },
                    { label: 'Rộng', value: `${item.wide} m`, fontWeight: '500', color: colors.black },
                    { label: 'Cao', value: `${item.high} m`, fontWeight: '700', color: colors.black },
                    { label: 'Cân quy đổi', value: `${item.kgChange} kg`, fontWeight: '700', color: colors.black },
                    { label: 'Cân tính tiền', value: `${item.kgPay} kg`, fontWeight: '700', color: colors.black },
                    { label: 'Tiền cân nặng', value: _func.getVND(item.kgFee, 'đ'), fontWeight: '700', color: colors.primary },
                    { label: 'Ghi chú', value: item.note != null ? item.note : "", fontWeight: '700', color: colors.black },
                  ].map(({ label, value, fontWeight, color }: any) => (
                    <View style={styles.ctnPackingListText} key={label}>
                      <Text style={styles.packingListText}>{label}: </Text>
                      {/* <TouchableOpacity onPress={() => label === "Mã Vận Đơn" && Clipboard.setString(item.shippingCode)}>
                        <Text style={[styles.packingListText, { fontWeight, color }]}>{value}</Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onLongPress={() => (label === "Mã Vận Đơn" || label === "MĐH") && handleLongPress(label) }
                        style={styles.containerCopy}
                        >
                        <Text style={[styles.packingListText, { fontWeight, color }]}>{value || "--"}</Text>
                      </TouchableOpacity>

                      {showCopyButton === label  && (
                        <TouchableOpacity style={styles.copyButtonContainer} onPress={() => handleCopy(value)}>
                          <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )
            }
            }
            extraData={showCopyButton}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: scale(50) }} />}
          />
        }
      </View>
    </TouchableOpacity>
   </>
  )
}

export const DeliveryNoteScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [drop, setDrop] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [listStatus, setListStatus] = useState([]);
  const [status, setStatus] = useState('');
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [page, setPage] = useState({
    currentPgae: 1,
    nextPage: 1,
    lastPgae: 1
  });

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

  const fetchDeliveryData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        per_page: 20,
        status: status,
        start_date: startDate,
        end_date: endDate,
        order: 'desc'
      }
      const res = await deliveryNoteAPI.deliveryNote({ params });
      setDeliveryNote(res.data)
      setPage({
        currentPgae: res.meta.current_page,
        lastPgae: res.meta.last_page,
        nextPage: res.meta.current_page + 1
      });
      
    } catch (err) {
      console.log('Error: ', err)
    } finally {
      setLoading(false)
      setStatus(''),
      setStartDate('')
      setEndDate('')
    }

  }, [status, startDate, endDate])
  const fetchStatus = useCallback(async () => {
    try {
      const res = await deliveryNoteAPI.deliveryNoteStatus();
      const values = Object.entries(res.data).map(([key, value]) => ({
        label: value,
        value: key
      }));
      setListStatus(values)
    } catch (err) {
      console.log('Error: ', err)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchDeliveryData();
      await fetchStatus();
      setInitialLoading(false)
    }
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setStatus('')
    setStartDate('')
    setEndDate('')
    await fetchDeliveryData()
    await setTimeout(() => { }, 500)
    setRefreshing(false);
  }, [fetchDeliveryData]);

  const loadMoreData = async () => {
    if(page.nextPage <= page.lastPgae) {
      setLoading(true);
      try {
        const params = { per_page: 20,
          status: status,
          start_date: startDate,
          end_date: endDate,
          order: 'desc' };
        const data = await deliveryNoteAPI.deliveryNotePage({ params }, page.nextPage);
        setPage((prev) => ({
          ...prev,
          currentPgae: data.meta.current_page,
          nextPage: data.meta.current_page + 1
        }));
        setDeliveryNote((prev) => ([...prev, ...data.data]));
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
  }
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

  return (
    <DefaultLayout
      isShowBottomTab={false}
      screenTitle='Danh sách phiếu xuất kho'
      iconRight={true}
      showTextRight="Bộ lọc"
      onPressIconRight={() => setDrop(!drop)}
      icon={<FeatherIcon name="filter" size={16} color="#000" />}
    >
      {initialLoading ? <LoadingLottie /> : (
        <View style={{ flex: 1 }}>
          {!drop && (
            <>
              <DateInput onDateChange={handleStartDateChange} placeholder="Từ ngày" />
              <DateInput onDateChange={handleEndDateChange} placeholder="Đến ngày" />
              <View style={styles.pickerStyles}>
                <RNPickerSelect onValueChange={setStatus} items={listStatus} style={{ inputAndroid: styles.inputAndroid }} />
              </View>
              <ButtonCus
                isLoading={loading}
                onPress={fetchDeliveryData}
                name="Tìm kiếm"
                buttonStyle={{ marginTop: 0 }}
                textStyle={{ color: "#fff" }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setDrop(!drop)} style={{ width: "100%", alignItems: 'flex-end', marginBottom: scale(10) }}>
                <MaterialCommunityIcon name={!drop ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'} style={styles.icon} />
              </TouchableOpacity>
            </>
          )}
          <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={deliveryNote}
            renderItem={({ item, index }) => <RenderItem index={index} item={item} />}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={<View style={{ height: scale(50) }} />}
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
    top: -20,  // Căn chỉnh vị trí của nút copy
    right: 0, // Căn chỉnh vị trí của nút copy
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 100,
    elevation: 3, // Đổ bóng cho Android
  },
  copyButtonText: {
    color: 'white',
    paddingHorizontal: 6,
    fontWeight: 'bold',
  },
});
