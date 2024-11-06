import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { _func, colors } from '~/utils';
import { RenderItem } from './RenderItem';
import { ScaledSheet } from 'react-native-size-matters';
import { cartAPI } from '~/api';

export const RenderShopItem = ({ shop, index, fetchData, setState }) => {
  const [insuranceChecked, setInsuranceChecked] = useState(false);
  const [saleChecked, setSaleChecked] = useState(false);
  const [packingChecked, setPackingChecked] = useState(false);
  const [countChecked, setCountChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Tận Nhà HCM hoặc Miền Nam hoặc Miền Tây");
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [noteProduct, setNoteProduct] = useState([]);

  useEffect(() => {
    if (shop?.items) {
      // Tạo một mảng mới với các giá trị `noteProduct` từ các item
      const initialNotes = shop.items.map(item => item.noteProduct || '');
      setNoteProduct(initialNotes);
    }
  }, [shop?.items]);

  const handleDeleteShop = async () => {
    Alert.alert("Thông báo ", "Bạn có chắc chắn muốn xóa shop này không?", [
      {
        text: "Không!",
      },
      {
        text: "Có!",
        onPress: async () => {
          try {
            const res = await cartAPI.deleteShop({ id: shop.shop_id });
            if (res.success) {
              fetchData();
            }
          } catch (err) {
            console.log('Error: ', err);
          }
        }
      },
    ])
  };

  const handleSendOrder = async () => {
    const newShop = {
      ...shop,
      items: shop.items.map((item, index) => ({
        ...item,
        noteProduct: noteProduct[index]
      }))
    };
    console.log("newShop:", newShop);
  };

  const toggleShopSelection = () => {
    const allChecked = shop.items.every(item => item.checked === 1);

    setState(prev => {
      const updatedData = prev.fetchCartData.map(currentShop => {
        if (currentShop.shop_id === shop.shop_id) {
          return {
            ...currentShop,
            items: currentShop.items.map(item => ({
              ...item,
              checked: allChecked ? 0 : 1,
            })),
          };
        }
        return currentShop;
      });

      const allItemsChecked = updatedData.every(shop => shop.items.every(item => item.checked === 1));

      return {
        ...prev,
        fetchCartData: updatedData,
        selectAll: allItemsChecked,
      };
    });
  };

  const updateItemChecked = (shopId, itemId, checked) => {
    setState(prevState => {
      const updatedData = prevState.fetchCartData.map(shop => {
        if (shop.shop_id === shopId) {
          return {
            ...shop,
            items: shop.items.map(item =>
              item.id === itemId ? { ...item, checked } : item
            ),
          };
        }
        return shop;
      });

      const allItemsChecked = updatedData.every(shop =>
        shop.items.every(item => item.checked === 1)
      );

      return {
        ...prevState,
        fetchCartData: updatedData,
        selectAll: allItemsChecked,
      };
    });
  };

  const totalPrice = shop.items.reduce((acc, item) => acc + (item.checked ? item.totalPrice * item.quantity : 0), 0);
  const totalQuantity = shop.items.reduce((acc, item) => acc + (item.checked ? item.quantity : 0), 0);

  return (
    <View style={styles.shopContainer} >
      <View style={styles.shopHeader}>
        <TouchableOpacity onPress={toggleShopSelection} style={styles.checkbox}>
          {shop.items.every(item => item.checked === 1) && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>
        <Text style={styles.shopName}>Shop: {index + 1} - {shop.shop_name}</Text>
      </View>

      {shop.items.map((item, index) => {
        return (<RenderItem
          key={item.id}
          item={item}
          index={index}
          shopId={shop.shop_id}
          fetchData={fetchData}
          updateItemChecked={updateItemChecked}
          checked={item.checked === 1}
          setNoteProduct={setNoteProduct}
          noteProduct={noteProduct}
        />)
      })}

      <View style={styles.orderDetails}>
        <Text style={styles.text}>Số lượng: {totalQuantity}</Text>
        <Text style={styles.text}>Phi kiểm đếm: 0 đ</Text>
        <Text style={styles.text}>Phi đóng gói: 0 đ</Text>
        <Text style={styles.totalPrice}>Tổng Tiền: {totalPrice}¥ = {_func.getVND(totalPrice * 3560, 'đ')}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.picker}>
          <Text>{selectedValue}</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => { setSelectedValue("Tận Nhà HCM hoặc Miền Nam hoặc Miền Tây"); setModalVisible(false); }}>
                <Text style={styles.modalItem}>Tận Nhà HCM hoặc Miền Nam hoặc Miền Tây</Text>
              </TouchableOpacity>
              <Button title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      <TextInput
        style={styles.addressInput}
        placeholder="Địa chỉ"
        placeholderTextColor={"#c0c0c0"}
        value={address}
        onChangeText={(e) => setAddress(e)}
      />
      <TextInput
        style={styles.orderNoteInput}
        placeholder="Ghi chú đơn hàng cho hệ thống order"
        placeholderTextColor={"#c0c0c0"}
        value={note}
        onChangeText={(e) => setNote(e)}
      />
      <TextInput
        style={styles.customerNoteInput}
        placeholder="Ghi chú đơn hàng cá nhân"
        placeholderTextColor={"#c0c0c0"}
      />
      <View style={styles.checkboxContainer}>
        <View style={styles.checkBox}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setInsuranceChecked(!insuranceChecked)}>
            {insuranceChecked && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.text}>Phí bảo hiểm</Text>
        </View>
        <View style={styles.checkBox}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setSaleChecked(!saleChecked)}>
            {saleChecked && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.text}>Săn sale</Text>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkBox}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setPackingChecked(!packingChecked)}>
            {packingChecked && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.text}>Đóng gói</Text>
        </View>
        <View style={styles.checkBox}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setCountChecked(!countChecked)}>
            {countChecked && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.text}>Kiểm đếm</Text>
        </View>
      </View>
      <View style={styles.shopActions}>
        <Button title="Xóa shop" color="red" onPress={handleDeleteShop} />
        <Button title="Gửi đơn" color="blue" onPress={handleSendOrder} />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: "12@s",
    marginBottom: "16@s",
    backgroundColor: '#fff',
  },
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
    fontWeight: 'bold',
    flex: 1,
    color: colors.black
  },
  shopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: '14@s',
    fontWeight: '600'
  },
  text: {
    color: colors.black,
    fontSize: '14@s',
    fontWeight: '600'
  },
  picker: {
    height: "50@s",
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: "8@s",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: "80%",
    backgroundColor: '#fff',
    borderRadius: "8@s",
    padding: "16@s",
    alignItems: 'center',
  },
  modalItem: {
    paddingVertical: "10@s",
    paddingHorizontal: "20@s",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
    padding: "8@s",
    marginBottom: "8@s",
    color: colors.black,
    fontSize: "14@s"
  },
  orderNoteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
    padding: "8@s",
    marginBottom: "8@s",
    color: colors.black,
    fontSize: "14@s"
  },
  customerNoteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
    padding: "8@s",
    marginBottom: "8@s",
    color: colors.black,
    fontSize: "14@s"
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: "8@s",
    width: "100%",
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
