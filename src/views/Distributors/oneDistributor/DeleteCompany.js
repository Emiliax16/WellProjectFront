import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteCompanyById } from '../../../services/companyServices';
import useLoading from '../../../hooks/useLoading';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import PasswordDialog from '../../../components/PasswordDialog';
import { companyFront } from '../../../utils/routes.utils';

function DeleteCompany() {
  const { id: companyId } = useParams();
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [cookies] = useCookies(['token']);

  const handleDeleteCompany = async (password) => {
    const requiredPassword = process.env.REACT_APP_DELETE_PASSWORD;
    if (password === requiredPassword) {
      try {
        setLoading(true);
        await deleteCompanyById(cookies.token, companyId);
        navigate(`/${companyFront.urlCompanies}`);
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
          onConfirm={handleDeleteCompany}
        />
      )}
    </div>
  );
}

export default DeleteCompany;
