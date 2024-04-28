import { useState, useEffect } from 'react';
import { getAllClients } from '../../../services/clientServices';
import ClientRow from './ClientRow';

function ClientList() {
  const [clients, setClients] = useState([])

  const getClients = async () => {
    const clients = await getAllClients();
    setClients(clients);
  }

  const thStyle = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';

  useEffect(() => {
    getClients();
  }, [])

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Welcome to the clients view</div>
      <table className="min-w-full leading-normal mt-2">
        <thead>
          <tr>
            <th className={thStyle}>
              Client Name
            </th>
            <th className={thStyle}>
              Status
            </th>
            <th className={thStyle}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? clients.map((client, index) => (
            <ClientRow key={index} client={client} />
          )) : (
            <tr>
              <td colSpan="3" className="text-center py-5 border-b border-gray-200 bg-white text-sm">
                No clients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClientList;
