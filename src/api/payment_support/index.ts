import BaseAPI from '../method';

const { get, post } = new BaseAPI('');

export const paymentSupportAPI = {
  sendPaymentSupport: (data) => post('customer/payment-support', data),
  getPaymentSupport: (params) => get('customer/payment-supports', {params}),
  paymentSupportDetail: (id) => get(`customer/payment-support/${id}`)
};
