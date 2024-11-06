import React, { useEffect } from 'react'
import { DefaultLayout } from '~/layout'
import { NullPageScreen } from '~/components'
import { Linking } from 'react-native';

export const NewsScreen = () => {
  useEffect(() => {
    // Chuyển hướng tới URL ngoài
    Linking.openURL('https://vanchuyenminhtan.com/tin-tuc');
  }, []);
  return (
    <DefaultLayout
      screenTitle='Tin tức'
      isShowBottomTab={true}
    >
      <NullPageScreen text='Không có tin tức nào được tìm thấy' back />
    </DefaultLayout>
  )
}

