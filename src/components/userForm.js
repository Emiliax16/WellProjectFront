import React from 'react'
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import Input from './input';
import Select from './select';
import { postNewClient } from '../services/clientServices';
import { useNavigate } from 'react-router-dom';
import { clientFront } from  '../utils/routes.utils';
import Alerts from './Alerts';
import useError from '../hooks/useError';
import NewClientText from '../texts/Clients/oneClients/NewClientText.json'
import EditClientText from '../texts/Clients/oneClients/EditClientText.json'

function UserForm( {userInfo = { id: '', name: '', alias: '', location: '', phoneNumber: '', isActived: true, roleId: 2, email: '', personalEmail: '' }} ) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [cookies] = useCookies(['token']);
  const { error, setError } = useError();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (cookies.token) {
      try {
        if (!data.encrypted_password) delete data.encrypted_password;
        await postNewClient(cookies.token, data, userInfo.id);
        navigate(`/${clientFront.urlClients}`);
      } catch (error) {
        console.log(error)
        const message = error.response.data.errors ? error.response.data.errors.join(', ') : error.message;
        setError(message);
      }
    } else {
      setError('Token expirado, por favor inicie sesión nuevamente.');
    }
  };

  const texts = userInfo.id === '' ? NewClientText : EditClientText;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {
        error ?
          <div className='my-3'>
            <Alerts type="error" message={error} /> 
          </div>
        : null
      }
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">{texts.titles.principalTitle}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {texts.descriptions.principalDescription}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input 
                name="Nombre Completo" 
                label="fullName" 
                placeholder="Juan Pablo Cisternas"
                defaultValue = {userInfo.name}
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
                defaultValue = {userInfo.alias}
                placeholder="Juanpi"
                register={register}
                validation={{ required: false }}
                errors={errors}
              />
              <Input 
                name="Ubicación (Ciudad, Comuna 1234)"
                label="location"
                placeholder="Santiago, Arturo Prat 4715"
                defaultValue = {userInfo.location}
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
                defaultValue = {userInfo.phoneNumber}
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
                defaultValue = {userInfo.isActived}
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
                defaultValue = {userInfo.email}
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
                defaultValue = {userInfo.personalEmail}
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
                placeholder={userInfo.name ? texts.placeholders.password : ''}
                register={register}
                type="password"
                validation={userInfo.name ? {
                  minLength: {
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  }
                } : {
                  required: {
                    value: true,
                    message: 'Este campo es obligatorio',
                  },
                  minLength: {
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  }
                }}
                errors={errors}
              />
              <button 
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                {texts.buttons.submitButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm