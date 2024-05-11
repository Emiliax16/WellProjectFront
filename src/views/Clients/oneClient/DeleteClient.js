import { useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteClientById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import { clientFront } from  '../../../utils/routes.utils';

function DeleteClient() {
  const { id: clientId } = useParams();
  const [cookies] = useCookies(['token']);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const navigate = useNavigate();
  
  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteClientById(cookies.token, clientId);
      navigate(`/${clientFront.urlClients}`);
    } catch (err) {
      setError('No se pudo eliminar al cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, clientId, setLoading, setError, navigate]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return (
    <div>
      { loading ? (
          <div>{loadingIcon}</div>
        ) : error ? (
          <Alerts type="error" message={error} />
        ) : (
          <div></div>
        )
      }
    </div>
  )
}

export default DeleteClient