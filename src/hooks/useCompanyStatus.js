import { useState, useCallback } from 'react';
import { getUserRole } from '../services/userServices';
import { useCookies } from 'react-cookie';

const useCompanyStatus = () => {
  const [isCompany, setIsCompany] = useState(false);
  const [cookies] = useCookies(['token']);

  // Recibe el token como argumento: justo después del login, la cookie leída
  // en este render todavía es la anterior (o no existe). Si quien llama ya
  // conoce el rol (`rolConocido`), lo usa sin volver a consultarlo. Devuelve el
  // resultado para no depender de un render posterior.
  const setCompanyStatus = useCallback(async (user, token = cookies.token, rolConocido) => {
    try {
      if (!user || !token) {
        setIsCompany(false);
        return false;
      }
      const role = rolConocido ?? await getUserRole(user.id, token);
      const resultado = role?.type === 'company';
      setIsCompany(resultado);
      return resultado;
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      setIsCompany(false);
      return false;
    }
  }, [cookies.token]);

  return [ isCompany, setCompanyStatus ];
};

export default useCompanyStatus;
