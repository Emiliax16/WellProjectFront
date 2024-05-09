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
    throw error;
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

const getClientDetailsById = async (token, clientId) => {
  try {
    const response = await apiClient.get(`${getDetails}/${clientId}`,
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
const getClientWells = async (token, clientId, page, size) => {
  try {
    const url = `${urlClients}/${clientId}/${getWells}?page=${page}&size=${size}`
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
const getWellReports = async (token, clientId, wellCode, page, size) => {
  try {
    const url = `${urlClients}/${clientId}/${getWells}/${wellCode}/data?page=${page}&size=${size}`
    const response = await apiClient.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    return response.data
  }
  catch (error) {
    throw error;
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
    throw error;
  }
}

const postNewWell = async (token, data, clientId) => {
  try {
    const url = `${urlClients}/${clientId}/${postWell}`
    const response = await apiClient.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
  catch (error) {
    throw error;
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