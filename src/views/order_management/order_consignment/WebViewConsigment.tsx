import { StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { DefaultLayout } from '~/layout';
import { ProcessBar, RefreshWebView } from '~/components';
import { useRoute } from '@react-navigation/native';

export const WebViewConsigment = () => {
  const [isRefresh, setRefresh] = useState(false);
  const webview = useRef(null);
  const [wvProcess, setWvProcess] = useState(0);
  const route = useRoute<any>();

  const _onRef = () => {
    setRefresh(true);
    webview.current.reload();
    setRefresh(false);
  };

  const _onLoadProgress = ({ nativeEvent }) => {
    setWvProcess(nativeEvent.progress * 100);
  };

  return (
    <DefaultLayout
      screenTitle={`ĐH ký gửi ${route?.params?.id}`}
      isShowBottomTab={false}
      containerOverrideStyle={styles.fragment}
    >
      <ProcessBar percent={wvProcess} />
      <RefreshWebView
        isRefresh={isRefresh}
        onRefresh={_onRef}
        ref={webview}
        style={{ marginTop: 0 }}
        source={{ uri: `https://m.kuaidi100.com/result.jsp?nu=${route?.params?.id}` }}
        onLoadProgress={_onLoadProgress}
      />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  fragment: {
    margin: 0,
    padding: 0,
  },
})
