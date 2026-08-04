import apiClient  from './index';
import { wellDataBack } from '../utils/routes.utils';

const { sendWellData } = wellDataBack;

const sendReports = async (token, reports) => {
  try {
    const reportIds = reports.map(report => report.id);
    const url = `${sendWellData}`;
    const response = await apiClient.post(
      url,
      { reportIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const bulkDeleteReports = async (token, reportIds) => {
  try {
    const url = '/wellData/bulk';
    const response = await apiClient.delete(url, {
      data: { reportIds },
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { sendReports, bulkDeleteReports }