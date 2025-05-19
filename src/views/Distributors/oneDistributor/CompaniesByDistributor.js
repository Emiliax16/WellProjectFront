import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCompaniesByDistributor } from '../../../services/companyServices';
import { useCookies } from 'react-cookie';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import CompanyRow from '../../Companies/allCompanies/CompanyRow';

function CompaniesByDistributor() {
  const { id: distributorId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [cookies] = useCookies(['token']);

  const getCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companies = await getCompaniesByDistributor(cookies.token, distributorId);
      setCompanies(companies);
    } catch (error) {
      console.log('Error fetching companies', error);
      setError('Error al cargar los empresas por distribuidora')
    } finally {
      setLoading(false);
    }
  }, [cookies.token, setLoading, setError, distributorId]);
    
  const thStyle = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';
  
  useEffect(() => {
    getCompanies();
  }, [getCompanies])

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Empresas de la distribuidora ID {distributorId} </div>
      <div className='flex justify-center items-center'>
      { 
        loading ? (
        <div>{loadingIcon}</div>
        ) : (
        error ? (
          <Alerts type='error' message={error} />
        ) : (
          <div className='bg-white p-2 m-2 min-w-full'>
          <table className='min-w-full'>
            <thead>
            <tr>
              <th className={thStyle}>Empresa Name</th>
              <th className={thStyle}>Empresa Status</th>
              <th className={thStyle}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {companies.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
            </tbody>
          </table>
          </div>
        )
        )
      }
      </div>
    </div>
  );
}

export default CompaniesByDistributor