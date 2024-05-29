import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import Input from '../components/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { getRedirectionPath } from '../strategies/redirectionStrategy';

function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();

  const { login, user, isAdmin } = useAuth()

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;
    try {
      await login(email, password)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if ((user && user.client) || isAdmin) {
      const redirectionPath = getRedirectionPath(isAdmin, user);
      navigate(redirectionPath);
    }
  }, [user, navigate, isAdmin]);

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
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Iniciar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );  
}

export default Login
