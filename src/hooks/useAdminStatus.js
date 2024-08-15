import { useState, useCallback } from 'react';
import { getUserRole } from '../services/userServices';
import { useCookies } from 'react-cookie';

const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [cookies] = useCookies(['token']);

  const setAdminStatus = useCallback(async (user) => {
    try {
      if (user && cookies.token) {
        const response = await getUserRole(user.id, cookies.token);
        const role = response;
        setIsAdmin(role.type === 'admin');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setIsAdmin(false);
    }
  }, [cookies.token]);

  return [ isAdmin, setAdminStatus ];
};

export default useAdminStatus;
