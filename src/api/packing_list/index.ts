import BaseAPI from "../method";

const { get } = new BaseAPI('');

export const transferCodeAPI = {
    transferCode: (data) => get('customer/transfercodes', data),
    transferCodePage: (data, page) => get(`customer/transfercodes?page=${page}`, data)
}