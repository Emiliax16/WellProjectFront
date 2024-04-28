import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getClientWells } from '../../../services/clientServices';
import WellRow from './WellRow';

function ClientWells() {
  const { id: userId } = useParams();
  const [cookies] = useCookies(['token']);
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientWells = useCallback(async () => {
    try {
      setLoading(true);
      const wells = await getClientWells(cookies.token, userId);
      setWells(wells.wells);
    } catch (err) {
      setError('Failed to fetch wells');
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }
  , [cookies.token, userId]);

  useEffect(() => {
    fetchClientWells();
  }
  , [fetchClientWells]);

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Client Wells</div>
      <div className='flex justify-center items-center'>
        { loading ? (
          <div>Loading...</div>
        ) : error ? (
          <p>Error: {error}</p>
        ) :
        <div className='bg-white p-2 m-2'>
          {wells.length > 0 ? (
            <>
              {wells.map((well) => (
                <WellRow key={well.code} well={well} />
              ))}
            </>
          ) : (
            <p>No wells available.</p>
          )}
        </div>
      }
    </div>
  </div>
  )
}

export default ClientWells