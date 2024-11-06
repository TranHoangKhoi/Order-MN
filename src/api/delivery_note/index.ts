import BaseAPI from "../method";

const { get } = new BaseAPI('')

export const deliveryNoteAPI = {
  deliveryNote: (data) => get('customer/delivery-notes', data),
  deliveryNotePage: (data, page) => get(`customer/delivery-notes?page=${page}`, data),
  deliveryNoteStatus: () => get('delivery-note-status'),
  deliveryNoteDetail: (id) => get(`customer/delivery-note/${id}`)
}