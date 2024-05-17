import apiClient  from './index';
import { clientBack, clientFront, wellBack, userBack } from '../utils/routes.utils';

const { getClients, getDetails, putClient, deleteClient } = clientBack;
const { urlClients } = clientFront;
const { getWells, postWell, putWell, deleteWell } = wellBack;
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

const postNewClient = async (token, data, clientId) => {
  try {
    let response = null;
    if (clientId === '') {
      response = await apiClient.post(`${postUser}` , {
        ...data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } 
    else {
      const url = `${putClient}/${clientId}/edit`
      response = await apiClient.put(url , {
        ...data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return response.data;
  }
  catch (error) {
    throw error;
  }
}

const postNewWell = async (token, data, clientId, wellCode) => {
  try {
    let response = null;
    if (!wellCode) {
      // Create new well
      const url = `${urlClients}/${clientId}/${postWell}`
      response = await apiClient.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // Update existing well
      const url = `${urlClients}/${clientId}/${putWell}/${wellCode}/edit`
      response = await apiClient.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return response.data;
  }
  catch (error) {
    throw error;
  }
}

const deleteWellByCode = async (token, clientId, wellCode) => {
  try {
    const url = `${urlClients}/${clientId}/${deleteWell}/${wellCode}/delete`
    const response = await apiClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

const deleteClientById = async (token, clientId) => {
  try {
    const url = `${deleteClient}/${clientId}/delete`
    const response = await apiClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
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
  postNewWell,
  deleteClientById,
  deleteWellByCode
}