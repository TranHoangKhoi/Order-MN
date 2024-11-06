import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { _func, colors } from '~/utils';
import { shadowStyle } from '~/styles';
import { RenderItemOrder, StatusType } from './RenderItemOrder';
import Clipboard from '@react-native-clipboard/clipboard';

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
}

interface ShopItemProps {
  item: {
    checked: number;
    identify: string;
    id: string;
    totalQuantity: number;
    totalPaid: number;
    totalPayment: number;
    debtAmount: number;
    orderId: string;
    image: string;
    province_name: string;
    status: keyof typeof StatusType;
    paymentDate: string;
    index: number
  };
  setOrderData: React.Dispatch<React.SetStateAction<any[]>>;
  index: number
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onToggle }) => (
  <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
    {isChecked && <View style={styles.checkboxChecked} />}
  </TouchableOpacity>
);

export const RenderShopItemOrder = ({ item, setOrderData, index }: ShopItemProps) => {
  const [checked, setChecked] = useState(item.checked === 1);
  const [showCopyButton, setShowCopyButton] = useState(false);

  const toggleCheckbox = useCallback(() => {
    setChecked(prevChecked => {
      const newChecked = !prevChecked;
      setOrderData(prevData => prevData.map(dataItem =>
        dataItem.orderId === item.orderId ? { ...dataItem, checked: newChecked } : dataItem
      ));
      return newChecked;
    });
  }, [setOrderData, item.orderId]);

  const handleLongPress = () => {
    setShowCopyButton(true);
  };

  const handleOutsidePress = () => {
    if (showCopyButton) {
      setShowCopyButton(false);
    }
  };

  const handleCopy = async () => {
    Clipboard.setString(item.identify);
    setShowCopyButton(false);
    alert('Copied to clipboard!');
  };


  return (
    <View  style={[styles.shopContainer, shadowStyle.black]}>
      <TouchableOpacity onPress={handleOutsidePress} activeOpacity={1} style={styles.container}>
     
      <View style={styles.shopHeader}>
        <Checkbox isChecked={checked} onToggle={toggleCheckbox} />
        {/*  */}
          <View style={styles.container} pointerEvents='auto'>
            <TouchableOpacity onLongPress={handleLongPress}>
              <Text style={styles.shopName}>ID: {item.identify}</Text>
            </TouchableOpacity>

            {showCopyButton && (
              <TouchableOpacity style={styles.copyButtonContainer} onPress={handleCopy}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            )}
          </View>

        {/*  */}
      </View>

      <RenderItemOrder key={item.id} item={item} />
      <View style={styles.orderDetails}>
        <Text style={styles.title}>Số lượng:<Text style={styles.content}>{item.totalQuantity}</Text></Text>
        <Text style={styles.title}>Tổng tiền:<Text style={styles.content}>{_func.getVND(item.totalPaid)}</Text></Text>
        <Text style={styles.title}>Đặt cọc:<Text style={styles.content}>{_func.getVND(item.totalPayment)}</Text></Text>
        <Text style={styles.title}>Còn thiếu:<Text style={styles.content}>{_func.getVND(item.debtAmount)}</Text></Text>
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
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "8@s",
  },
  shopName: {
    fontSize: "16@s",
    fontWeight: '600',
    flex: 1,
    color: '#000'
  },
  title: {
    fontSize: "14@s",
    fontWeight: '600',
    flex: 1,
    color: 'gray'
  },
  content: {
    fontSize: "14@s",
    fontWeight: '600',
    flex: 1,
    color: colors.black
  },
  checkbox: {
    width: "20@s",
    height: "20@s",
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: "16@s",
  },
  checkboxChecked: {
    width: "12@s",
    height: "12@s",
    backgroundColor: colors.success,
  },
  orderDetails: {
    marginBottom: "8@s",
    gap: "5@s"
  },
  totalPrice: {
    color: 'red',
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
