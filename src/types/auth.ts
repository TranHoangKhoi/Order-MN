export type TLogin = {
  UserName: string;
  Password: string;
  CheckBox?: boolean;
  Type?: string;
  DeviceToken?: string;
  TypeName?: string;
};

export type TRegister = {
  UserName: string,
  FullName: string,
  Phone: string,
  Email: string,
  Password: string,
  PasswordConfirmation: string,
  ProvinId: any,
  Token: string,
};

export type TAuth = {
  isLogin: boolean;
};

export type TError = {
  Code: string;
  Message: string;
  Status: string;
  Logout: string;
  message: string;
};

export type TForgotPassword = {
  email: string;
};

export type TResetPassword = {
  token: string;
  password: string;
  password_confirmation: string;
};

