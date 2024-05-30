import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { getWellReports } from "../../../../services/clientServices";
import { useCookies } from 'react-cookie';
import usePagination from '../../../../hooks/usePagination';
import useLoading from '../../../../hooks/useLoading';
import useError from '../../../../hooks/useError';
import Alerts from '../../../../components/Alerts';
import EnhancedTable from './ReportsTable'
import { headCells } from '../../../../utils/wellReport.utils'

function WellReportList() {
  const { clientId, code } = useParams();
  const [cookies] = useCookies(['token']);
  const [wellReports, setWellReports] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const { page, size, setPage, setSize } = usePagination();

  const fetchWellReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching well reports');
    try {
      if ( wellReports.length > page * size) {
        console.log('Reports already fetched');
        return;
      }
      const reports = await getWellReports(cookies.token, clientId, code, page, size);
      console.log('Fetching well reports');
      console.log(reports);
      if (page === 0){
        setWellReports(reports.rows);
      } 
      else {
        setWellReports(prevReports => prevReports.concat(reports.rows));
      }
      setNumRows(reports.count);
    } catch (error) {
      console.log('Error fetching well reports', error);
      setError('Error cargando los reportes del pozo.');
    } finally {
      setLoading(false);
    }
  }
  , [cookies.token, clientId, code, page, size, setLoading, setError, wellReports.length]);

  useEffect(() => {
    fetchWellReports();
  }
  , [fetchWellReports]);

  return (
    <div>
      { 
        loading ? (
          <div>{loadingIcon}</div>
        ) : error ? (
          <Alerts type='error' message={error} />
        ) : (
          <div>
            { wellReports.length > 0 ? (
            <EnhancedTable 
              rows={wellReports} 
              columns={headCells} 
              wellCode={code} 
              count={numRows}
              page={page}
              size={size}
              setPage={setPage}
              setSize={setSize}
            />
            ) : (
              <p>No hay reportes disponibles.</p>
            )}
          </div>
        )
      }
    </div>
  )
}

export default WellReportList
