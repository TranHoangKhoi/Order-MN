import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, View, Text, TouchableOpacity, Alert } from 'react-native';
import { cartAPI } from '~/api/cart';
import { FeatherIcon, LoadingLottie, MaterialCommunityIcon, NullPageScreen } from '~/components';
import { DefaultLayout } from '~/layout';
import { _func, colors } from '~/utils';
import { FlashList } from '@shopify/flash-list';
import { RenderShopItem } from './RenderShopItem';
import { ScaledSheet } from 'react-native-size-matters';

interface CartItem {
  shop_id: number;
  shop_name: string;
  checked?: any;
  quantity: number;
  totalPrice: number;
  totalPriceVn: number;
}

interface ShopData {
  shop_id: number;
  shop_name: string;
  items: CartItem[];
}

interface CartState {
  refreshing: boolean;
  page: number;
  isLoading: boolean;
  fetchCartData: ShopData[];
  initialLoading: boolean;
  isHasMoreData: boolean;
  selectAll: boolean;
  showFilter: boolean;
}

const initialState: CartState = {
  refreshing: false,
  page: 1,
  isLoading: false,
  fetchCartData: [],
  initialLoading: true,
  isHasMoreData: false,
  selectAll: false,
  showFilter: false,
};

export const CartScreen = () => {
  const [state, setState] = useState<CartState>(initialState);

  const onRefresh = useCallback(async () => {
    setState(prev => ({ ...prev, page: 1, fetchCartData: [], initialLoading: true, refreshing: true }));
    await fetchData(1);
    setState(prev => ({ ...prev, refreshing: false, initialLoading: false }));
  }, []);

  const fetchData = async (pageNum: number) => {
    if (state.refreshing) return;
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const perPage = 99999;
      const res = await cartAPI.shoppingCart({ page: pageNum, per_page: perPage });

      const groupedData: ShopData[] | any = Object.values(res.cart).reduce((acc: ShopData[], items: CartItem[]) => {
        items.forEach(item => {
          const shop = acc.find(shop => shop.shop_id === item.shop_id);
          if (shop) {
            shop.items.push(item);
          } else {
            acc.push({ shop_id: item.shop_id, shop_name: item.shop_name, items: [item] });
          }
        });
        return acc;
      }, []);
      setState(prev => ({
        ...prev,
        isHasMoreData: pageNum * perPage < res.totalPages,
        fetchCartData: groupedData,
        isLoading: false,
        initialLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({ ...prev, isLoading: false, initialLoading: false }));
    }
  };

  const handleLoadMore = () => {
    if (state.isHasMoreData) {
      setState(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleSelectAll = () => {
    const newSelectAllState = !state.selectAll;

    setState(prev => ({
      ...prev,
      selectAll: newSelectAllState,
      fetchCartData: prev.fetchCartData.map(shop => ({
        ...shop,
        items: shop.items.map(item => ({
          ...item,
          checked: newSelectAllState ? 1 : 0,
        })),
      })),
    }));
  };

  useEffect(() => {
    fetchData(state.page);
  }, [state.page]);

  const calculateTotals = (fetchCartData, selectAll) => {
    const totalShops = fetchCartData.filter(shop => shop.items.some(item => item.checked)).length;
    const totalItems = fetchCartData.reduce((acc, shop) =>
      acc + shop.items.reduce((acc, item) => acc + (item.checked ? item.quantity : 0), 0), 0);
    const totalPriceYuan = fetchCartData.reduce((acc, shop) =>
      acc + shop.items.reduce((acc, item) => acc + (item.checked ? item.totalPrice * item.quantity : 0), 0), 0);
    const totalPriceVND = fetchCartData.reduce((acc, shop) =>
      acc + shop.items.reduce((acc, item) => acc + (item.checked ? item.totalPriceVn * item.quantity : 0), 0), 0);

    return { totalShops, totalItems, totalPriceYuan, totalPriceVND };
  };

  const totals = useMemo(() => calculateTotals(state.fetchCartData, state.selectAll), [state.fetchCartData, state.selectAll]);

  const handleDeleteAll = async () => {
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa tất cả các không?",
      [
        { text: "Không" },
        {
          text: "Có",
          onPress: async () => {
            try {
              for (const shop of state.fetchCartData) {
                await cartAPI.deleteShop({ id: shop.shop_id });
              }
              setState(prev => ({ ...prev, fetchCartData: [] }));
            } catch (error) {
              console.error('Error deleting all shops:', error);
            }
          },
        },
      ]
    );
  };


  return (
    <DefaultLayout
      screenTitle='Giỏ hàng'
      isShowBottomTab={true}
      iconRight={true}
      onPressIconRight={() => setState(prev => ({ ...prev, showFilter: !prev.showFilter }))}
      icon={<FeatherIcon name="filter" size={18} color={"#000"} />}
    >
      {state.initialLoading ? (
        <LoadingLottie />
      ) : state.fetchCartData.length === 0 ? (
        <NullPageScreen text='Không có sản phẩm nào trong giỏ hàng' back />
      ) : (
        <View style={{ flex: 1 }}>
          {state.showFilter && (
            <View style={[styles.summaryContainer]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.summaryText}>Tổng shop đã chọn</Text>
                  <Text style={[styles.summaryText, { fontWeight: '700' }]}>{totals.totalShops}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.summaryText}>Tổng sản phẩm: </Text>
                  <Text style={[styles.summaryText, { fontWeight: '700' }]}>{totals.totalItems}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.summaryText}>Tổng tiền tệ: </Text>
                  <Text style={[styles.summaryText, { fontWeight: '700', color: colors.primary }]}>
                    {totals.totalPriceYuan}¥
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.summaryText}>Tổng tiền:</Text>
                  <Text style={[styles.summaryText, { fontWeight: '700', color: colors.primary }]}>
                    {_func.getVND(totals.totalPriceVND, 'đ')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <TouchableOpacity onPress={handleSelectAll} style={styles.checkbox}>
                    {state.selectAll && <View style={styles.checkboxChecked} />}
                  </TouchableOpacity>
                  <Text style={[styles.summaryText]}>Tất cả</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleDeleteAll()}
                  style={[styles.actionButton, styles.deleteButton]}>
                  <Text style={{ color: colors.background }}>Xóa tất cả đơn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.sendButton]}>
                  <Text style={{ color: colors.background }}>Gửi tất cả đơn</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setState(prev => ({ ...prev, showFilter: !prev.showFilter }))}
                style={{ width: "100%", alignItems: 'flex-end', }}
              >
                <MaterialCommunityIcon name={!state.showFilter ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'} style={styles.icon} />
              </TouchableOpacity>
            </View>
          )}
          <FlashList
            scrollEventThrottle={20}
            refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            data={state.fetchCartData}
            renderItem={({ item, index }) => (
              <RenderShopItem
                setState={setState}
                shop={item}
                fetchData={() => fetchData(1)}
                index={index}
              />
            )}
            estimatedItemSize={10}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => (state.isLoading ? <ActivityIndicator size={'large'} color={colors.primary} /> : null)}
            keyExtractor={(item) => item.shop_id.toString()}
          />
        </View>
      )}
    </DefaultLayout>
  );
};

const styles = ScaledSheet.create({
  checkbox: {
    width: "20@s",
    height: "20@s",
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: "10@s",
  },
  checkboxChecked: {
    width: "12@s",
    height: "12@s",
    backgroundColor: colors.success,
  },
  summaryContainer: {
    marginBottom: "16@s",
    padding: "10@s",
    gap: "8@s",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: "8@s",
  },
  summaryText: {
    fontSize: "14@s",
    color: colors.black,
    fontWeight: '400',
  },
  actionButton: {
    padding: "10@s",
    backgroundColor: '#ccc',
    borderRadius: "5@s",
    margin: "5@s",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
  },
  sendButton: {
    backgroundColor: 'blue',
    color: 'white',
  },
  icon: {
    color: colors.primary,
    fontSize: "24@s",
  },
});
