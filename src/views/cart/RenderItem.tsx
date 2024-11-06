import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { cartAPI } from '~/api';
import { _func, colors } from '~/utils';

export const RenderItem = ({ shopId, item, index, checked: initialChecked, fetchData, updateItemChecked, setNoteProduct, noteProduct }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [note, setNote] = useState(noteProduct[index] || '');
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);


  const updateCart = async (updatedFields) => {
    try {
      const res = await cartAPI.updateCart({
        id: item.id,
        type: 1,
        checked: updatedFields.is_check !== undefined ? updatedFields.is_check : (checked ? 1 : 0),
        quantity: updatedFields.qty !== undefined ? updatedFields.qty : quantity,
        // noteProduct: updatedFields.desc !== undefined ? updatedFields.desc : note,
      });
      // const res = await cartAPI.updateCart({
      //   id: item.id,
      //   type: 1,
      //   is_check: updatedFields.is_check !== undefined ? updatedFields.is_check : (checked ? 1 : 0),
      //   qty: updatedFields.qty !== undefined ? updatedFields.qty : quantity,
      //   desc: updatedFields.desc !== undefined ? updatedFields.desc : note,
      // });
      
      if (res.success) {
        fetchData();
      }
      
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  


  const toggleCheckbox = async () => {
    const newCheckedStatus = checked ? 0 : 1;
    setChecked(!checked);
    updateItemChecked(shopId, item.id, newCheckedStatus);
    await updateCart({ checked: newCheckedStatus });
  };

  const increaseQuantity = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await updateCart({ qty: newQuantity });
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      await updateCart({ qty: newQuantity });
    }
  };

  // const handleNoteUpdate = async () => {
  //   // await updateCart({ desc: note });
  //   setNote(noteProduct[index]);
  //   console.log(noteProduct[index]);
  //   const newArray = [...noteProduct];
  //   newArray[index] = noteProduct[index]; // cập nhật phần tử thứ 5
  //   console.log('handleNoteUpdate: ', newArray);
  //   setNoteProduct(newArray)
    
  // };
  const handleNoteUpdate = (text) => {
    const newArray = [...noteProduct];
    newArray[index] = text; // cập nhật phần tử theo index
    setNoteProduct(newArray); // cập nhật lại mảng `noteProduct` ở component cha
  };

  const handleDeleteItem = async () => {
    Alert.alert("Thông báo ", "Bạn có chắc chắn muốn xóa không?", [
      {
        text: "Không!",
      },
      {
        text: "Có!",
        onPress: async () => {
          try {
            const res = await cartAPI.deleteItem({ id: item.id });
            if (res.success) {
              fetchData();
            }
          } catch (error) {
            console.error('Error deleting item:', error);
          }
        },
      }
    ])
  };

  return (
    <View
      // onPress={() => Linking.openURL(item.link)}
      style={styles.container}>
      <TouchableOpacity style={styles.productContainer}>
        <TouchableOpacity
          onPress={toggleCheckbox}
          style={styles.checkbox}
        >
          {checked && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>

        <Image source={{ uri: _func.addDomainToImage(item.image) }} style={styles.image} />
        <View style={styles.productDetails}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(item.link)}>
            <Text style={styles.productTitle} numberOfLines={3}>
              {item.title}
            </Text>
          </TouchableOpacity>
          <Text style={styles.productSize} numberOfLines={3}>
            Kích thước:
            <Text style={[styles.productSize, { color: colors.textSuccess, fontWeight: 'bold' }]}>
              {item.size}
            </Text>
          </Text>
          <Text style={styles.productSize} numberOfLines={3}>
            Màu sắc:
            <Text style={[styles.productSize, { color: colors.textSuccess, fontWeight: 'bold' }]}>
              {item.color}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>

      <TextInput
        value={noteProduct[index]}
        style={[styles.noteInput, { opacity: checked ? 0.7 : 1 }]}
        onChangeText={handleNoteUpdate} // truyền trực tiếp `text` từ `TextInput`
        placeholder="Ghi chú cho sản phẩm"
        placeholderTextColor="#c0c0c0"
      />

      <View style={styles.orderDetails}>
        <View
          style={[styles.quantityContainer, { opacity: checked ? 0.7 : 1 }]}
        >
          <Text style={styles.productSize}>Số lượng: </Text>
          <TouchableOpacity
            onPress={decreaseQuantity}
            style={styles.quantityButton}
            // disabled={checked}
          >
            <Text style={styles.productSize}>-</Text>
          </TouchableOpacity>
          <Text style={styles.productSize}>{quantity}</Text>
          <TouchableOpacity
            onPress={increaseQuantity}
            style={styles.quantityButton}
            // disabled={checked}
          >
            <Text style={styles.productSize}>+</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.productSize}>
            Thành tiền(¥):{' '}
            <Text style={[styles.totalPrice, { color: colors.black, fontWeight: 'bold' }]}>
              {item.totalPrice}¥
            </Text>{' '}
            ={' '}
            <Text style={[styles.totalPrice, { fontWeight: 'bold' }]}>
              {_func.getVND(item.totalPriceVn, 'đ')}
            </Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleDeleteItem} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={{ color: colors.background }}>Xóa đơn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: '12@s',
    marginBottom: '16@s',
    backgroundColor: '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8@s',
  },
  checkbox: {
    width: '20@s',
    height: '20@s',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '16@s',
  },
  checkboxChecked: {
    width: '12@s',
    height: '12@s',
    backgroundColor: colors.success,
  },
  image: {
    width: '100@s',
    height: '100@s',
    marginRight: '16@s',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: '14@s',
    fontWeight: 'bold',
    color: colors.textCart,
  },
  productSize: {
    fontSize: '14@s',
    color: colors.black,
    fontWeight: '500',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: '8@s',
    padding: '8@s',
    marginBottom: '8@s',
    color: colors.black,
    fontSize: '14@s',
  },
  orderDetails: {
    marginBottom: '8@s',
    gap: '5@s',
  },
  totalPrice: {
    color: 'red',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8@s',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: '8@s',
    padding: '8@s',
    marginHorizontal: '8@s',
  },
  actionButton: {
    padding: '10@s',
    backgroundColor: '#ccc',
    borderRadius: '5@s',
    margin: '5@s',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
  },
});
