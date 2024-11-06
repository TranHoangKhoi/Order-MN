import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { TextCom } from '~/components';
import { defaultECList } from '~/configs';
import { shadowStyle } from '~/styles';
import { TAppStackParamList } from '~/types';
import { _func, colors } from '~/utils';

export const CategoryScreen = () => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>()

  const onPress = (item: any) => {
    navigate('SearchScreen', item);
  };

  return (
    <View style={styles.main}>
      <TextCom
        text='Tìm kiếm sản phẩm trên'
        overrideStyle={styles.text}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: scale(10),
        }}>
        {defaultECList.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              style={[styles.Item, shadowStyle.black]}
              key={index.toString()}>
              <Image
                source={item.icon}
                style={{
                  width: scale(35),
                  height: scale(35),
                  borderRadius: scale(8),
                }}
                resizeMode='contain'
              />
              <TextCom
                text={item.text}
                overrideStyle={styles.textItem}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: "24@s",
    paddingHorizontal: "12@s",
    gap: "12@s",
  },
  copyContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: "8@s",
    paddingVertical: "4@s",
    width: '100%',
    borderRadius: "4@s",
  },
  buttonMore: {
    backgroundColor: colors.primary,
    fontSize: "12@s",
    paddingHorizontal: "8@s",
    paddingVertical: "2@s",
    borderRadius: "4@s",
    color: colors.background,
  },
  text: {
    fontSize: "16@s",
    color: colors.black,
    fontWeight: '600',
  },
  Item: {
    backgroundColor: colors.borderSecondary,
    borderRadius: "8@s",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: "6@s",
    gap: "6@s",
  },
  textItem: {
    fontSize: "12@s",
    color: colors.black,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
});
