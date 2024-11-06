import { OrderConsigment } from "~/views";
import BaseAPI from "../method";

const { get } = new BaseAPI('');

export const orderAPI = {
  orders: (data) => get('customer/orders', data),
  ordersPage: (data, page) => get(`customer/orders?page=${page}`, data),
  orderStatus: () => get('order-status'),
  shippingStatus: () => get('shipping-status'),
  orderConsignment: (data) => get('customer/order-consignments', data),
  orderConsignmentPage: (data, page) => get(`customer/order-consignments?page=${page}`, data),
  orderDetail: (id) => get(`customer/order/${id}`)
}