import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { _func, colors } from '~/utils';
import { RenderItemOrderConsigment } from './RenderItemOrderConsigment'
import { ScaledSheet } from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';

export const RenderOrderConsignment = ({ item }) => {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [showCopyButtonSecond, setShowCopyButtonSecond] = useState(false);


  const handleLongPress = () => {
    setShowCopyButton(true);
  };

  const handleOutsidePress = () => {
    if (showCopyButton) {
      setShowCopyButton(false);
    }
    if (showCopyButtonSecond) {
      setShowCopyButtonSecond(false);
    }
  };

  const handleCopy = () => {
    Clipboard.setString(item.orderCode);
    setShowCopyButton(false);
    alert('Copied to clipboard!');
    
  };

  return (
    <View style={styles.shopContainer}>
      <TouchableOpacity onPress={handleOutsidePress} activeOpacity={1} style={styles.container}>

      
      <View style={styles.shopHeader}>
      <View style={styles.container} pointerEvents='auto'>
        <TouchableOpacity onLongPress={handleLongPress}>
        <Text style={styles.shopName}>Mã đơn hàng: {item.orderCode}</Text>
        </TouchableOpacity>

        {showCopyButton && (
          <TouchableOpacity style={styles.copyButtonContainer} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        )}
      </View>
        
      </View>
      <RenderItemOrderConsigment key={item.id} item={item} setShowCopyButton={setShowCopyButtonSecond} showCopyButton={showCopyButtonSecond} />
      <View style={styles.orderDetails}>
        <Text style={styles.title}>Cân nặng: <Text style={styles.content}>{item.weight}</Text></Text>
        <Text style={styles.title}>Số lượng: <Text style={styles.content}>{item.quantity}</Text></Text>
        <Text style={styles.title}>Đơn giá(CNY):<Text style={styles.content}> {item.price}</Text></Text>
        <Text style={styles.title}>Thành tiền: <Text style={styles.content}>{item.totalMoney}</Text></Text>
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  shopContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
    padding: "16@s",
    marginBottom: "16@s",
    backgroundColor: '#fff',
  },
  title: {
    fontSize: "14@s",
    fontWeight: '600',
    flex: 1,
    color: '#000'
  },
  content: {
    fontSize: "14@s",
    fontWeight: '600',
    flex: 1,
    color: "#000"
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "8@s",
  },
  shopName: {
    fontSize: "16@s",
    fontWeight: 'bold',
    flex: 1,
    color: '#000'
  },
  shopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetails: {
    marginBottom: "8@s",
    gap: "5@s"
  },
  container: {
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
