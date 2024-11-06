import { ScrollView, View } from 'react-native'
import React from 'react'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { DefaultLayout } from '~/layout'
import { HeaderHome } from './HeaderHome'
import { CategoryScreen } from './Category';
import { TabHomeScreen } from './TabHome'
import { SearchCode } from './SearchCode'

export const HomeScreen = () => {
  return (
    <DefaultLayout
      translucent={true}
      containerOverrideStyle={styles.fragment}
      isShowBottomTab={true}
    >
      <HeaderHome />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: scale(16) }}
        showsVerticalScrollIndicator={false}
      >
        <CategoryScreen />
        <TabHomeScreen />
        <SearchCode />
        <View style={{ height: 50 }} />
      </ScrollView>
    </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  fragment: {
    margin: 0,
    padding: 0,
  },
})