import { useState, useCallback } from 'react';

const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const setAdminStatus = useCallback((user) => {
    setIsAdmin(user?.roleId === 1);
  }, []);

  return [ isAdmin, setAdminStatus ];
};

export default useAdminStatus;
