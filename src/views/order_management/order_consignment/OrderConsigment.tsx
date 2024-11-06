import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { FeatherIcon, LoadingLottie, OrderFilter } from '~/components';
import { orderAPI } from '~/api/order_management';
import { FlashList } from '@shopify/flash-list';
import { DefaultLayout } from '~/layout';
import { RenderOrderConsignment } from './RenderOrderConsignment';

export const OrderConsigment = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [page, setPage] = useState({
    currentPgae: 1,
    nextPage: 1,
    lastPgae: 1
  });


  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    shippingCode: '',
    startDate: '',
    endDate: '',
    shippingStatus: '',
  });
  const [listStatus, setListStatus] = useState([]);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const params = { ...filters, per_page: 20 };
      const data = await orderAPI.orderConsignment({ params });
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

  const loadMoreData = async () => {
    if(page.nextPage <= page.lastPgae) {
      setLoading(true);
      try {
        const params = { ...filters, per_page: 20 };
        const data = await orderAPI.orderConsignmentPage({ params }, page.nextPage);
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

  const fetchShippingStatus = async () => {
    try {
      const shippingStatus = await orderAPI.shippingStatus();
      const values = Object.entries(shippingStatus.data).map(([key, value]) => ({
        label: value,
        value: key
      }));
      setListStatus(values);
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchOrderData(), fetchShippingStatus()]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFilters({
      shippingCode: '',
      startDate: '',
      endDate: '',
      shippingStatus: '',
    });
    await fetchOrderData();
    setRefreshing(false);
  }, []);

  return (
    <DefaultLayout
      isShowBottomTab={true}
      screenTitle='Đơn hàng ký gửi'
      iconRight={true}
      showTextRight={"Bộ lọc"}
      onPressIconRight={() => setFilterVisible(prev => !prev)}
      icon={<FeatherIcon name="filter" size={16} color={"#000"} />}
    >
      {loadingPage ? (
        <LoadingLottie />
      ) : (
        <View style={{ flex: 1 }}>
          {/* {filterVisible && (
            <OrderFilter
              filters={filters}
              setFilters={setFilters}
              listStatus={listStatus}
              fetchOrderData={fetchOrderData}
              loading={loading}
              toggleFilterVisibility={() => setFilterVisible(!filterVisible)}
              filterVisible={filterVisible}
              primaryFilterLabel="Mã đơn hàng..."
              primaryFilterKey="shippingCode"
              primaryFilterStatus='shippingStatus'
            />
          )} */}
          <OrderFilter
              filters={filters}
              setFilters={setFilters}
              listStatus={listStatus}
              fetchOrderData={fetchOrderData}
              loading={loading}
              toggleFilterVisibility={() => setFilterVisible(!filterVisible)}
              filterVisible={filterVisible}
              primaryFilterLabel="Mã vận chuyển..."
              primaryFilterKey="shippingCode"
              primaryFilterStatus='shippingStatus'
            />

          <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            data={orderData}
            renderItem={({ item }) => <RenderOrderConsignment item={item} />}
            estimatedItemSize={10}
            onEndReachedThreshold={0.1}
            ListFooterComponent={page.nextPage <= page.lastPgae ? renderFooter : <></>}
          />
        </View>
      )}
    </DefaultLayout>
  );
};

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