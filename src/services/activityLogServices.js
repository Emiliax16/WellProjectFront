import apiClient from './index';

/**
 * Get activity logs with pagination support
 * @param {string} token - Authentication token
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Number of logs per page (default: 25)
 * @returns {Promise<Object>} Object with data, total, page, and size
 */
export const getActivityLogs = async (token, page = 0, size = 25) => {
  try {
    const response = await apiClient.get(`/activity-logs?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};
