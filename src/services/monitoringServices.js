import apiClient from './index';

/**
 * Obtiene el estado de comunicación de todos los pozos activos
 * con su semáforo (green/yellow/red) y el listado de pozos críticos.
 */
export const getWellsStatus = async (token) => {
  try {
    const response = await apiClient.get('/monitoring/wells-status', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wells status:', error);
    throw error;
  }
};
