export type TAccount = {
  [x: string]: any;
  RegisterLink?: string | undefined;
  ID?: number | undefined;
  Username?: string | undefined;
  Email?: string | undefined;
  FirstName?: string | undefined;
  LastName?: string | undefined;
  Phone?: string | undefined;
  SalePhone?: string | undefined;
  Address?: string | undefined;
  BirthDay?: Date | null | undefined;
  Gender?: number | undefined;
  Wallet?: string | undefined;
  WalletCYN?: string | undefined;
  Role?: number | undefined;
  Level?: string | undefined;
  IMGUser?: string | undefined;
  title?: number | undefined;
  Menu?: [
    {
      ItemName?: string;
      GroupID?: number;
      Parent?: number;
      Link?: string;
      ShowType?: number;
      Icon?: string;
    },
  ];
  address?: string | undefined,
  avatar?: string | undefined,
  bankName?: string | undefined,
  billingAddress?: string | undefined,
  branch?: string | undefined,
  by_admin?: number,
  cityCode?: string | undefined,
  cny?: string | undefined,
  created_at?: number,
  deposit?: string | undefined,
  discountKg?: string | undefined,
  discountRate?: string | undefined,
  districtId?: string | undefined,
  email?: string | undefined,
  email_verified?: number,
  fb_access_token?: string | undefined,
  fb_id?: string | undefined,
  fullname?: string | undefined,
  gender?: string | undefined,
  group_id?: number,
  id?: number,
  identify?: string | undefined,
  last_login?: string | undefined,
  makh?: string | undefined,
  note?: string | undefined,
  phone?: string | undefined,
  provinID?: number,
  role?: number,
  shipAddress?: string | undefined,
  staffID?: string | undefined,
  status?: number,
  token_share?: string | undefined,
  updated_at?: number,
  userComplain?: string | undefined,
  userID?: number,
  username?: string | undefined,
  weightFee?: string | undefined
};

export type TUser = {
  Account?: TAccount;
  Key?: string | undefined;
  sysCurrency?: string | '0';
};

export type TUserSetting = {
  firstName?: string;
  lastName?: string;
  gender?: 1 | 0;
  imgUrl?: string;
  birthday?: Date;
  address?: string;
  password?: string;
  ConfirmPassword?: string;
  UID?: number;
  Key?: string;
};

export type TUserProfile = {
  fullname: string;
  phone: string;
  email: string;
  address: string;
};

export type TUpdatePassword = {
  old_password: string;
  password: string;
  password_confirmation: string;
};
