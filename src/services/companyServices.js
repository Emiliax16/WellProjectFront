import apiClient  from './index';
import { companyBack, userBack } from '../utils/routes.utils';

const { getCompanies, getCompanyDetails, putCompany, deleteCompany } = companyBack;
const { postUser } = userBack;

const getAllCompanies = async (token) => {
  try {
    const response = await apiClient.get(`${getCompanies}`,
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

const getCompanyDetailsById = async (token, companyId) => {
  try {
    const response = await apiClient.get(`${getCompanyDetails}/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        } 
      })
    return response.data
  } catch (error) {
    console.error('Error fetching company details', error)
  }
}

const postNewCompany = async (token, data, companyId) => {
  try {
    let response = null;
    if (companyId === '') {
      response = await apiClient.post(`${postUser}` , {
        ...data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } 
    else {
      const url = `${putCompany}/${companyId}/edit`
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
  
const deleteCompanyById = async (token, companyId) => {
  try {
    const url = `${deleteCompany}/${companyId}/delete`
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
  getAllCompanies,
  getCompanyDetailsById,
  postNewCompany,
  deleteCompanyById
}