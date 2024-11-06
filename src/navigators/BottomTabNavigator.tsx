import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TBottomStackParamList } from '~/types';
import { HomeScreen, CartScreen, UserScreen, NewsScreen } from '~/views';

const Tab = createBottomTabNavigator<TBottomStackParamList>();

const TabArr: { name: keyof TBottomStackParamList; component: React.ComponentType<any> }[] = [
  {
    name: 'Home',
    component: HomeScreen,
  },
  {
    name: 'News',
    component: NewsScreen,
  },
  {
    name: 'Cart',
    component: CartScreen,
  },
  {
    name: 'User',
    component: UserScreen,
  },
];

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
      }}
    >
      {TabArr?.map((rt) => (
        <Tab.Screen
          key={rt.name}
          name={rt.name}
          component={rt.component}
          options={{ tabBarStyle: { display: 'none' } }}
        />
      ))}
    </Tab.Navigator>
  );
};
