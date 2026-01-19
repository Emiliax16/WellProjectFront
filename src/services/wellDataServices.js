import apiClient  from './index';
import { wellDataBack } from '../utils/routes.utils';

const { sendWellData } = wellDataBack;

const sendReports = async (reports) => {
  try {
    const reportIds = reports.map(report => report.id);
    const url = `${sendWellData}`;
    const response = await apiClient.post(
      url,
      { reportIds },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const bulkDeleteReports = async (reportIds) => {
  try {
    const url = '/wellData/bulk';
    const response = await apiClient.delete(url, {
      data: { reportIds }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { sendReports, bulkDeleteReports }