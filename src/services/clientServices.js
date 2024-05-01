import apiClient  from './index';
import { clientBack, clientFront, wellBack, userBack } from '../utils/routes.utils';

const { getClients, getDetails } = clientBack;
const { urlClients } = clientFront;
const { getWells, postWell } = wellBack;
const { postUser } = userBack;

const getAllClients = async (token) => {
  try {
    const response = await apiClient.get(`${getClients}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    return response.data
  } catch (error) {
    console.error('Error fetching clients', error)
  }
}

const getClientDetails = async (token) => {
  try {
    const response = await apiClient.get(`${getDetails}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        } 
      })
    return response.data
  } catch (error) {
    console.error('Error fetching client details', error)
  }
}

const getClientDetailsById = async (token, userId) => {
  try {
    const response = await apiClient.get(`${getDetails}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        } 
      })
    return response.data
  } catch (error) {
    console.error('Error fetching client details', error)
  }
}

//                GET CLIENT WELLS
const getClientWells = async (token, userId, page, size) => {
  try {
    const url = `${urlClients}/${userId}/${getWells}?page=${page}&size=${size}`
    const response = await apiClient.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    return response.data
  } catch (error) {
    console.error('Error fetching client wells', error)
  }
}

//                GET WELL REPORTS
const getWellReports = async (token, userId, wellCode, page, size) => {
  try {
    const url = `${urlClients}/${userId}/${getWells}/${wellCode}/data?page=${page}&size=${size}`
    const response = await apiClient.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    return response.data
  }
  catch (error) {
    console.error('Error fetching well reports', error)
  }
}

const postNewClient = async (token, data) => {
  try {
    const response = await apiClient.post(`${postUser}` , {
      ...data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
  catch (error) {
    console.error('User Creation Error:', error.response ? error.response.data : error);
  }
}

const postNewWell = async (token, data, userId) => {
  try {
    const url = `${urlClients}/${userId}/${postWell}`
    console.log("el token es: ", token)
    const response = await apiClient.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
  catch (error) {
    console.error('Well Creation Error:', error.response ? error.response.data : error);
  }
}

export { 
  getAllClients, 
  getClientDetails, 
  getClientDetailsById,
  getClientWells,
  getWellReports,
  postNewClient,
  postNewWell
}