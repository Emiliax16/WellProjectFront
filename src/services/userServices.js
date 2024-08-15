import apiClient  from './index';
import { userBack } from '../utils/routes.utils';

const { userRole } = userBack;

const getUserRole = async (userId, token) => {
    try {
      const url = `${userRole}/${userId}`
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  }


export { getUserRole }