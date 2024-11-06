import {
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AntDesignIcon, EntypoIcon, InputForm } from '~/components';
import { TAppStackParamList } from '~/types';
import { colors, shoppingBag } from '~/utils';

interface THeaderSearch {
  title?: string;
  back?: boolean;
  setting?: boolean;
  home?: boolean;
  handleSubmit: any;
  control: any;
  isLoading?: boolean
}

const HeaderSearch = ({
  handleSubmit,
  control,
  isLoading,
}: THeaderSearch) => {
  const inset = useSafeAreaInsets();
  const { goBack } = useNavigation<NavigationProp<TAppStackParamList>>();

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.header, { marginTop: inset.top }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goBack()}
        >
          <EntypoIcon name="chevron-thin-left" style={{ fontSize: 20, colors: colors.black }} />
        </TouchableOpacity>

        <View style={[{ flex: 1 }]}>
          <InputForm
            control={control}
            placeholder='Bạn đang tìm kiếm gì ?'
            name='searchString'
            onEndEditing={() => handleSubmit()}
            inputStyle={{ height: 40 }}
            disabled={isLoading}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSubmit()}
        >
          <AntDesignIcon
            name={"search1"}
            style={{ fontSize: 20, colors: colors.black }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Image
            source={shoppingBag}
            style={{ width: 25, height: 25, tintColor: colors.textPrimary }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HeaderSearch;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 70,
    gap: 16
  },
  inner: {
    backgroundColor: colors.borderSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: colors.borderThird,
    borderRadius: 5,
    height: 46,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: colors.textPrimary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: colors.black,
    fontWeight: '600',
  },
  Number: {
    width: 15,
    height: 15,
    backgroundColor: 'red',
    borderRadius: 999,
    left: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    position: 'absolute',
    top: -2,
  },
});
