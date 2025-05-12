import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteClientById } from '../../../services/clientServices';
import useLoading from '../../../hooks/useLoading';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import PasswordDialog from '../../../components/PasswordDialog';
import { useAuth } from '../../../context/AuthContext';
import { clientFront, companyFront } from '../../../utils/routes.utils';
import { useLocation } from 'react-router-dom';

function DeleteClient() {
  const { id: clientId } = useParams();
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [cookies] = useCookies(['token']);
  const { isCompany } = useAuth();
  const location = useLocation();
  const { companyId } = location.state || {};

  const handleDeleteClient = async (password) => {
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD;
    if (password === requiredPassword) {
      try {
        setLoading(true);
        await deleteClientById(cookies.token, clientId);
        if (isCompany){
          navigate(`/${companyFront.urlCompanies}/${companyId}/${clientFront.urlClients}`);
        }
        else {
          navigate(`/${clientFront.urlClients}`);
        }
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
