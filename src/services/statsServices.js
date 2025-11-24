import apiClient from './index';

/**
 * Get global statistics for the dashboard
 * @param {string} token - JWT authentication token
 * @returns {Promise} - Object with clients, companies, distributors, and wells stats
 */
export const getGlobalStats = async (token) => {
  try {
    const response = await apiClient.get('/stats/global', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    throw error;
  }
};
