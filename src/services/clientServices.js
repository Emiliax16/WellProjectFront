import apiClient  from './index';

const getAllClients = async () => {
  try {
    const response = await apiClient.get(`${process.env.REACT_APP_API_ENDPOINT_GET_ALL_CLIENTS}`)
    return response.data
  } catch (error) {
    console.error('Error fetching clients', error)
  }
}

const getClientDetails = async (token) => {
  try {
    const response = await apiClient.get(`${process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO}`,
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
    const response = await apiClient.get(`${process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO}/${userId}`,
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

const getClientWells = async (token, userId) => {
  try {
    const url = `${process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX}/${userId}/${process.env.REACT_APP_API_ENDPOINT_GET_ALL_WELLS}`
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

const postNewClient = async (token, data) => {
  try {
    const response = await apiClient.post(`${process.env.REACT_APP_API_ENDPOINT_POST_USER}` , {
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
    const url = `${process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX}/${userId}/${process.env.REACT_APP_API_ENDPOINT_POST_WELL}`
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
  postNewClient,
  postNewWell
}