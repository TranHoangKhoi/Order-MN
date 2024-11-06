import { Text, View } from "react-native"
import { ScaledSheet } from "react-native-size-matters"
import { DefaultLayout } from "~/layout"
import { colors } from "~/utils"

const NotifiDetaitsScreen = ({route}) => {
  const data = route.params;
  console.log('ID: ', data);
  
  return (
    <DefaultLayout
    screenTitle='Nội dung thông báo'
    isShowBottomTab={false}
  >
    {/* <NullPageScreen text='Chưa có thông báo nào !' back /> */}
    <View>
      <View>
        <Text style={styles.title}>{data.title? data.title : 'Đang cập nhật'}</Text>
      </View>
      <View>
        <Text style={styles.contentBold}>
          Mã đơn hàng: 
          <Text style={styles.contentNormal}>
            {' '}{data.identify? data.identify : 'Đang cập nhật'}
          </Text>
        </Text>
        <Text style={styles.contentBold}>
          Nội dung: 
          <Text style={styles.contentNormal}>
            {' '}{data.message? data.message : 'Đang cập nhật'}
          </Text>
        </Text>
      </View>
      <View>
        <Text style={{fontSize: 14, color: colors.black}}>{data.timestamp? data.timestamp : 'Đang cập nhật'}</Text>
      </View>
    </View>
  </DefaultLayout>
  )
}

const styles = ScaledSheet.create({
  container: {

  }, 
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  contentBold: {
    fontWeight: 'bold', 
    marginBottom: 3, 
    color: colors.black
  },
  contentNormal: {
    fontWeight: '400',
    marginLeft: 4
  }
})

export default NotifiDetaitsScreen