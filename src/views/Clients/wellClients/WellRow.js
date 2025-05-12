import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../context/AuthContext';
import { useCookies } from 'react-cookie';
import { activateWell } from '../../../services/wellServices';
import useError from '../../../hooks/useError';
import useSuccess from '../../../hooks/useSuccess';
import Alerts from '../../../components/Alerts';
import { useState } from 'react';
import WellRowText from '../../../texts/Wells/WellRowText.json';
import Tooltip from '@mui/material/Tooltip';



function WellRow({ well }) {
  const navigate = useNavigate();
  const { isAdmin, isCompany } = useAuth();
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

  const isActivationAllowed = (well) => {
    console.log('this is the well');  
    console.log(well);
    return Boolean(well?.rutEmpresa && well?.rutUsuario && well?.password);
  };
  

  const handleActivation = async () => {
    setError(null);
    setSuccess(null);
    try {
      await activateWell(cookies.token, well.id);
      setActive(!active);
      setSuccess(WellRowText.alerts.success);
    } catch (error) {
      console.log(error);
      setError(WellRowText.alerts.error);
    }
  }

  return (
    <div>
      <div key={well.code} className='border-b-2 border-gray-200 p-2 shadow-xl mt-2'>
        {error && <Alerts type='error' message={error} />}
        {success && <Alerts type='success' message={success} />}
        <div className='text-lg'>{WellRowText.attributes.code} {well.code}</div>
        <div className='text-lg'>{WellRowText.attributes.name} {well.name}</div>
        <div className='text-lg'>{WellRowText.attributes.state} {active ? 'Activado' : 'Desactivado'}</div>
        <div className='text-lg'>{WellRowText.attributes.location} {well.location}</div>
        { well.rutEmpresa ? <div className='text-lg'>{WellRowText.attributes.rutEmpresa} {well.rutEmpresa}</div> : null }
        { well.rutInformante ? <div className='text-lg'>{WellRowText.attributes.rutInformante} {well.rutInformante}</div> : null }
        <div className=''>
          {
            (isAdmin || isCompany) && (
              <div>
                <button onClick={handleEditNavigation} className='p-2 bg-blue-500 text-white rounded-md'>{WellRowText.buttons.edit}</button>
                <button onClick={handleDeleteNavigation} className='p-2 bg-red-500 text-white rounded-md'>{WellRowText.buttons.delete}</button>
                <Tooltip
                  title={
                    !isActivationAllowed(well)
                      ? "Faltan campos requeridos: rut de empresa, rut informante o contraseña"
                      : ""
                  }
                  placement="top"
                >
                  <span>
                    <button
                      onClick={handleActivation}
                      disabled={!isActivationAllowed(well)}
                      className={`p-2 ${
                        active ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {active ? WellRowText.buttons.deactivate : WellRowText.buttons.activate}
                    </button>
                  </span>
                </Tooltip>
              </div>
            )
          }
        </div>
        <button onClick={handleSeeReportsNavigation} className='p-2 bg-pink-500 text-white rounded-md'>{WellRowText.buttons.seeReports}</button>
      </div>
    </div>
  )
}

export default WellRow