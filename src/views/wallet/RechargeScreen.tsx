import { StyleSheet, Text, View, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DefaultLayout } from '~/layout';
import { colors } from '~/utils';
import { walletAPI } from '~/api';
import { LoadingLottie } from '~/components';
import RenderHtml from 'react-native-render-html';
import { width } from '~/styles';
import { RootState, useAppSelector } from '~/store';

export const RechargeScreen = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState<any>();
  const [bank, setBank] = useState<any>();

  const { Account } = useAppSelector((state: RootState) => state.user);
  

  const fetchData = async () => {
    try {
      const resNote = await walletAPI.getSetting({ key: 'page_naptien_block_note' });
      const resBank = await walletAPI.getSetting({ key: 'page_naptien_block_bank_account' });
      setNote(resNote.data);
      setBank(resBank.data);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if(note && note.value !== undefined && typeof note.value === 'string') {
      const noteValue = note.value;
      const newNoteValue = noteValue.replaceAll('A{user_id}', `A${Account.id}`)
      setNote(prev => ({...note, value: newNoteValue}))
    }
  }, note)

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultLayout
      isShowBottomTab={true}
      screenTitle='Nạp tiền'
    >
      {loadingPage ? (
        <LoadingLottie />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.headerText}>Quét mã QR để nạp tiền</Text>
            <Image
              source={{ uri: "https://img.vietqr.io/image/mb-074067899999-compact.jpg?addInfo=NT%20A95" }}
              style={styles.qrCode}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `<div style='text-align:center;color: red;'>${note?.value}</div>`
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `<div style='text-align:center;color: #000;'>${bank?.value}</div>`
              }}
            />
          </View>
        </ScrollView>
      )}
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.black
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.black
  },
  accountDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.black
  }
});
