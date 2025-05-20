import { useState, useCallback } from 'react';
import { getUserRole } from '../services/userServices';
import { useCookies } from 'react-cookie';

const useDistributorStatus = () => {
  const [isDistributor, setIsDistributor] = useState(false);
  const [cookies] = useCookies(['token']);

  const setDistributorStatus = useCallback(async (user) => {
    try {
      if (user && cookies.token) {
        const response = await getUserRole(user.id, cookies.token);
        const role = response;
        setIsDistributor(role.type === 'distributor');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setIsDistributor(false);
    }
  }, [cookies.token]);

  return [ isDistributor, setDistributorStatus ];
};

export default useDistributorStatus;
