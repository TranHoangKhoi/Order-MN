import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { DefaultLayout } from '~/layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors } from '~/utils';
import { launchImageLibrary } from 'react-native-image-picker';
import { MaterialCommunityIcon, MaterialIcons } from '~/components';

const ProductItem = ({ product, index, updateProductImage, removeProduct, hanldeChangeDataProduct }) => {
  const handleImageUpload = () => updateProductImage(index);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.ctnInput, { borderTopWidth: index === 0 ? 0 : 1 }]}>
        {index > 0 &&
          <View style={styles.ctnDeleteButton}>
            <TouchableOpacity
              onPress={() => removeProduct(index)}
              style={styles.deleteButton}
            >
              <MaterialIcons size={30} color="red" name='cancel' />
            </TouchableOpacity>
          </View>
        }
        <TextInput placeholder={`Đơn hàng :  ${index + 1}`} editable={false} style={styles.input} placeholderTextColor={"#000"} />
        <TextInput placeholder="Tên shop" value={product.shopName} onChangeText={(text) => hanldeChangeDataProduct(text, index, 'shopName')} style={styles.input} />
        <TextInput placeholder="Link sản phẩm" value={product.productLink} style={styles.input} />
        <TextInput placeholder="Tên sản phẩm" value={product.productName} style={styles.input} />
        <TextInput placeholder="Màu sắc" value={product.color} style={styles.input} />
        <TextInput placeholder="Kích thước" value={product.size} style={styles.input} />
        <TextInput placeholder="Số lượng" value={product.quantity} style={styles.input} />
        <TextInput placeholder="Đơn giá" value={product.price} style={styles.input} />
        <TextInput placeholder="Ghi chú" value={product.notes} style={styles.input} />
        <View style={styles.uploadImage}>
          <TouchableOpacity style={styles.btnUpload} onPress={handleImageUpload}>
            <Text style={styles.txtUpload}>Tải ảnh sản phẩm</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: scale(16) }}>
          {product.image &&
            <Image
              source={{ uri: product.image.uri }}
              resizeMode='cover'
              style={styles.image}
            />
          }
        </View>
      </View>
    </View>
  );
};



export const OrderCreate = () => {
  const [products, setProducts] = useState([
    { shopName: '', productLink: '', productName: '', color: '', size: '', quantity: '', price: '', notes: '', image: null }
  ]);

  const addNewProduct = useCallback(() => {
    setProducts(currentProducts => [
      ...currentProducts,
      { shopName: '', productLink: '', productName: '', color: '', size: '', quantity: '', price: '', notes: '', image: null }
    ]);
  }, []);

  const handleImageUpload = useCallback((index) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel) {
        const newProducts = [...products];
        newProducts[index].image = response.assets[0];
        setProducts(newProducts);
      }
    });
  }, [products]);

  const removeProduct = useCallback((index) => {
    setProducts(currentProducts => currentProducts.filter((_, i) => i !== index));
  }, []);

  const [showBTN, setShowBTN] = useState(true)

  const handleChangeDataProduct = (data, index, label) => {
    console.log('Data: ', data);
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts]; // Tạo một bản sao của mảng
      updatedProducts[index] = { ...updatedProducts[index], [label]: data }; // Cập nhật phần tử thứ 0 với key động
      console.log("updatedProducts: ", updatedProducts);
      
      return updatedProducts;
    });
  };

  useEffect(() => {
    // console.log("products: ", products);
  }, products)

  return (
    <DefaultLayout isShowBottomTab={true} screenTitle='Tạo đơn hàng'>
      <ScrollView>
        {products.map((product, index) => (
          <ProductItem
            key={index}
            product={product}
            index={index}
            hanldeChangeDataProduct={handleChangeDataProduct}
            updateProductImage={handleImageUpload}
            removeProduct={removeProduct}
          />
        ))}
        <View style={{ height: scale(50) }} />
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowBTN(!showBTN)}
        style={{
          alignItems: 'flex-end',
          paddingHorizontal: scale(16)
        }}>
        <MaterialCommunityIcon
          name={showBTN ? 'arrow-down-drop-circle' : "arrow-up-drop-circle"}
          size={25}
          color={colors.primary}
        />
      </TouchableOpacity>
      {showBTN && <>
        <View style={styles.ctnButton}>
          <TouchableOpacity style={styles.btnAdd} onPress={addNewProduct}>
            <Text style={styles.txtAdd}>+Thêm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ctnButton}>
          <TouchableOpacity style={styles.btnAddCart}>
            <Text style={styles.txtAdd}>Thêm giỏ hàng</Text>
          </TouchableOpacity>
          <Ionicons name="cart" color="#000" size={20} style={styles.icon} />
        </View>
      </>}
    </DefaultLayout>
  );
};

const styles = ScaledSheet.create({
  ctnInput: {
    flex: 1,
    marginHorizontal: "16@s",
    borderColor: 'gray',
  },
  ctnButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: "16@s"
  },
  btnAdd: {
    backgroundColor: '#FF9900',
    height: "40@s",
    width: '100%',
    marginTop: "10@s",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  btnAddCart: {
    backgroundColor: colors.primary,
    height: "40@s",
    width: '100%',
    marginTop: "10@s",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  txtAdd: {
    color: 'white'
  },
  icon: {
    position: 'absolute',
    color: 'white',
    top: "20@s",
    left: "90@s"
  },
  input: {
    height: "40@s",
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: "10@s",
    padding: "10@s",
    borderRadius: "4@s",
    color: colors.black,
  },
  uploadImage: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: "16@s"
  },
  image: {
    width: "150@s",
    height: "150@s"
  },
  btnUpload: {
    height: "40@s",
    backgroundColor: "#3182C1",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: "4@s"
  },
  txtUpload: {
    color: 'white',
    fontWeight: 'bold'
  },
  ctnDeleteButton: {

  },
  deleteButton: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingVertical: "8@s"
  },
});
