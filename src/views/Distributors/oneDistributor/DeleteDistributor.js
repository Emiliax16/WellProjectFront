import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteDistributorById } from '../../../services/distributorService';
import useLoading from '../../../hooks/useLoading';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import PasswordDialog from '../../../components/PasswordDialog';
import { distributorFront } from '../../../utils/routes.utils';

function DeleteDistributor() {
  const { id: distributorId } = useParams();
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [cookies] = useCookies(['token']);

  const handleDeleteDistributor = async (password) => {
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD;
    if (password === requiredPassword) {
      try {
        setLoading(true);
        await deleteDistributorById(cookies.token, distributorId);
        navigate(`/${distributorFront.urlDistributor}`);
      } catch (err) {
        setError('No se pudo eliminar la distribuidora: ' + err.message);
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
          onConfirm={handleDeleteDistributor}
        />
      )}
    </div>
  );
}

export default DeleteDistributor;
