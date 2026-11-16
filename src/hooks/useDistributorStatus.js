import { useState, useCallback } from 'react';
import { getUserRole } from '../services/userServices';
import { useCookies } from 'react-cookie';

const useDistributorStatus = () => {
  const [isDistributor, setIsDistributor] = useState(false);
  const [cookies] = useCookies(['token']);

  // Recibe el token como argumento: justo después del login, la cookie leída
  // en este render todavía es la anterior (o no existe). Si quien llama ya
  // conoce el rol (`rolConocido`), lo usa sin volver a consultarlo. Devuelve el
  // resultado para no depender de un render posterior.
  const setDistributorStatus = useCallback(async (user, token = cookies.token, rolConocido) => {
    try {
      if (!user || !token) {
        setIsDistributor(false);
        return false;
      }
      const role = rolConocido ?? await getUserRole(user.id, token);
      const resultado = role?.type === 'distributor';
      setIsDistributor(resultado);
      return resultado;
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      setIsDistributor(false);
      return false;
    }
  }, [cookies.token]);

  return [ isDistributor, setDistributorStatus ];
};

export default useDistributorStatus;
