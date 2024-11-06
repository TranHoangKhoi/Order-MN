import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { trackingAPI } from '~/api/tracking';
import { ButtonCus, TextCom } from '~/components';
import { shadowStyle } from '~/styles';
import { colors } from '~/utils';

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

const TimelineItem = ({ label, date }) => {
  return (
    <>
    {date !== null ? (<View style={styles.itemContainer}>
      {/* Circle icon */}
      <View style={styles.circleContainer}>
        <View style={styles.lineCircle}></View>
        <View style={styles.circle} />
      </View>

      {/* Nội dung */}
      <View style={styles.contentContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>) : <></>}
    </>
  );
};

export const SearchCode = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleTrack = async () => {
    try {
      const params = { code: trackingNumber }
      const data = await trackingAPI.trackingCode({ params })
      console.log("Data tracking: ", data.dateVn === null && data.dateTQ === null)
      setData(data.data.data)
      setLoading(false)
    } catch (err) {
      console.log("Error fetching tracking: ", err)
      setLoading(false)
      setData(null)
    }
    // Linking.openURL(`https://vanchuyenminhtan.com/theo-doi-van-don?code=${trackingNumber}`)
    // console.log(`Tracking number: ${trackingNumber}`);
  };

  

  return (
    <View style={styles.container}>
      <TextCom
        text='THEO DÕI VẬN ĐƠN'
        overrideStyle={styles.header}
      />
      <TextInput
        style={styles.input}
        value={trackingNumber}
        onChangeText={setTrackingNumber}
        placeholder="Nhập mã vận đơn (Vd: 12312321): "
        placeholderTextColor={"#c0c0c0"}
      />
      <ButtonCus
        name="Tra cứu"
        onPress={handleTrack}
        textStyle={{ color: colors.background }}
      />
      <View>
        {loading ?
          (<Text>Loading...</Text>)
          :
          data
            ? (
              <>
                <View style={[styles.trackingList, shadowStyle.black]}>
                  {
                    [
                      { label: 'Mã vận đơn', value: data.transferID },
                      { label: 'Mã KH', value: data.username },
                      { label: 'Trạng thái', value: getStatusText(data.shipStatus) },
                      { label: 'Ngày', value: data.createDate },
                      { label: 'Cân nặng', value: data.kg },
                      { label: 'Số lượng', value: data.quantity },
                      { label: 'Ghi chú', value: data.note !== 'null' ? data.note : '' },
                    ].map(({ label, value }: any) => (
                      <View style={styles.ctnTrackingText} key={label}>
                        <Text style={{ color: "#000", fontSize: 14 }}>{label}: </Text>
                        <Text style={{ color: "#000", fontSize: 14 }}>{value}</Text>
                      </View>
                    ))
                  }
                </View>
                
                
                <View style={[styles.trackingList, shadowStyle.black]}>
                  <TimelineItem label="Nhập kho VN" date={data.dateVn} />
                  <TimelineItem label='Nhập kho TQ' date={data.dateTq} />
                  {(data.dateVn == null && data.dateTQ == null) && (
                  <View style={{alignItems: 'center', justifyContent: 'center', padding: 10}}>
                    <Text style={{color: '#333'}}>Thông tin đang được cập nhật !</Text>
                  </View>
                )}
                </View>
              </>
            )
            : (<Text>No Data</Text>)}
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: "20@s",
  },
  ctnTrackingText: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '5@s',
    justifyContent: 'space-between',
  },
  trackingList: {
    padding: '14@s',
    borderColor: 'gray',
    borderRadius: '5@s',
    backgroundColor: colors.background,
    borderWidth: 0.7,
    marginBottom: '10@s',
  },
  header: {
    fontSize: "18@s",
    fontWeight: '600',
    marginBottom: "20@s",
    color: colors.black
  },
  input: {
    width: '100%',
    padding: "10@s",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "5@s",
    color: colors.black,
    fontSize: "14@s"
  },

  // container: {
  //   padding: 16,
  //   backgroundColor: '#f2f2f2',
  //   borderRadius: 8,
  // },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // paddingBottom: 6,
    // paddingTop: 6,
  },
  circleContainer: {
    height: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    position: 'relative'
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.background,
    // alignSelf: 'center',
    marginTop: 10,
  },
  lineCircle: {
    width: 1,
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 4,
    borderStyle: 'dotted'
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 6,
    marginTop: 6,
  },
  labelContainer: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
});
