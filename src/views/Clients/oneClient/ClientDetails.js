import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientDetailsById } from '../../../services/clientServices';
import { useAuth } from '../../../context/AuthContext';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import ClientDetailsText from '../../../texts/Clients/oneClients/ClientDetailsText.json';


function ClientDetails() {
  const { id: clientId } = useParams();
  const [user, setUser] = useState(null);
  const { isAdmin } = useAuth();
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
      if (!clientDetails) throw new Error(ClientDetailsText.alerts.noData);
      setUser(clientDetails);
    } catch (err) {
      console.log(err.message)
      setError(ClientDetailsText.alerts.error);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, setLoading, setError]);
  

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);
  
  return (
    <div>
      <div className='bg-green-500 text-white p-2'>{ClientDetailsText.titles.principalTitle}</div>
      <div className='flex justify-center items-center'>
        { loading ? (
          <div>{loadingIcon}</div>
        ) : 
        <div className='bg-white p-2 m-2'>
          {!error && user ? (
            <>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.fullName} {user.person.fullName}</div>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.alias} {user.name}</div>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.email} {user.email}</div>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.personalEmail} {user.person.personalEmail}</div>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.location} {user.person.location}</div>
              <div className='text-lg font-semibold'>{ClientDetailsText.attributes.phone} {user.person.phoneNumber}</div>
              <button onClick={() => navigate(`/clients/${clientId}/wells`)} className="p-2 bg-pink-500 text-white rounded-md">{ClientDetailsText.buttons.seeWells}</button>
              {
                isAdmin && (
                  <button onClick={handleCreateWell} className="p-2 bg-blue-500 text-white rounded-md">{ClientDetailsText.buttons.createWells}</button>
                )
              }
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
