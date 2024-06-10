import apiClient  from './index';
import { wellBack } from '../utils/routes.utils';

const { statusWell } = wellBack;

const activateWell = async (token, wellId) => {
    try {
      const url = `${statusWell}/${wellId}/active`
      const response = await apiClient.put(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  }


export { activateWell }