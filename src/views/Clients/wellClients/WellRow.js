import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../context/AuthContext';


function WellRow({ well }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const handleSeeReportsNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}`, { state: { well } });
  }

  const handleEditNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}/edit`, { state: { well } });
  }

  const handleDeleteNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}/delete`, { state: { well } });
  }

  return (
    <div>
      <div key={well.code} className='border-b-2 border-gray-200 p-2 shadow-xl mt-2'>
        <div className='text-lg'>Well Code: {well.code}</div>
        <div className='text-lg'>Well Name: {well.name}</div>
        <div className='text-lg'>Well Status: {well.isActived === 'true' ? 'Active' : 'Disabled '}</div>
        <div className='text-lg'>Well Created: {well.createdAt}</div>
        <div className=''>
          {
            isAdmin && (
              <div>
                <button onClick={handleEditNavigation} className='p-2 bg-blue-500 text-white rounded-md'>Edit</button>
                <button onClick={handleDeleteNavigation} className='p-2 bg-red-500 text-white rounded-md'>Delete</button>
              </div>
            )
          }
        </div>
        <button onClick={handleSeeReportsNavigation} className='p-2 bg-pink-500 text-white rounded-md'>See Reports</button>
      </div>
    </div>
  )
}

export default WellRow