import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../context/AuthContext';
import { useCookies } from 'react-cookie';
import { activateWell } from '../../../services/wellServices';
import useError from '../../../hooks/useError';
import useSuccess from '../../../hooks/useSuccess';
import Alerts from '../../../components/Alerts';
import { useState } from 'react';


function WellRow({ well }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cookies] = useCookies(['token']);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const [ active, setActive ] = useState(well.isActived);

  const handleSeeReportsNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}`, { state: { well } });
  }

  const handleEditNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}/edit`, { state: { well } });
  }

  const handleDeleteNavigation = () => {
    navigate(`/clients/${well.clientId}/wells/${well.code}/delete`, { state: { well } });
  }

  const handleActivation = async () => {
    setError(null);
    setSuccess(null);
    try {
      await activateWell(cookies.token, well.id);
      setActive(!active);
      setSuccess('Estado del pozo cambiado correctamente.');
    } catch (error) {
      console.log(error);
      setError('Error al activar/desactivar el pozo.');
    }
  }

  return (
    <div>
      <div key={well.code} className='border-b-2 border-gray-200 p-2 shadow-xl mt-2'>
        {error && <Alerts type='error' message={error} />}
        {success && <Alerts type='success' message={success} />}
        <div className='text-lg'>Well Code: {well.code}</div>
        <div className='text-lg'>Well Name: {well.name}</div>
        <div className='text-lg'>Well Status: {active ? 'Activado' : 'Desactivado'}</div>
        <div className='text-lg'>Well Created: {well.createdAt}</div>
        <div className=''>
          {
            isAdmin && (
              <div>
                <button onClick={handleEditNavigation} className='p-2 bg-blue-500 text-white rounded-md'>Edit</button>
                <button onClick={handleDeleteNavigation} className='p-2 bg-red-500 text-white rounded-md'>Delete</button>
                <button onClick={handleActivation} className='p-2 bg-green-500 text-white rounded-md'>{well.isActived === 'true' ? 'Disable' : 'Activate'}</button>
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