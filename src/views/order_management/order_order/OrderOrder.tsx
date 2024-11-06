import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FeatherIcon, LoadingLottie, OrderFilter } from '~/components';
import { DefaultLayout } from '~/layout';
import { _func } from '~/utils';
import { FlashList } from '@shopify/flash-list';
import { orderAPI } from '~/api/order_management';
import { RenderShopItemOrder } from './RenderShopItemOrder';

export const OrderOrder = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    currentPgae: 1,
    nextPage: 1,
    lastPgae: 1
  });
  const [loadingPage, setLoadingPage] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    identify: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [listStatus, setListStatus] = useState([]);
  

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const params = { ...filters, per_page: 20, order: "desc" };
      const data = await orderAPI.orders({ params });
      setPage({
        currentPgae: data.current_page,
        lastPgae: data.last_page,
        nextPage: data.current_page + 1
      });
      setOrderData(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusOrder = async () => {
    try {
      const status = await orderAPI.orderStatus();
      const values = Object.entries(status.data).map(([key, value]) => ({
        label: value,
        value: key
      }));
      setListStatus(values);
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchOrderData(), fetchStatusOrder()]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const loadMoreData = async () => {
    if(page.nextPage <= page.lastPgae) {
      setLoading(true);
      try {
        const params = { ...filters, per_page: 20, order: "desc", nextPage: 2 };
        const data = await orderAPI.ordersPage({ params }, page.nextPage);
        setPage((prev) => ({
          ...prev,
          currentPgae: data.current_page,
          nextPage: data.current_page + 1
        }));
        setOrderData((prev) => ([...prev, ...data.data]));
        
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
      <TouchableOpacity style={styles.button} onPress={loadMoreData}>
        <Text style={styles.buttonText}>Tải thêm
        {loading && <ActivityIndicator size='small' color={'#fff'} />}</Text>
          
      </TouchableOpacity>
    </View>
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFilters({
      identify: '',
      startDate: '',
      endDate: '',
      status: '',
    });
    await fetchOrderData();
    setRefreshing(false);
  }, []);

  return (
    <DefaultLayout
      isShowBottomTab={true}
      screenTitle='Đơn hàng'
      iconRight={true}
      showTextRight={"Bộ lọc"}
      onPressIconRight={() => setFilterVisible(prev => !prev)}
      icon={<FeatherIcon name="filter" size={16} color={"#000"} />}
    >
      {loadingPage ? (
        <LoadingLottie />
      ) : (
        <View style={{ flex: 1 }}>
          <OrderFilter
              filters={filters}
              setFilters={setFilters}
              listStatus={listStatus}
              fetchOrderData={fetchOrderData}
              loading={loading}
              toggleFilterVisibility={() => setFilterVisible(prev => !prev)}
              filterVisible={filterVisible}
              primaryFilterKey="identify"
              primaryFilterStatus='status'
              primaryFilterLabel="Mã đơn hàng..."
            />
          <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            data={orderData}
            renderItem={({ item, index }) => <RenderShopItemOrder item={item} index={index} setOrderData={setOrderData} />}
            estimatedItemSize={10}
            onEndReachedThreshold={0.1}
            scrollEventThrottle={16}

            ListFooterComponent={page.nextPage <= page.lastPgae ? renderFooter : <></>} // Thêm component nút vào cuối danh sách
          />
         
        </View>
      )}
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  button: {
    backgroundColor: '#D31E25',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});