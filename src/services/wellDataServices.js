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

export { sendReports }