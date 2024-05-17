import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteWellByCode } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import PasswordDialog from '../../../components/PasswordDialog';
import { clientFront } from '../../../utils/routes.utils';

function DeleteWell() {
  const { id: clientId, code } = useParams();
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [cookies] = useCookies(['token']);
  const url = `/${clientFront.urlClients}/${clientId}/wells`;

  const handleDeleteClient = async (password) => {
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD;
    if (password === requiredPassword) {
      try {
        setLoading(true);
        await deleteWellByCode(cookies.token, clientId, code);
        navigate(url);
      } catch (err) {
        setError('No se pudo eliminar el pozo: ' + err.message);
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
          defaultPath={url}
        />
      )}
    </div>
  );
}

export default DeleteWell;
