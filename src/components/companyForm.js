import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import Input from './input';
import Select from './select';
import useError from '../hooks/useError';
import Alerts from './Alerts';
import { postNewCompany } from '../services/companyServices';
import { getAllUsersRoles } from '../services/userServices';
import NewCompanyText from '../texts/Companies/oneCompany/NewCompanyText.json'
import EditCompanyText from '../texts/Companies/oneCompany/EditCompanyText.json'

function CompanyForm({ companyInfo = { id: '', name: '', email: '', roleType: 'company', isActived: true, companyLogo: '', companyRut: '', phoneNumber: '', recoveryEmail: '', location: '' } }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: companyInfo
  });
  const [cookies] = useCookies(['token']);
  const { error, setError } = useError();
  const navigate = useNavigate();

  const [roleCompany, setRoleCompany] = useState([]);

  // Obtener el id del rol de company
  useEffect(() => {
    const fetchRoleCompany = async () => {
      try {
        const rolesData = await getAllUsersRoles(cookies.token);
        // mantenemos solo el tipo company porque ese debe llevarse en un formulario propio
        const filteredRole = rolesData.filter(role => role.type === 'company');
        setRoleCompany(filteredRole);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('No se pudieron cargar los roles.');
      }
    };

    fetchRoleCompany();
  }, [cookies.token, setError]);

  useEffect(() => {
    const role = roleCompany.length > 0 ? roleCompany[0] : null;
    if (role) {
      setValue('roleId', role.id);
    }
    setValue("isActived", companyInfo.isActived);
  }, [setValue, companyInfo.isActived, roleCompany]);

  const onSubmit = async (data) => {
    if (cookies.token) {
      try {
        if (!data.encrypted_password) delete data.encrypted_password;
        await postNewCompany(cookies.token, data, companyInfo.id);
        navigate(`/admin`);
      } catch (error) {
        console.log(error);
        const message = error.response.data.errors ? error.response.data.errors.join(', ') : error.message;
        setError(message);
      }
    } else {
      setError('Token expirado, por favor inicie sesión nuevamente.');
    }
  };

  const texts = companyInfo.id === '' ? NewCompanyText : EditCompanyText;

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
                name="Nombre Empresa" 
                label="name" 
                placeholder="NTH Consultores"
                defaultValue = {companyInfo.name}
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
                name="RUT de la Empresa"
                label="companyRut"
                placeholder="12345678-9"
                defaultValue={companyInfo.companyRut}
                register={register}
                validation={{ 
                  required: {
                    value: true, 
                    message: 'Este campo es obligatorio'
                  },  
                  pattern: {
                    value: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$|^[0-9]{7,8}-[0-9kK]{1}$/,
                    message: 'El RUT no es válido, use el formato 12.345.678-9 o 12345678-9'
                  } 
                }}
                errors={errors}
              />
              <Input 
                name="URL Logo"
                label="companyLogo"
                defaultValue = {companyInfo.companyLogo}
                placeholder="https://www.nthconsultores.cl/logo.png"
                register={register}
                validation={{ required: false }}
                errors={errors}
              />
              <Input 
                name="Ubicación (Ciudad, Comuna 1234)"
                label="location"
                placeholder="Temuco, Manuel Montt XXXX"
                defaultValue = {companyInfo.location}
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
                placeholder="56978872828"
                defaultValue = {companyInfo.phoneNumber}
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
                defaultValue = {companyInfo.isActived}
                register={register}
                options={[
                  { value: true, label: 'Activo' },
                  { value: false, label: 'Inactivo (no podrá ingresar a la aplicación)' }
                ]}
              />
             <Select 
                name="Rol"
                label="roleId"
                defaultValue={roleCompany.length > 0 ? roleCompany[0].id : ''}
                register={register}
                options={[
                  { value: roleCompany.length > 0 ? roleCompany[0].id : '', label: 'company' }
                ]}
                disabled={true}
              />
              <Input 
                name="Correo Corporativo"
                label="email"
                defaultValue = {companyInfo.email}
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
                name="Correo de Recuperación"
                defaultValue = {companyInfo.recoveryEmail}
                label="recoveryEmail"
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
                placeholder={companyInfo.name ? texts.placeholders.password : ''}
                register={register}
                type="password"
                validation={companyInfo.name ? {
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
  );
}

export default CompanyForm;
