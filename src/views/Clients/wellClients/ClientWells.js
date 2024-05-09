import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getClientWells } from '../../../services/clientServices';
import usePagination from '../../../hooks/usePagination';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import WellRow from './WellRow';

function ClientWells() {
  const { id: clientId } = useParams();
  const { page, size, setPage } = usePagination();
  const [cookies] = useCookies(['token']);
  const [wells, setWells] = useState([]);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();

  const fetchClientWells = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wells = await getClientWells(cookies.token, clientId, page, size);
      setWells(wells.rows);
    } catch (err) {
      console.log('Error fetching wells', err);
      setError('Error cargando los pozos del cliente.');
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, page, size, setLoading, setError]);

  useEffect(() => {
    fetchClientWells();
  }, [fetchClientWells]);

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Client Wells</div>
      <div className='flex justify-center items-center'>
        {loading ? (
          <div>{loadingIcon}</div>
        ) : error ? (
          <Alerts type='error' message={error} />
        ) : (
          <div className='bg-white p-2 m-2'>
            {wells.length > 0 ? (
              <>
                {wells.map((well) => (
                  <WellRow key={well.code} well={well} />
                ))}
                <div className='flex justify-around'>
                  <button onClick={() => setPage(page - 1)} className='p-2 bg-blue-500 text-white rounded-md'>Previous Page</button>
                  <button onClick={() => setPage(page + 1)} className='p-2 bg-blue-500 text-white rounded-md'>Next Page</button>
                </div>
              </>
            ) : (
              <p>Cliente no tiene pozos creados.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientWells;
