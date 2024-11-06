import BaseAPI from '../method';

const { get, post } = new BaseAPI('');

export const authAPI = {
  provinces: () => get('provinces'),

  login: (data) => post('customer/login', data),

  register: (data) => post('customer/register', data),

  profile: () => get('customer/profile'),

  updateProfile: (data) => post('customer/update-profile', data),

  updatePassword: (data) => post('customer/update-password', data),

  forgotPassword: (data) => post('customer/forgot-password', data),

  resetPassword: (data) => post('customer/reset-password', data),
};
