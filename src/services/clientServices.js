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

export { 
  getAllClients, 
  getClientDetails, 
  getClientDetailsById,
  getClientWells, 
}