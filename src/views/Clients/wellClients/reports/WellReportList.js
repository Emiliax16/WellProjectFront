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
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const { page, size, setPage } = usePagination();

  const handlePagination = async () => {
    setPage(page + 1);
    fetchWellReports();
  }

  const fetchWellReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reports = await getWellReports(cookies.token, clientId, code, 2, size);
      console.log("LALALALALALAL", reports.rows)
      if (wellReports.length > 0) {
        console.log("vamos a concatenar dos weas")
        console.log("El page y el size es:", page, size)
        console.log("wellReports", wellReports)
        console.log("reports.rows", reports.rows)
        setWellReports(wellReports.concat(reports.rows));
      }
      else {
        setWellReports(reports.rows);
      }
    } catch (error) {
      console.log('Error fetching well reports', error);
      setError('Error cargando los reportes del pozo.');
    } finally {
      setLoading(false);
    }
  }
  , [cookies.token, clientId, code, page, size, setLoading, setError]);

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
            <EnhancedTable rows={wellReports} columns={headCells} wellCode={code} handlePagination={handlePagination}/>
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