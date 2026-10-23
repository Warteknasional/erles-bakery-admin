import api from './api';
import {
  getTransactions as mockGetTransactions,
  getFinanceSummary as mockGetFinanceSummary,
  createTransaction as mockCreateTransaction,
  updateTransaction as mockUpdateTransaction,
  deleteTransaction as mockDeleteTransaction,
} from '../mocks/financeMock';

export const financeService = {
  async list(params = {}) {
    try {
      const { data } = await api.get('/finance', { params });
      return data;
    } catch {
      const mockRes = await mockGetTransactions(params);
      return { ...mockRes, isOffline: true };
    }
  },

  async summary(params = {}) {
    try {
      const { data } = await api.get('/finance/summary', { params });
      return data;
    } catch {
      const mockRes = await mockGetFinanceSummary(params);
      return { ...mockRes, isOffline: true };
    }
  },

  async create(body) {
    try {
      const { data } = await api.post('/finance', body);
      return data;
    } catch (err) {
      if (err.errors) return err;
      const mockRes = await mockCreateTransaction(body);
      return { ...mockRes, isOffline: true };
    }
  },

  async update(id, body) {
    try {
      const { data } = await api.put(`/finance/${id}`, body);
      return data;
    } catch (err) {
      if (err.errors) return err;
      const mockRes = await mockUpdateTransaction(id, body);
      return { ...mockRes, isOffline: true };
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/finance/${id}`);
      return data;
    } catch {
      const mockRes = await mockDeleteTransaction(id);
      return { ...mockRes, isOffline: true };
    }
  },
};
