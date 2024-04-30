import React from 'react'
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import Input from '../../../components/input';
import Select from '../../../components/select';
import { postNewClient } from '../../../services/clientServices';
import { useNavigate } from 'react-router-dom';
import { clientFront } from  '../../../utils/routes.utils';

function NewClient() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log('User Form Data:', data);

    if (cookies.token) {
      await postNewClient(cookies.token, data);
      navigate(`/${clientFront.urlClients}`);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Registro de usuarios</h2>
              <p className="mt-1 text-sm text-gray-600">
                Creación de usuarios con diferentes funcionalidades dependiendo del rol asignado.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input 
                name="Nombre Completo" 
                label="fullName" 
                placeholder="Juan Pablo Cisternas" 
                register={register} 
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  }, 
                  maxLength: 70
                }} 
                errors={errors}  
              />
              <Input 
                name="Alias"
                label="name"
                placeholder="Juanpi"
                register={register}
                validation={{ required: false }}
                errors={errors}
              />
              <Input 
                name="Ubicación (Ciudad, Comuna 1234)"
                label="location"
                placeholder="Santiago, Arturo Prat 4715"
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
              <Input 
                name="Número de Teléfono"
                label="phoneNumber"
                placeholder="+56998145715"
                register={register}
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  },  
                  pattern: {
                    value: /^[0-9]+$/i, 
                    message: 'El número de teléfono no es válido'
                  } 
                }}
                errors={errors} 
              />
              <Select
                name="Estado"
                label="isActived"
                register={register}
                options={[
                  { value: true, label: 'Activo' },
                  { value: false, label: 'Inactivo (no podrá ingresar a la aplicación)' }
                ]}
              />
              <Select 
                name="Rol"
                label="roleId"
                register={register}
                options={[
                  { value: 1, label: 'Admin' },
                  { value: 2, label: 'Normal' }
                ]}
              />
              <Input 
                name="Correo Corporativo"
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
                name="Correo Personal"
                label="personalEmail"
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
                label="encrypted_password"
                register={register}
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  }, 
                  minLength: {
                    value: 8, 
                    message: 'La contraseña debe tener al menos 8 caracteres'
                  }
                }}
                errors={errors}
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Registrar Usuario
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewClient