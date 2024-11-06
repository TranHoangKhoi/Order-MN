export type TAppStackParamList = {
  //auth
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;

  Home: undefined;
  User: undefined;
  BottomTabNavigator: undefined;
  FakeNavigators: undefined;
  SearchScreen: undefined;
  WalletTopScreen: undefined;

  Recharge: undefined;
  Withdraw: undefined;
  History: undefined;

  OrderManagement: undefined;
  OrderConsigment: undefined;
  OrderOrder: undefined;
  OrderDetail: { id: number };

  PackingListScreen: undefined;
  DeliveryNoteScreen: undefined;
  PaymentScreen: undefined;
  NoNameScreen: undefined;
  TrackingScreen: undefined;
  ComplaintScreen: undefined;
  NoteScreen: undefined;
  UserProfile: undefined;
  PaymentSupport: undefined;
  WebViewConsigment: { id: number };
  PaymentSupportDetail: { id: number };

  NotifiDetaits: undefined
};

export type TBottomStackParamList = {
  Home: undefined;
  News: undefined;
  Cart: undefined;
  User: undefined;

  //Fake
  HomeFake: undefined;
  OrderFake: undefined;
  CartFake: undefined;
  UserFake: undefined;

  //Order
  OrderManagement: undefined;
  OrderConsigment: undefined;
  OrderOrder: undefined;
  OrderDetail: { id: number };

  //wallet
  Recharge: undefined;
  Withdraw: undefined;
  History: undefined;
};