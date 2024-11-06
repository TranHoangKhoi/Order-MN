import {
    StatusBar,
    Modal,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    TextInput,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { colors } from '~/utils';
const { height } = Dimensions.get('window');

const RenderItem = ({
    item,
    dataAll,
    index,
    data1688,
    noteInputState,
    priceStep,
    setNumberData,
}) => {
    const [defaultValueChild, sDefaultValueChild] = useState(0);
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(dataAll);
    }, []);

    const increaseNum = (index, max) => {
        setData(prevData => {
            const newData = [...prevData];
            if (newData[index].quantity < max) {
                // console.log(newData[index].quantity);
                newData[index].quantity += 1;
            }
            return newData;
        });

        sDefaultValueChild((prev: any) => {
            if (parseInt(prev) < parseInt(max)) {
                const newValue = parseInt(prev) + 1;
                return newValue;
            } else {
                return defaultValueChild;
            }
        });
    };

    const decreaseNum = index => {
        setData(prevData => {
            const newData = [...prevData];
            if (newData[index].quantity > 0) {
                newData[index].quantity -= 1;
            }
            return newData;
        });

        sDefaultValueChild((prev: any) => {
            if (parseInt(prev) > 0) {
                const newValue = parseInt(prev) - 1;
                return newValue;
            } else {
                return defaultValueChild;
            }
        });
    };

    const handleInputQuality = (val, index) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[index].quantity = parseInt(val);
            return newData;
        });
        sDefaultValueChild(val);
    };

    const dataQuantity = data.filter(i => i.quantity > 0);

    useEffect(() => {
        if (dataQuantity.length > 0) {
            setNumberData(
                dataQuantity.map(item => {
                    // console.log('dataQuantity', dataQuantity);
                    const data = {
                        OrderTempID: '',
                        productId: data1688?.tempModel?.offerId || '',
                        ProductName: data1688?.tempModel?.offerTitle || '',
                        Image: item?.imageUrl || data1688?.tempModel?.defaultOfferImg,
                        LinkProduct: data1688?.linkOrigin,
                        Property: item?.Property || data1688?.Property,
                        Brand: noteInputState?.value || '',
                        Quantity: item?.quantity,
                        ProviderID: data1688?.tempModel?.sellerUserId || '',
                        ProviderName: data1688.tempModel.companyName || '',
                        PriceCNY: item?.price || priceStep[0]?.PriceText,
                        PropertyValue: item?.skuId || '',
                        stock: item?.canBookCount || '',
                        pricestep: data1688?.priceStepData || '',
                        specAttrs: item?.specAttrs,
                    };
                    return data;
                }),
            );
        } else {
            setNumberData([]);
        }
    }, [defaultValueChild]);

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 12,
                }}>
                {!!item.imageUrl && (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ height: 46, width: 46, borderRadius: 5, marginRight: 8 }}
                        resizeMode="cover"
                    />
                )}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#000',
                        }}>
                        {item.specAttrs}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: 'rgba(0, 0, 0, 0.5)',
                        }}>
                        库存: {item.canBookCount}
                    </Text>
                </View>
                {parseInt(item.canBookCount) > 0 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 5,
                            borderColor: 'rgba(0,0,0,0.3)',
                            borderWidth: 1,
                            height: 28,
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => decreaseNum(index)}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                borderRightWidth: 1,
                                borderColor: 'rgba(0,0,0,0.3)',
                            }}>
                            <Ionicons name="remove" color="#000" size={16} />
                        </TouchableOpacity>
                        <TextInput
                            style={{
                                fontSize: 14,
                                color: '#000',
                                width: 50,
                                textAlign: 'center',
                                padding: 0,
                            }}
                            keyboardType="numeric"
                            value={defaultValueChild.toString()}
                            onChangeText={val => handleInputQuality(val, index)}
                        />
                        <TouchableOpacity
                            onPress={() => increaseNum(index, item.canBookCount)}
                            activeOpacity={0.9}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                borderLeftWidth: 1,
                                borderColor: 'rgba(0,0,0,0.3)',
                            }}>
                            <Ionicons name="add" color="#000" size={16} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text
                        style={{
                            fontSize: 16,
                            color: 'rgba(0, 0, 0, 0.5)',
                            textAlign: 'center',
                            width: 100,
                        }}>
                        缺货
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

