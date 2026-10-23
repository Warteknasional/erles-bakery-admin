import api from './api';
import {
  getOrders as mockGetOrders,
  getOrderDetail as mockGetOrderDetail,
  updateOrderStatus as mockUpdateOrderStatus,
} from '../mocks/orderMock';

export const orderService = {
  async list(params = {}) {
    try {
      const { data } = await api.get('/orders', { params });
      return data;
    } catch {
      const mockRes = await mockGetOrders(params);
      return { ...mockRes, isOffline: true };
    }
  },

  async detail(id) {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch {
      const mockRes = await mockGetOrderDetail(id);
      return { ...mockRes, isOffline: true };
    }
  },

  async updateStatus(id, status) {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      return data;
    } catch {
      const mockRes = await mockUpdateOrderStatus(id, status);
      return { ...mockRes, isOffline: true };
    }
  },
};
