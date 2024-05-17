import WellForm from '../../../components/wellForm';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';

function EditWell() {
  const [well, setWell] = useState(null);
  const location = useLocation();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  
  const fetchWell = useCallback(async (wellSend) => {
    setLoading(true);
    setError(null);
    try {
      if (!wellSend) throw new Error("No se encontraron datos del pozo");
      setWell(wellSend.well);
    } catch (err) {
      setError('No se puede editar el pozo porque hay un error obteniendo los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  useEffect(() => {
    if (location.state) {
      fetchWell(location.state);
    }
  }, [location.state, fetchWell]);

  return (
    <div>
      { loading ? (
          <div>{loadingIcon}</div>
        ) : well ? (
          <WellForm well={well} />
        ) : error ? (
          <Alerts type="error" message={error} />
        ) : (
          <div>No hay datos</div>
        )
      }
    </div>
  )
}

export default EditWell;