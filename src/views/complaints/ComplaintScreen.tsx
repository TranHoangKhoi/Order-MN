import React from 'react'
import { DefaultLayout } from '~/layout'
import { NullPageScreen } from '~/components'

export const ComplaintScreen = () => {
  return (
    <DefaultLayout
      screenTitle='Khiếu nại'
      isShowBottomTab={false}
    >
      <NullPageScreen text='Không có đơn khiếu nại nào được tìm thấy' back />
    </DefaultLayout>
  )
}