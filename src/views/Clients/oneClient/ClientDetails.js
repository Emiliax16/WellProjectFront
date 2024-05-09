import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientDetailsById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';

function ClientDetails() {
  const { id: clientId } = useParams();
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  
  const handleCreateWell = () => {
    navigate(`/clients/${clientId}/wells/new`);
  }
  
  const fetchClientDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientDetails = await getClientDetailsById(cookies.token, clientId);
      if (!clientDetails) throw new Error("No client data available");
      setUser(clientDetails);
    } catch (err) {
      setError('Error obteniendo los datos del cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, setLoading, setError]);
  

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);
  
  return (
    <div>
      <div className='bg-green-500 text-white p-2'>User Details</div>
      <div className='flex justify-center items-center'>
        { loading ? (
          <div>{loadingIcon}</div>
        ) : 
        <div className='bg-white p-2 m-2'>
          {!error && user ? (
            <>
              <div className='text-lg font-semibold'>USER ID: {user.id}</div>
              <div className='text-lg font-semibold'>Client Name: {user.name}</div>
              <div className='text-lg font-semibold'>Client Email: {user.email}</div>
              <div className='text-lg font-semibold'>Client Created: {user.createdAt}</div>
              <button onClick={() => navigate(`/clients/${clientId}/wells`)} className="p-2 bg-pink-500 text-white rounded-md">Wells</button>
              <button onClick={handleCreateWell} className="p-2 ml-2 bg-pink-500 text-white rounded-md"> Create Well </button>
            </>
          ) : (
            <Alerts type="error" message={error} />
          )}
        </div>
      }
      </div>
    </div>
  );
}


export default ClientDetails
