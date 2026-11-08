import api from './api';

export const ingredientService = {
  getIngredients: async (params = {}) => {
    const response = await api.get('/ingredients', { params });
    return response.data;
  },

  getIngredient: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  createIngredient: async (data) => {
    const response = await api.post('/ingredients', data);
    return response.data;
  },

  updateIngredient: async (id, data) => {
    const response = await api.put(`/ingredients/${id}`, data);
    return response.data;
  },

  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },
};
