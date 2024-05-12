import UserForm from '../../../components/userForm';
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { getClientDetailsById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';

function EditClient() {
  const { id: clientId } = useParams();
  const [cookies] = useCookies(['token']);
  const [client, setClient] = useState(null);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [ userInfo, setUserInfo ] = useState(null);
  
  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientDetails = await getClientDetailsById(cookies.token, clientId);
      if (!clientDetails) throw new Error("No client data available");
      setClient(clientDetails);
    } catch (err) {
      setError('No se puede editar el cliente porque hay un error obteniendo los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, setLoading, setError]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    if (client) {
      setUserInfo({
        id: clientId,
        name: client.person.fullName,
        alias: client.name,
        location: client.person.location,
        phoneNumber: client.person.phoneNumber,
        isActived: client.isActived,
        roleId: client.roleId,
        email: client.email,
        personalEmail: client.person.personalEmail
      });
    }
  }, [client, clientId]);


  return (
    <div>
      { loading ? (
          <div>{loadingIcon}</div>
        ) : userInfo ? (
          <UserForm userInfo = { userInfo } />
        ) : error ? (
          <Alerts type="error" message={error} />
        ) : (
          <div>No hay datos</div>
        )
      }
    </div>
  )
}

export default EditClient