import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientDetailsById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';

function ClientDetails() {
  const { id: clientId } = useParams();
  const [client, setClient] = useState({});
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const [error, setError] = useState(null);
  
  const handleCreateWell = () => {
    navigate(`/clients/${clientId}/wells/new`);
  }
  
  const fetchClientDetails = useCallback(async () => {
    try {
      setLoading(true);
      const clientDetails = await getClientDetailsById(cookies.token, clientId);
      setClient(clientDetails);
    } catch (err) {
      setError('Failed to fetch details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, setLoading]);
  

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]) 

  if (error) return <p>Error: {error}</p>;


  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Client Details</div>
      <div className='flex justify-center items-center'>
        { loading ? (
          <div>{loadingIcon}</div>
        ) : 
        <div className='bg-white p-2 m-2'>
          {client ? (
            <>
              <div className='text-lg font-semibold'>Client ID: {client.id}</div>
              <div className='text-lg font-semibold'>Client Name: {client.name}</div>
              <div className='text-lg font-semibold'>Client Email: {client.email}</div>
              <div className='text-lg font-semibold'>Client Created: {client.createdAt}</div>
              <button onClick={() => navigate(`/clients/${client.id}/wells`)} className="p-2 bg-pink-500 text-white rounded-md">Wells</button>
              <button onClick={handleCreateWell} className="p-2 ml-2 bg-pink-500 text-white rounded-md"> Create Well </button>
            </>
          ) : (
            <p>No client data available.</p>
          )}
        </div>
      }
      </div>
    </div>
  );
  
}

export default ClientDetails
