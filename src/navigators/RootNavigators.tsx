import React from 'react'
import { BottomTabNavigator } from './BottomTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TAppStackParamList } from '~/types';
import { RechargeScreen, SearchScreen, NoNameScreen, TransactionHistory, UserProfile, WithdrawMoney, OrderCreate, OrderConsigment, OrderOrder, PackingListScreen, OrderDetail, DeliveryNoteScreen, PaymentScreen, TrackingScreen, ComplaintScreen, PaymentSupportDetail, WebViewConsigment } from '~/views';
import { StackAnimationTypes } from 'react-native-screens';
import { NoteScreen } from '~/views/note';
import { PaymentSupport } from '~/views/payment/payment_support_list/PaymentSupport';
import NotifiDetaitsScreen from '~/views/note/NotifiDetaitsScreen';

const Stack = createNativeStackNavigator<TAppStackParamList>();

const dataScreen: {
    name: keyof TAppStackParamList;
    component: React.ComponentType<any>;
    animation: StackAnimationTypes
}[] = [
        {
            name: 'BottomTabNavigator',
            component: BottomTabNavigator,
            animation: 'slide_from_right',
        },
        {
            name: 'SearchScreen',
            component: SearchScreen,
            animation: 'slide_from_right',
        },
        {
            name: 'NoteScreen',
            component: NoteScreen,
            animation: 'slide_from_right',
        },
        {
            name: 'UserProfile',
            component: UserProfile,
            animation: 'slide_from_right',
        },
        {
            name: 'Recharge',
            component: RechargeScreen,
            animation: 'none',
        },
        {
            name: 'Withdraw',
            component: WithdrawMoney,
            animation: 'none',
        },
        {
            name: 'History',
            component: TransactionHistory,
            animation: 'none',
        },
        {
            name: 'OrderManagement',
            component: OrderCreate,
            animation: 'none',
        },
        {
            name: 'OrderConsigment',
            component: OrderConsigment,
            animation: 'none',
        },
        {
            name: 'OrderOrder',
            component: OrderOrder,
            animation: 'none',
        },
        {
            name: 'PackingListScreen',
            component: PackingListScreen,
            animation: 'none',
        },
        {
            name: 'OrderDetail',
            component: OrderDetail,
            animation: 'none',
        },
        {
            name: 'DeliveryNoteScreen',
            component: DeliveryNoteScreen,
            animation: 'none',
        },
        {
            name: 'PaymentScreen',
            component: PaymentScreen,
            animation: 'none',
        },
        {
            name: 'NoNameScreen',
            component: NoNameScreen,
            animation: 'none',
        },
        {
            name: 'TrackingScreen',
            component: TrackingScreen,
            animation: 'none',
        },
        {
            name: 'ComplaintScreen',
            component: ComplaintScreen,
            animation: 'none',
        },
        {
            name: 'PaymentSupport',
            component: PaymentSupport,
            animation: 'none',
        },
        {
            name: 'PaymentSupportDetail',
            component: PaymentSupportDetail,
            animation: 'none',
        },
        {
            name: 'WebViewConsigment',
            component: WebViewConsigment,
            animation: 'none',
        },
        {
            name: 'NotifiDetaits',
            component: NotifiDetaitsScreen,
            animation: 'none',
        },
    ];

export const RootNavigators = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {dataScreen.map((rt) => (
                    <Stack.Screen
                        key={rt.name}
                        name={rt.name}
                        component={rt.component}
                        options={{ animation: rt.animation }}
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    )
}