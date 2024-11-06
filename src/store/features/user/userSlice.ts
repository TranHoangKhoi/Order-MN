import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/store';
import { TUser } from '~/types';

// Define the initial state using that type
const initialState: TUser = {
  Account: {
    ID: undefined,
    Username: undefined,
    Email: undefined,
    FirstName: undefined,
    LastName: undefined,
    Phone: undefined,
    Address: undefined,
    BirthDay: undefined,
    Gender: undefined,
    Wallet: undefined,
    WalletCYN: undefined,
    Role: undefined,
    Level: undefined,
    IMGUser: undefined,
    title: undefined,
    RegisterLink: undefined,
    SalePhone: undefined
  },
  Key: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getUserInfo: (state) => {
      return state;
    },
    updateUser: (state, action: PayloadAction<TUser>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    logOutUser: () => {
      return {
        Account: {
          ID: undefined,
          Username: undefined,
          Email: undefined,
          FirstName: undefined,
          LastName: undefined,
          Phone: undefined,
          Address: undefined,
          BirthDay: undefined,
          Gender: undefined,
          Wallet: undefined,
          WalletCYN: undefined,
          Role: undefined,
          Level: undefined,
          IMGUser: undefined,
          title: undefined,
          RegisterLink: undefined,
          SalePhone: undefined
        },
        Key: undefined,
      };
    },
  },
});

export const { getUserInfo, updateUser, logOutUser } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const userReducer = (state: RootState) => state.user;
export default userSlice.reducer;
