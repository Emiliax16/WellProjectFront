import { useNavigate } from 'react-router-dom';

function CompanyRow({ company }) {
  const navigate = useNavigate();
  const { user } = company;
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user.name}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user.isActived ? 'Active' : 'Inactive'}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex gap-2 justify-start items-center">
          <button onClick={() => navigate(`/companies/${company.id}`)} className="p-2 bg-pink-500 text-white rounded-md">Details</button>
          <button onClick={() => navigate(`/companies/${company.id}/edit`)} className="p-2 bg-blue-500 text-white rounded-md">Edit</button>
          <button onClick={() => navigate(`/companies/${company.id}/delete`, {state: {company}})} className="p-2 bg-red-500 text-white rounded-md">Delete</button>
        </div>
      </td>

    </tr>
  );
}

export default CompanyRow;