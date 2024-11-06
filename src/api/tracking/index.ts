import BaseAPI from "../method";

const {get} = new BaseAPI('');

export const trackingAPI = {
    trackingCode: (data) => get('tracking', data)
}