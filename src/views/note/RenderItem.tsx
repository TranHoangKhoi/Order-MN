import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { shadowStyle } from "~/styles";
import { TAppStackParamList } from "~/types";
import { colors } from "~/utils";


const RenderItem = ({item, index}) => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();
  
  return (
    <View style={[styles.cotaniner, shadowStyle.black]}>

    <TouchableOpacity  onPress={() => navigate('NotifiDetaits', item)}>
        <View>
          <View style={{marginBottom: 4}}>
            <Text style={styles.dateText}>{item?.timestamp ? item.timestamp : 'Đang cập nhật'}</Text>
          </View>
          <View>
            <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
            <Text numberOfLines={4}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
const styles = ScaledSheet.create({
  cotaniner: {
    backgroundColor: colors.borderSecondary,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4
  },
  dateText: {
    color: colors.textPrimary
  },
  titleText: {
    color: colors.primary,
    fontSize: 16,
    marginBottom: 2
  },
  message: {
    color: colors.black
  }
})

export default RenderItem