import { useNavigate } from "react-router-dom";

function DistributorRow({ distributor }) {
  const navigate = useNavigate();
  const { user } = distributor;
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user.name}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user.isActived ? "Active" : "Inactive"}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex gap-x-4 justify-start items-center">
          <button
            onClick={() => navigate(`/distributors/${distributor.id}`)}
            className="p-2 bg-pink-500 text-white rounded-md"
          >
            Details
          </button>
          <button
            onClick={() => navigate(`/distributors/${distributor.id}/edit`)}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/distributors/${distributor.id}/delete`)}
            className="p-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default DistributorRow;
