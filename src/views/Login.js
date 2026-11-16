import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import Input from '../components/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { getRedirectionPath } from '../strategies/redirectionStrategy';
import useError from '../hooks/useError';
import Alerts from '../components/Alerts';
import { mensajeDeError, MENSAJE_SESION_VENCIDA } from '../utils/apiErrors';

function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm();

  const { login, user, isAdmin, isCompany, isDistributor } = useAuth()
  const { error, setError } = useError();

  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const sesionVencida = parametros.get('sesion') === 'vencida';

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;
    setError(null);
    try {
      const sesion = await login(email, password)
      const ruta = getRedirectionPath(sesion.isAdmin, sesion.isCompany, sesion.isDistributor, sesion.user)
      if (ruta === '/login') {
        // La sesión se abrió, pero la cuenta no tiene un perfil al que llevarla.
        // Antes el formulario se quedaba quieto, sin ningún aviso.
        setError('Tu cuenta no tiene un perfil asociado. Contacta al administrador.')
        return
      }
      navigate(ruta, { replace: true })
    } catch (error) {
      setError(mensajeDeError(error, 'Error al iniciar sesión'))

    }
  };

  useEffect(() => {
    if ((user && user.client) || isAdmin || isCompany || isDistributor) {
      const redirectionPath = getRedirectionPath(isAdmin, isCompany, isDistributor, user);
      navigate(redirectionPath, { replace: true });
    }
  }, [user, navigate, isAdmin, isCompany, isDistributor]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Inicio de sesión</h2>
              <p className="mt-1 text-sm text-gray-600">
                Bienvenido a Pro-Medición, por favor inicie sesión para continuar.
              </p>
            </div>
            {!error && sesionVencida && <Alerts type="error" message={MENSAJE_SESION_VENCIDA} /> }
            {error && <Alerts type="error" message={error} /> }
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input
                name="Correo Electrónico" 
                label="email" 
                register={register}
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  }, 
                  pattern: {
                    value: /^\S+@\S+\.\S+$/, 
                    message: 'El correo no es válido'
                  } 
                }} 
                errors={errors}  
              />
              <Input 
                name="Contraseña"
                label="password"
                type="password"
                register={register}
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  },  
                  maxLength: 100
                }}
                errors={errors} 
              />
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-60">
                {isSubmitting ? 'Ingresando…' : 'Iniciar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );  
}

export default Login
