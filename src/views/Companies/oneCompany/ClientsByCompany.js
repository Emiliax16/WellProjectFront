import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getClientsByCompany } from '../../../services/clientServices';
import { useCookies } from 'react-cookie';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import ClientRow from '../../Clients/allClients/ClientRow';

function ClientsByCompany() {
  const { id: companyId } = useParams();
  const [clients, setClients] = useState([]);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [cookies] = useCookies(['token']);

  const getClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clients = await getClientsByCompany(cookies.token, companyId);
      setClients(clients);
    } catch (error) {
      console.log('Error fetching clients', error);
      setError('Error al cargar los clientes por empresa')
    } finally {
      setLoading(false);
    }
  }, [cookies.token, setLoading, setError, companyId]);
    
  const thStyle = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';
  
  useEffect(() => {
    getClients();
  }, [getClients])

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Clientes de la empresa ID {companyId} </div>
      <div className='flex justify-center items-center'>
      { 
        loading ? (
        <div>{loadingIcon}</div>
        ) : (
        error ? (
          <Alerts type='error' message={error} />
        ) : (
          <div className='bg-white p-2 m-2 min-w-full'>
          <table className='min-w-full'>
            <thead>
            <tr>
              <th className={thStyle}>Client Name</th>
              <th className={thStyle}>Client Status</th>
              <th className={thStyle}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} companyId={companyId} />
            ))}
            </tbody>
          </table>
          </div>
        )
        )
      }
      </div>
    </div>
  );
}

export default ClientsByCompany