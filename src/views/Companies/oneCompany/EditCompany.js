import CompanyForm from '../../../components/companyForm';
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useLocation } from 'react-router-dom';
import { getCompanyDetailsById } from '../../../services/companyServices';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';

function EditCompany() {
  const { id: companyId } = useParams();
  const location = useLocation();
  const [cookies] = useCookies(['token']);
  const [company, setCompany] = useState(null);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [ companyInfo, setCompanyInfo ] = useState(null);
  
  const editedFromDistributor = location.state?.editedFromDistributor || false;
  const distributorId = location.state?.distributorId || null;

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companyDetails = await getCompanyDetailsById(cookies.token, companyId);
      if (!companyDetails) throw new Error("No company data available");
      setCompany(companyDetails);
    } catch (err) {
      setError('No se puede editar el company porque hay un error obteniendo los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, companyId, setLoading, setError]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    if (company) {
      setCompanyInfo({
        id: companyId,
        name: company.user.name,
        companyRut: company.companyRut,
        companyLogo: company.companyLogo,
        location: company.location,
        phoneNumber: company.phoneNumber,
        isActived: company.user.isActived,
        roleId: company.user.roleId,
        roleType: company.role,
        email: company.user.email,
        recoveryEmail: company.recoveryEmail,
      });
    }
  }, [company, companyId]);


  return (
    <div>
      { loading ? (
          <div>{loadingIcon}</div>
        ) : companyInfo ? (
          <CompanyForm 
            companyInfo={companyInfo} 
            createdFromDistributor={editedFromDistributor}
            distributorId={distributorId}
          />
        ) : error ? (
          <Alerts type="error" message={error} />
        ) : (
          <div>No hay datos</div>
        )
      }
    </div>
  )
}

export default EditCompany