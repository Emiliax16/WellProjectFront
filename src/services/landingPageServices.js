import apiClient  from './index';
import { contactBack } from '../utils/routes.utils';

const { postContact } = contactBack;

const postContactRequest = async (data) => {
  try {
    const response = await apiClient.post(`${postContact}` , {
      ...data,
    });
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export {
  postContactRequest,
}