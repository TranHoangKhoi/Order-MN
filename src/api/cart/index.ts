import BaseAPI from '../method';

const { get, post } = new BaseAPI('');

export const cartAPI = {
  shoppingCart: (params) => get('customer/shopping-cart', { params }),
  fetchTransactions: (params) => get('customer/account-transactions', { params }),
  statusTransactions: () => get('charge-types'),
  updateCart: (data) => post('customer/update-cart', data),
  deleteShop: (data) => post('customer/delete-shop-cart', data),
  deleteItem: (data) => post('customer/delete-cart', data),
  createOrder: (data) => post('customer/shopping-cart/create-order', data)
};
