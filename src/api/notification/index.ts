import BaseAPI from "../method";

const { get } = new BaseAPI('')

export const notificationsAPI = {
  notification: (data) => get('customer/notifications', data),
}