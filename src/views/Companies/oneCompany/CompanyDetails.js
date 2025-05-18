import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyDetailsById } from '../../../services/companyServices';
import { useAuth } from '../../../context/AuthContext';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import CompanyDetailsText from '../../../texts/Companies/oneCompany/CompanyDetailsText.json';


function CompanyDetails() {
  const { id: companyId } = useParams();
  const [company, setCompany] = useState(null);
  const { isAdmin, isCompany } = useAuth();
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  
  const handleSeeClients = () => {
    navigate(`/companies/${companyId}/clients`);
  }

  const handleCreateClients = () => {
    navigate('/clients/new', { state: { createdFromCompany: true, companyId: companyId } });
  }
  
  const fetchCompanyDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companyDetails = await getCompanyDetailsById(cookies.token, companyId);
      if (!companyDetails) throw new Error(CompanyDetailsText.alerts.noData);
      setCompany(companyDetails);
    } catch (err) {
      console.log(err.message)
      setError(CompanyDetailsText.alerts.error);
    } finally {
      setLoading(false);
    }
  }, [cookies.token, companyId, setLoading, setError]);
  

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);
  
  return (
    <div>
      <div className='bg-green-500 text-white p-2'>{CompanyDetailsText.titles.principalTitle}</div>
      <div className='flex justify-center items-center'>
        { loading ? (
          <div>{loadingIcon}</div>
        ) : 
        <div className='bg-white p-2 m-2'>
          {!error && company ? (
            <>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.name} {company.user.name}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.rut} {company.companyRut}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.email} {company.user.email}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.logoUrl} {company.companyLogo}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.location} {company.location}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.phone} {company.phoneNumber}</div>
              <div className='text-lg font-semibold'>{CompanyDetailsText.attributes.recoveryEmail} {company.recoveryEmail}</div>
              {
                (isAdmin || isCompany) && (
                  <>
                    <button onClick={handleCreateClients} className='p-2 my-5 bg-blue-500 text-white rounded-md'>{CompanyDetailsText.buttons.createClient}</button>
                    <br></br>
                    <button onClick={handleSeeClients} className="p-2 bg-blue-500 text-white rounded-md">{CompanyDetailsText.buttons.seeClients}</button>
                  </>
                )
              }
            </>
          ) : (
            <Alerts type="error" message={error} />
          )}
        </div>
      }
      </div>
    </div>
  );
}


export default CompanyDetails
