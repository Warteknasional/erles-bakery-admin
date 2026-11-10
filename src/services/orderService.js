import api from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, catatan = '') => {
    const response = await api.put(`/orders/${id}/status`, { status, catatan });
    return response.data;
  },

  cancelOrder: async (id, alasan = '') => {
    const response = await api.post(`/orders/${id}/cancel`, { alasan });
    return response.data;
  },

  addPayment: async (orderId, paymentData) => {
    const response = await api.post(`/orders/${orderId}/payments`, paymentData);
    return response.data;
  },

  getOrderPayments: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/payments`);
    return response.data;
  },
};

export default orderService;
