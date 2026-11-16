import api from './api';

export const dashboardService = {
  getDashboard: async (params = {}) => {
    const response = await api.get('/dashboard', { params });
    return response.data;
  },
};

export default dashboardService;
