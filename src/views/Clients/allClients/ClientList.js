import { useState, useEffect, useCallback} from 'react';
import { getAllClients } from '../../../services/clientServices';
import { useCookies } from 'react-cookie';
import ClientRow from './ClientRow';

function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['token']);

  const getClients = useCallback(async () => {
      setLoading(true);
      const clients = await getAllClients(cookies.token);
      setClients(clients);
      setLoading(false);
    }
  , [cookies.token]);
  
  const thStyle = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';

  useEffect(() => {
    getClients();
  }, [getClients])

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Welcome to the clients view</div>
      <div className='flex justify-center items-center'>
        { 
          loading ? (
            <div>Loading... </div>
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
                    <ClientRow key={client.id} client={client} />
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default ClientList;
