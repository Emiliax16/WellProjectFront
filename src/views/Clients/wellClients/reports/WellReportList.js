import { useEffect, useState, useCallback } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useAuth } from '../../../../context/AuthContext';
import { getWellReports, getClientWell } from "../../../../services/clientServices";
import { sendReports } from "../../../../services/wellDataServices";
import { useCookies } from 'react-cookie';
import usePagination from '../../../../hooks/usePagination';
import useLoading from '../../../../hooks/useLoading';
import useError from '../../../../hooks/useError';
import Alerts from '../../../../components/Alerts';
import EnhancedTable from './ReportsTable'
import { headCells } from '../../../../utils/wellReport.utils'
import DatePicker from '../../../../components/DatePicker';
import { Button, Tooltip } from '@mui/material';

function WellReportList() {
  const { clientId, code } = useParams();
  const { isAdmin, isCompany } = useAuth();
  const location = useLocation();
  const [cookies] = useCookies(['token']);
  const [wellReports, setWellReports] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const { page, size, setPage, setSize } = usePagination();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dataMonth, setDataMonth] = useState(selectedMonth);
  const [dataYear, setDataYear] = useState(selectedYear);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
    setWellReports([]);
    setNumRows(0);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPage(0);
    setWellReports([]);
    setNumRows(0);
  };

  const [well, setWell] = useState(location.state?.well || null);
  const fetchWell = useCallback(async () => {
    if (!well) {
      setLoading(true);
      try {
        const wellData = await getClientWell(cookies.token, clientId, code);
        setWell(wellData);
      } catch (error) {
        console.error('Error fetching well', error);
        setError('Error cargando los datos del pozo.');
      } finally {
        setLoading(false);
      }
    }
  }, [well, cookies.token, clientId, code, setLoading, setError]);
  
  useEffect(() => {
    fetchWell();
  }, [fetchWell]);  
  
  const fetchWellReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (
        dataMonth === selectedMonth &&
        dataYear === selectedYear &&
        wellReports.length > page * size
      ) {
        console.log('Reports already fetched');
        return;
      }
      const reports = await getWellReports(cookies.token, clientId, code, page, size, selectedMonth, selectedYear);
      if (page === 0){
        setWellReports(reports.rows);
      } 
      else {
        setWellReports(prevReports => prevReports.concat(reports.rows));
      }
      setNumRows(reports.count);
      setDataMonth(selectedMonth);
      setDataYear(selectedYear);
    } catch (error) {
      console.log('Error fetching well reports', error);
      setError('Error cargando los reportes del pozo.');
    } finally {
      setLoading(false);
    }
  }
  , [cookies.token, clientId, code, page, size, setLoading, setError, wellReports.length, dataMonth, dataYear, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchWellReports();
  }
  , [fetchWellReports]);

  const isWellActive = well?.isActived;

  const handleSendReports = async () => {
    try {
      setLoading(true);
      if (!isWellActive) {
        throw new Error('El pozo está desactivado.');
      }

      if (wellReports && wellReports.length !== 0) {
        const pendingReports = wellReports.filter((report) => !report.sent);
        if (pendingReports.length === 0) {
          throw new Error('No hay reportes pendientes.');
        } else {
          await sendReports(pendingReports);
        }
      }
    } catch (error) {
      console.error('Error enviando reportes:', error);
      setError('Error enviando los reportes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      { 
        loading ? (
          <div>{loadingIcon}</div>
        ) : error ? (
          <Alerts type='error' message={error} />
        ) : (
          <div>
             <DatePicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              handleMonthChange={handleMonthChange}
              handleYearChange={handleYearChange}
            />

            {(wellReports.length > 0 && (isAdmin || isCompany)) && (
              <div style={{ marginBottom: '20px', marginLeft: '20px' }}>
                <Tooltip
                  title={
                    isWellActive
                      ? 'Al presionar este botón, se enviarán todos los reportes pendientes de esta página a la DGA.'
                      : 'Esta opción está deshabilitada mientras el pozo esté desactivado.'
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendReports}
                      disabled={!isWellActive}
                    >
                      Enviar reportes a la DGA
                    </Button>
                  </span>
                </Tooltip>
              </div>
            )}

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
