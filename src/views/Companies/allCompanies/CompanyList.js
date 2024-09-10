import { useState, useEffect, useCallback} from 'react';
import { getAllCompanies } from '../../../services/companyServices';
import { useCookies } from 'react-cookie';
import useLoading from '../../../hooks/useLoading';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';
import CompanyRow from './CompanyRow';

function CompanyList() {
  const [companies, setCompanies] = useState([])
  const [loading, loadingIcon, setLoading] = useLoading();
  const { error, setError } = useError();
  const [cookies] = useCookies(['token']);

  const getcompanies = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const companies = await getAllCompanies(cookies.token);
        setCompanies(companies);
      } catch (error) {
        console.log('Error fetching companies', error);
        setError('Error al cargar las empresas')
      } finally {
        setLoading(false);
      }
    }
  , [cookies.token, setLoading, setError]);
  
  const thStyle = 'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';

  useEffect(() => {
    getcompanies();
  }, [getcompanies])

  return (
    <div>
      <div className='bg-green-500 text-white p-2'>Welcome to the companies view</div>
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
                      <th className={thStyle}>Company Name</th>
                      <th className={thStyle}>Company Status</th>
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

export default CompanyList;
