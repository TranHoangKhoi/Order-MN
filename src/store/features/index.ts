import _userReducer from './user/userSlice';
import _authSlice from './auth/authSlice';
import _provincesSlice from './provinces/provincesSlice'

export * from './user/userSlice';
export * from './auth/authSlice';
export * from './provinces/provincesSlice';


export const userReducer = _userReducer;
export const autheReducer = _authSlice;
export const provincesReducer = _provincesSlice;

