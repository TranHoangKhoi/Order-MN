import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { colors, home, homeActive, order, orderActive, shoppingBag, shoppingBagActive } from '~/utils';
import { EntypoIcon, TextCom } from '~/components';
import { TAppStackParamList } from '~/types';

type NavigateType = keyof TAppStackParamList;

interface NavigateItem {
  name: NavigateType;
  title: string;
  icon: ImageSourcePropType;
  iconActive: ImageSourcePropType;
}

const navList: NavigateItem[] = [
  {
    name: 'Recharge',
    title: 'Nạp tiền',
    icon: home,
    iconActive: homeActive,
  },
  {
    name: 'Withdraw',
    title: 'Rút tiền',
    icon: order,
    iconActive: orderActive,
  },
  {
    name: 'History',
    title: 'Lịch sử',
    icon: shoppingBag,
    iconActive: shoppingBagActive,
  },
];

export const LayoutTopTabBar = () => {
  const { navigate } = useNavigation<NavigationProp<TAppStackParamList>>();
  const route = useRoute();
  const [activeScreen] = useState<any>(route.name);

  const { goBack } = useNavigation<NavigationProp<TAppStackParamList>>();

  useEffect(() => {
    if (activeScreen !== route.name) {
      navigate(activeScreen);
    }
  }, [activeScreen, route.name]);

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => goBack()}>
        <EntypoIcon name="chevron-thin-left" style={styles.headerIcon} />
      </TouchableOpacity>
      {navList.map((item: NavigateItem) => {
        return (
          <NavigateItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            title={item.title}
            isActive={activeScreen === item.name}
            setActiveScreen={navigate.bind(this, item.name as any)}
            iconActive={item.iconActive}
          />
        );
      })}
    </View>
  );
};

interface NavigateItemProps extends NavigateItem {
  isActive?: boolean;
  setActiveScreen?: any;
}

const NavigateItem = (props: NavigateItemProps) => {
  const { name, title, isActive, setActiveScreen } = props;
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setActiveScreen(name);
        }}>
        <View style={{ alignItems: 'center' }}>
          <TextCom
            text={title}
            color={isActive ? colors.primary : colors.textSecondary}
            fontSize={12}
            fontWeight="600"
            overrideStyle={{ marginTop: 4 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderColor: colors.borderThird,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    width: "25@s",
    height: "25@s",
    marginBottom: "4@s",
  },
  tabText: {
    fontSize: "11@s",
    fontWeight: "600",
  },
  headerIcon: {
    fontSize: "22@s",
    left: 0,
    color: colors.textPrimary,
  },
});
