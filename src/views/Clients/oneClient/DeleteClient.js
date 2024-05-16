import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteClientById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import PasswordDialog from '../../../components/PasswordDialog';
import { clientFront } from '../../../utils/routes.utils';

function DeleteClient() {
  const { id: clientId } = useParams();
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [cookies] = useCookies(['token']);

  const handleDeleteClient = async (password) => {
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD;
    if (password === requiredPassword) {
      try {
        setLoading(true);
        await deleteClientById(cookies.token, clientId);
        navigate(`/${clientFront.urlClients}`);
      } catch (err) {
        setError('No se pudo eliminar al cliente: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Contraseña incorrecta');
      setDialogOpen(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>{loadingIcon}</div>
      ) : error ? (
        <Alerts type="error" message={error} />
      ) : (
        <PasswordDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleDeleteClient}
        />
      )}
    </div>
  );
}

export default DeleteClient;
