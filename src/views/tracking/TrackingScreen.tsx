import { StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { DefaultLayout } from '~/layout'
import { ProcessBar, RefreshWebView } from '~/components'

export const TrackingScreen = () => {
  const [isRefresh, setRefresh] = useState(false);
  const webview = useRef(null);
  const [wvProcess, setWvProcess] = useState(0);

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
      screenTitle='Tracking'
      isShowBottomTab={false}
      containerOverrideStyle={styles.fragment}
    >
      <ProcessBar percent={wvProcess} />
      <RefreshWebView
        isRefresh={isRefresh}
        onRefresh={_onRef}
        ref={webview}
        style={{ marginTop: 0 }}
        source={{ uri: 'https://www.kuaidi100.com/' }}
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