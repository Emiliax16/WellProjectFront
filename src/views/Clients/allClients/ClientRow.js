import { useNavigate } from 'react-router-dom';

function ClientRow({ client }) {
  const navigate = useNavigate();
  const { user } = client;
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" onClick={() => navigate(`/user/${client.id}`)}>
        {user.name}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user.isActived ? 'Active' : 'Inactive'}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button onClick={() => navigate(`/clients/${client.id}`)} className="p-2 bg-pink-500 text-white rounded-md">Details</button>
      </td>
    </tr>
  );
}

export default ClientRow;