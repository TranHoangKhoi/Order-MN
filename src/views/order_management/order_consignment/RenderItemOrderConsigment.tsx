import Clipboard from '@react-native-clipboard/clipboard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';

const StatusType = {
  NOT_SHIP: 0,
  DELIVERING: 2,
  WAREHOUSE_VN: 3,
  RETURNED: 5,
  SHIPPING_TO_WAREHOUSE: 10,
};

const getStatusText = (type) => {
  switch (type) {
    case StatusType.NOT_SHIP:
      return "Chưa ship";
    case StatusType.DELIVERING:
      return "Đang vận chuyển";
    case StatusType.WAREHOUSE_VN:
      return "Kho VN";
    case StatusType.RETURNED:
      return "Đã trả hàng";
    case StatusType.SHIPPING_TO_WAREHOUSE:
      return "Đang vận chuyển kho đích";
    default:
      return "Unknown Status";
  }
};

export const RenderItemOrderConsigment = ({ item, setShowCopyButton, showCopyButton }) => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();


  const handleLongPress = () => {
    setShowCopyButton(true);
    console.log("showCopyButton: ", showCopyButton);
  };

  const handleOutsidePress = () => {
    if (showCopyButton) {
      setShowCopyButton(false);
    }
  };

  const handleCopy = () => {
    Clipboard.setString(item.shippingCode);
    setShowCopyButton(false);
    alert('Copied to clipboard!'); 
  }


  return (
    <TouchableOpacity
      onPress={() => navigate('WebViewConsigment', { id: item.shippingCode })}
      style={styles.container}>
      <View style={styles.productContainer}>
        {item.image ? (
          <Image
            source={{ uri: _func.addDomainToImage(item.image) }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, { alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ color: '#fff' }}>No Image</Text>
          </View>
        )}
        <View style={styles.productDetails}>
          <Text style={styles.title}>Mã vận chuyển:
            <TouchableOpacity
              onLongPress={handleLongPress}
              style={styles.containerWraperCopy}
              // onPress={() => navigate('WebViewConsigment', { id: item.shippingCode })}
              >
              <Text style={{ color: "blue" }}>{item.shippingCode}</Text>
            </TouchableOpacity>
            {showCopyButton && (
              <TouchableOpacity style={styles.copyButtonContainer} onPress={handleCopy}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            )}
          </Text>
          <Text style={styles.title}>Tên sản phẩm: {item.productName}</Text>
          <Text style={styles.title}>Ngày khai báo: {_func.getShortVNDate(item.createDate)}</Text>
          <Text style={styles.title}>Tình trạng ship: <Text style={{ color: colors.primary }}>
            {getStatusText(item.shippingStatus)}
          </Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: "12@s",
    marginBottom: "16@s",
    backgroundColor: '#fff',
    position: 'relative',
  },
  title: {
    fontSize: "14@s",
    fontWeight: '600',
    color: '#000'
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
    backgroundColor: 'gray'
  },
  productDetails: {
    flex: 1,
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
  containerWraperCopy: {
    position: 'relative',
  }
});