import { useState, useCallback } from 'react';
import { getUserRole } from '../services/userServices';
import { useCookies } from 'react-cookie';

const useCompanyStatus = () => {
  const [isCompany, setIsCompany] = useState(false);
  const [cookies] = useCookies(['token']);

  const setCompanyStatus = useCallback(async (user) => {
    try {
      if (user && cookies.token) {
        const response = await getUserRole(user.id, cookies.token);
        const role = response;
        setIsCompany(role.type === 'company');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setIsCompany(false);
    }
  }, [cookies.token]);

  return [ isCompany, setCompanyStatus ];
};

export default useCompanyStatus;
