import React from 'react'
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import Input from '../../../components/input';
import { useParams, useNavigate } from 'react-router-dom';
import { postNewWell } from '../../../services/clientServices';
import { clientFront, wellBack } from '../../../utils/routes.utils';
import useError from '../../../hooks/useError';
import Alerts from '../../../components/Alerts';

const { urlClients } = clientFront;
const { getWells } = wellBack;

function CreateWell() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();

  const { id: clientId } = useParams();
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const { error, setError } = useError();

  const onSubmit = async (data) => {
    setError(null);
    if (cookies.token) {
      try {
        await postNewWell(cookies.token, data, clientId);
        const url = `/${urlClients}/${clientId}/${getWells}`;
        navigate(url);
      } catch (error) {
        const message = error.response.data.errors ? error.response.data.errors.join(', ') : error.message;
        console.log('Error creating well', message)
        setError('Error al crear el pozo: ' + message);
      }
    }
  };

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
              <h2 className="text-lg font-semibold text-gray-900">Registro de pozos</h2>
              <p className="mt-1 text-sm text-gray-600">
                Creación de pozos, por defecto vendrá inactivo hasta que comience a recibir reportes.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input
                name="Nombre (Palabra que identifique al pozo con facilidad)" 
                label="name" 
                placeholder="" 
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
                name="Código de obra"
                label="code"
                placeholder="ABC1638234"
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
              <button 
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Registrar Pozo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );  
}

export default CreateWell
