import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { EntypoIcon, FontAwesomeIcon, MaterialIcons, TextCom } from '~/components'; // Assume all icon types are available from '~/components'
import { TBottomStackParamList } from '~/types';
import { LocalStorage, colors } from '~/utils';

type NavigateType = keyof TBottomStackParamList;

interface NavigateItem {
  name: NavigateType;
  title: string;
  icon: JSX.Element;
  iconActive: JSX.Element;
}

const navList: NavigateItem[] = [
  {
    name: 'Home',
    title: 'Trang chủ',
    icon: <FontAwesomeIcon name='home' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='home' size={22} color={colors.primary} />
  },
  {
    name: 'News',
    title: 'Tin tức',
    icon: <EntypoIcon name='news' size={20} color={colors.textPrimary} />,
    iconActive: <EntypoIcon name='news' size={20} color={colors.primary} />
  },
  {
    name: 'Cart',
    title: 'Giỏ hàng',
    icon: <FontAwesomeIcon name='shopping-cart' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='shopping-cart' size={22} color={colors.primary} />
  },
  {
    name: 'User',
    title: 'Tài khoản',
    icon: <FontAwesomeIcon name='user' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='user' size={22} color={colors.primary} />
  },
];

const navListFake: NavigateItem[] = [
  {
    name: 'HomeFake',
    title: 'Trang chủ',
    icon: <FontAwesomeIcon name='home' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='home' size={22} color={colors.primary} />
  },
  {
    name: 'OrderFake',
    title: 'Đơn hàng',
    icon: <FontAwesomeIcon name='truck' size={16} color={colors.primary} />,
    iconActive: <FontAwesomeIcon name='truck' size={16} color={colors.textSecondary} />,
  },
  {
    name: 'CartFake',
    title: 'Giỏ hàng',
    icon: <FontAwesomeIcon name='shopping-cart' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='shopping-cart' size={22} color={colors.primary} />
  },
  {
    name: 'UserFake',
    title: 'Tài khoản',
    icon: <FontAwesomeIcon name='user' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='user' size={22} color={colors.primary} />
  }
];

const otherList: NavigateItem[] = [
  {
    name: 'OrderOrder',
    title: 'Đơn hàng Order',
    icon: <FontAwesomeIcon name='truck' size={22} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='truck' size={22} color={colors.primary} />
  },
  {
    name: 'OrderConsigment',
    title: 'Đơn hàng ký gửi',
    icon: <MaterialIcons name='card-travel' size={22} color={colors.textPrimary} />,
    iconActive: <MaterialIcons name='card-travel' size={22} color={colors.primary} />
  },
  {
    name: 'OrderManagement',
    title: 'Tạo đơn khác',
    icon: <FontAwesomeIcon name='send-o' size={18} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='send-o' size={18} color={colors.primary} />
  },
];

const walletList: NavigateItem[] = [
  {
    name: 'Recharge',
    title: 'Nạp tiền',
    icon: <FontAwesomeIcon name='credit-card-alt' size={17} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='credit-card-alt' size={17} color={colors.primary} />
  },
  {
    name: 'Withdraw',
    title: 'Rút tiền',
    icon: <FontAwesomeIcon name='money' size={20} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='money' size={20} color={colors.primary} />
  },
  {
    name: 'History',
    title: 'Lịch sử',
    icon: <FontAwesomeIcon name='history' size={20} color={colors.textPrimary} />,
    iconActive: <FontAwesomeIcon name='history' size={20} color={colors.primary} />
  },
];

export const LayoutBottomTab = () => {
  const navigation = useNavigation<NavigationProp<TBottomStackParamList>>();
  const route = useRoute();

  const [activeScreen, setActiveScreen] = useState<NavigateType>(route.name as NavigateType);
  const [isFake, setIsFake] = useState(true);

  useEffect(() => {
    const checkFake = async () => {
      const resFake = await LocalStorage.getFake();
      setIsFake(resFake);
    };
    checkFake();
  }, []);

  useEffect(() => {
    if (activeScreen !== route.name) {
      navigation.navigate(activeScreen);
    }
  }, [activeScreen, route.name]);

  const routeBasedLists = {
    'OrderOrder': otherList,
    'OrderConsigment': otherList,
    'OrderManagement': otherList,
    'Recharge': walletList,
    'Withdraw': walletList,
    'History': walletList
  };

  const itemsToRender = routeBasedLists[route.name] || (isFake ? navListFake : navList);

  return (
    <View style={styles.container}>
      {itemsToRender.map((item: NavigateItem) => (
        <NavigateItem
          key={item.name}
          name={item.name}
          icon={item.icon}
          title={item.title}
          isActive={activeScreen === item.name}
          setActiveScreen={() => navigation.navigate(item.name)}
          iconActive={item.iconActive}
        />
      ))}
    </View>
  );
};

interface NavigateItemProps extends NavigateItem {
  isActive: boolean;
  setActiveScreen: () => void;
}

const NavigateItem = ({ name, title, icon, isActive, setActiveScreen, iconActive }: NavigateItemProps) => (
  <View>
    <TouchableOpacity onPress={setActiveScreen}>
      <View style={styles.item}>
        <View style={{ height: scale(20) }}>
          {isActive ? iconActive : icon}
        </View>
        <TextCom text={title} color={isActive ? colors.primary : colors.textSecondary} fontSize={11} fontWeight="600" overrideStyle={styles.text} />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: scale(8),
    borderTopWidth: 1,
    borderColor: colors.borderThird,
  },
  item: {
    alignItems: 'center'
  },
  text: {
    marginTop: 4
  },
});
