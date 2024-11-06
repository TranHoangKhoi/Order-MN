import BaseAPI from "../method";

const { get, post } = new BaseAPI('');

export const walletAPI = {
    getSetting: (params) => get('get-setting', { params }),
    getWithdraw: () => get('customer/account-transaction/desc-acount'),
    postWithdraw: (data) => post('customer/account-transaction/desc-acount', data)
}