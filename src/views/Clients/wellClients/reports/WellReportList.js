import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { getWellReports } from "../../../../services/clientServices";
import { useCookies } from 'react-cookie';
import usePagination from '../../../../hooks/usePagination';
import useLoading from '../../../../hooks/useLoading';

function WellReportList() {
  const { clientId, code } = useParams();
  const [cookies] = useCookies(['token']);
  const [wellReports, setWellReports] = useState([]);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { page, size, setPage } = usePagination();

  const fetchWellReports = useCallback(async () => {
    try {
      setLoading(true);
      const reports = await getWellReports(cookies.token, clientId, code, page, size);
      setWellReports(reports.rows);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching well reports', error);
    }
  }
  , [cookies.token, clientId, code, page, size, setLoading]);

  useEffect(() => {
    fetchWellReports();
  }
  , [fetchWellReports]);

  return (
    <div>
      { 
        loading ? (
          <div>{loadingIcon}</div>
        ) : (
          <div>
            <h1 className="text-center">Well Reports</h1>
            { wellReports.length > 0 ? (
            <> 
              <ul>
                { wellReports.map((report) => (
                  <li key={report.id} className="shadow-xl rounded-md p-10 font-medium">
                    <p>ID: {report.id}</p>
                    <p>DATE: {report.date}</p>
                    <p>CODE: {report.code}</p>
                    <p>HOUR: {report.hour}</p>
                    <p>NIVEL FREATICO: {report.nivel_freatico}</p>
                    <p>TOTALIZADOR: {report.totalizador}</p>
                  </li>
                ))}
              </ul>
              <div className='flex justify-around'>
                <button onClick={() => setPage(page - 1)} className='p-2 bg-blue-500 text-white rounded-md'>Previous Page</button>
                <button onClick={() => setPage(page + 1)} className='p-2 bg-blue-500 text-white rounded-md'>Next Page</button>
              </div>
              </>
            ) : (
              <p>No reports available.</p>
            )}
          </div>
        )
      }
    </div>
  )
}

export default WellReportList