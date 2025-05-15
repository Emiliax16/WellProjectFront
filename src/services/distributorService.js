import apiClient from "./index";
import { distributorBack, userBack } from "../utils/routes.utils";

const {
  getDistributors,
  getDistributorDetails,
  putDistributor,
  deleteDistributor,
} = distributorBack;
const { postUser } = userBack;

const getAllDistributors = async (token) => {
  try {
    const response = await apiClient.get(`${getDistributors}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getDistributorDetailsById = async (token, companyId) => {
  try {
    const response = await apiClient.get(
      `${getDistributorDetails}/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company details", error);
  }
};

const postNewDistributor = async (token, data, distributorId) => {
  try {
    let response = null;
    if (distributorId === "") {
      response = await apiClient.post(`${postUser}`, {
        ...data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      const url = `${putDistributor}/${distributorId}/edit`;
      response = await apiClient.put(url, {
        ...data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteDistributorById = async (token, distributorId) => {
  try {
    const url = `${deleteDistributor}/${distributorId}/delete`;
    const response = await apiClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllDistributors,
  getDistributorDetailsById,
  postNewDistributor,
  deleteDistributorById,
};
