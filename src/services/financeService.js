import api from './api';

export const financeService = {
  getSummary: async (params = {}) => {
    const response = await api.get('/finance/summary', { params });
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/finance', { params });
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post('/finance', data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/finance/${id}`);
    return response.data;
  },
};

export default financeService;