const Modal1688 = ({
    cartState,
    filter,
    setFilter,
    data1688,
    priceStep,
    Array1688,
    extendInfo,
    noteInputState,
    ApiCall_addToCart,
    setAtc_Loading,
}) => {
    const [NumberData, setNumberData] = useState([]);

    const getVND = (price, suffix = ' VNĐ') => {
        if (price === null) return 0;

        if (Number.isInteger(price)) {
            return (
                (price?.toString() || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                suffix
            );
        }
        return price + suffix;
    };

    const Quantity = NumberData.map(item => item.Quantity);

    const totalQuantity = Quantity.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );

    let price = 0;
    for (const item of priceStep) {
        const unitText = item.unitText;
        const regex = /(\d+)/g;
        const quantity = parseInt(unitText.match(regex)[0]);

        if (totalQuantity >= quantity) {
            price = totalQuantity * parseFloat(item.PriceText);
        } else {
            break;
        }
    }

    const arr = data1688?.skuModel?.skuPriceScale || '';
    const cleaned_string = arr.replace('￥', '');
    const index_string =
        totalQuantity * parseFloat(cleaned_string.split('-')[0] || 0);

    return (
        <Modal
            visible={filter}
            animationType="slide"
            transparent={true}
            statusBarTranslucent={false}>
            <StatusBar backgroundColor={'rgba(0,0,0,0.7)'} />
            <TouchableOpacity
                onPress={() => {
                    setFilter(false);
                    setNumberData([]);
                }}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    flex: 1,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flex: 1,
                    width: '100%',
                    backgroundColor: '#F4F4F4',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}>
                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        width: '100%',
                    }}>
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '100%',
                            flex: 1,
                        }}>
                        {priceStep.length > 0 ? (
                            priceStep.map(item => {
                                return (
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 16,
                                            marginTop: 16,
                                        }} key={item.unitText}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: '#000',
                                                marginLeft: 8,
                                                fontWeight: '700',
                                            }}>
                                            ¥ {item.PriceText}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: 'rgba(0, 0, 0, 0.5)',
                                                marginLeft: 8,
                                            }}>
                                            {item.unitText}
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#000',
                                        marginLeft: 8,
                                        fontWeight: '700',
                                    }}>
                                    {data1688?.skuModel?.skuPriceScale || ''}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: 'rgba(0, 0, 0, 0.5)',
                                        marginLeft: 8,
                                    }}>
                                    {extendInfo || ''}
                                </Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            setFilter(false);
                            setNumberData([]);
                        }}
                        style={{ marginTop: 8 }}>
                        <Icon type={'Feather'} name={'x'} size={20} color={'#000'} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: height / 2 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#000',
                                    marginBottom: 16,
                                    fontWeight: '700',
                                }}>
                                {!!data1688?.skuModel?.skuProps
                                    ? data1688?.skuModel?.skuProps[0]?.prop
                                    : ''}
                            </Text>
                        }
                        numColumns={1}
                        data={Array1688 || []}
                        renderItem={({ item, index }) => (
                            <RenderItem
                                item={item}
                                dataAll={Array1688}
                                index={index}
                                data1688={data1688}
                                noteInputState={noteInputState}
                                priceStep={priceStep}
                                setNumberData={setNumberData}
                            />
                        )}
                        keyExtractor={item => {
                            return item.specId;
                        }}
                        style={{
                            backgroundColor: '#fff',
                            margin: 8,
                            padding: 12,
                            borderRadius: 5,
                            paddingBottom: 50,
                        }}
                    />
                </View>
                <View style={{ height: 50 }} />
                <View
                    style={{
                        backgroundColor: '#fff',
                        padding: 12,
                        paddingBottom: 30,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text
                                style={{
                                    color: '#000',
                                    fontSize: 12,
                                    fontWeight: '600',
                                }}>
                                数量:{' '}
                                <Text
                                    style={{
                                        color: colors.primary,
                                        fontSize: 16,
                                        fontWeight: '600',
                                    }}>
                                    {getVND(totalQuantity.toFixed(2), '')}
                                </Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text
                                style={{
                                    color: '#000',
                                    fontSize: 12,
                                    fontWeight: '600',
                                }}>
                                按数量定价:{' '}
                                <Text
                                    style={{
                                        color: colors.primary,
                                        fontSize: 12,
                                        fontWeight: '600',
                                    }}>
                                    ￥
                                </Text>
                                <Text
                                    style={{
                                        color: colors.primary,
                                        fontSize: 18,
                                        fontWeight: '600',
                                    }}>
                                    {priceStep.length > 0
                                        ? getVND(price.toFixed(2) || 0, '')
                                        : getVND(index_string.toFixed(2) || 0, '')}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            let success = true;
                            // console.log("NumberData: ", NumberData);
                            
                            if (NumberData.length > 0) {
                                setFilter(false);
                                setAtc_Loading(true);
                                try {
                                    if (totalQuantity <= 0) {
                                        Alert.alert('Thông Báo', 'Sản phẩm phẩm đã hết hàng');
                                    } else {
                                        for (const item of NumberData) {
                                            console.log('item Data: ', item);
                                            await ApiCall_addToCart({ ...item });
                                        }
                                    }
                                } catch (error) {
                                    success = false;
                                }
                                setAtc_Loading(false);
                                if (success) {
                                    setNumberData([]);
                                    cartState?.setData(NumberData);
                                }
                            } else {
                                Alert.alert('Thông Báo', 'Vui lòng chọn sản phẩm');
                                setNumberData([]);
                            }
                        }}
                        style={{
                            backgroundColor: colors.primary,
                            height: 46,
                            borderRadius: 99,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 16,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#ffff',
                            }}>
                            Đặt hàng
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default Modal1688;
