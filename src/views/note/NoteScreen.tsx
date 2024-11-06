import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { NullPageScreen } from '~/components';
import { DefaultLayout } from '~/layout';
import { notificationsAPI } from '~/api/notification';
import { scale } from 'react-native-size-matters';
import RenderItem from './RenderItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TAppStackParamList } from '~/types';

export const NoteScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [notifiData, setNotifiData] = useState([]);
  

  const fetchNotification = useCallback(async () => {
    setLoading(true);
    try {
      const params = { per_page: 9999, order: "desc", };
      const data = await notificationsAPI.notification({ params });
      setNotifiData(data.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotification();
    setRefreshing(false);
  }, [fetchNotification]);

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchNotification();
      setInitialLoading(false);
    };
    fetchData();
  }, []);

  return (
    <DefaultLayout
      screenTitle='Thông báo'
      isShowBottomTab={false}
    >
      {/* <NullPageScreen text='Chưa có thông báo nào !' back /> */}
      <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={notifiData}
            renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={page.nextPage <= page.lastPgae ? renderFooter : <></>}
            ListFooterComponent={<View style={{ height: scale(50) }} />}
          />
    </DefaultLayout>
  );
};
