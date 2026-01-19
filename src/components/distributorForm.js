import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import useError from '../hooks/useError'
import { getAllUsersRoles } from '../services/userServices'
import { postNewDistributor } from '../services/distributorService'
import NewDistributorText from '../texts/Distributors/oneDistributor/NewDistributorText.json'
import EditDistributorText from '../texts/Distributors/oneDistributor/EditDistributorText.json'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image as ImageIcon,
  Lock,
  CheckCircle2,
  Inbox,
  AlertCircle,
} from 'lucide-react'

function DistributorForm({
  distributorInfo = {
    id: '',
    name: '',
    email: '',
    roleType: 'distributor',
    isActived: true,
    distributorLogo: '',
    distributorRut: '',
    phoneNumber: '',
    recoveryEmail: '',
    location: '',
  },
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: distributorInfo,
  })
  const [cookies] = useCookies(['token'])
  const { error, setError } = useError()
  const navigate = useNavigate()

  const [roleDistributor, setRoleDistributor] = useState([])

  // Obtener el id del rol de company
  useEffect(() => {
    const fetchRoleDistributor = async () => {
      try {
        const rolesData = await getAllUsersRoles(cookies.token)
        // mantenemos solo el tipo company porque ese debe llevarse en un formulario propio
        const filteredRole = rolesData.filter((role) => role.type === 'distributor')
        setRoleDistributor(filteredRole)
      } catch (error) {
        console.error('Error fetching roles:', error)
        setError('No se pudieron cargar los roles.')
      }
    }

    fetchRoleDistributor()
  }, [cookies.token, setError])

  useEffect(() => {
    const role = roleDistributor.length > 0 ? roleDistributor[0] : null
    if (role) {
      setValue('roleId', role.id)
    }
    setValue('isActived', distributorInfo.isActived)
  }, [setValue, distributorInfo.isActived, roleDistributor])

  const onSubmit = async (data) => {
    if (cookies.token) {
      try {
        if (!data.encrypted_password) delete data.encrypted_password
        // añadimos el roleType al objeto data
        const role = roleDistributor.length > 0 ? roleDistributor[0] : null
        data.roleType = role?.type
        await postNewDistributor(cookies.token, data, distributorInfo.id)
        navigate(`/admin`)
      } catch (error) {
        console.log(error)
        const message = error.response.data.errors ? error.response.data.errors.join(', ') : error.message
        setError(message)
      }
    } else {
      setError('Token expirado, por favor inicie sesión nuevamente.')
    }
  }

  const texts = distributorInfo.id === '' ? NewDistributorText : EditDistributorText

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{texts.titles.principalTitle}</h1>
          <p className="text-muted-foreground">{texts.descriptions.principalDescription}</p>
        </div>
        <Badge variant="default" className="text-sm">
          {distributorInfo.id ? 'Editar' : 'Nueva'}
        </Badge>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Distributor Information Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Información de la Distribuidora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distributor Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nombre Distribuidora
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Truck className="h-4 w-4" />
                </div>
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: 70,
                  })}
                  defaultValue={distributorInfo.name}
                  placeholder="Distribuidora NTH"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* RUT */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                RUT de la Distribuidora
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <FileText className="h-4 w-4" />
                </div>
                <input
                  {...register('distributorRut', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    pattern: {
                      value: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$|^[0-9]{7,8}-[0-9kK]{1}$/,
                      message: 'El RUT no es válido, use el formato 12.345.678-9 o 12345678-9',
                    },
                  })}
                  defaultValue={distributorInfo.distributorRut}
                  placeholder="12345678-9"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.distributorRut && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.distributorRut.message}
                </p>
              )}
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                URL Logo
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <input
                  {...register('distributorLogo', { required: false })}
                  defaultValue={distributorInfo.distributorLogo}
                  placeholder="https://www.nthconsultores.cl/logo.png"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.distributorLogo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.distributorLogo.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Contact Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicación y Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ubicación (Ciudad, Comuna 1234)
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  {...register('location', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: 100,
                  })}
                  defaultValue={distributorInfo.location}
                  placeholder="Temuco, Manuel Montt XXXX"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.location && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Número de Teléfono
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  {...register('phoneNumber', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: 'El número de teléfono no es válido',
                    },
                  })}
                  defaultValue={distributorInfo.phoneNumber}
                  placeholder="56978872828"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Configuración de Correos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Corporate Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Correo Corporativo
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'El correo no es válido',
                    },
                  })}
                  defaultValue={distributorInfo.email}
                  type="email"
                  placeholder="contacto@distribuidora.cl"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Recovery Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Correo de Recuperación
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Inbox className="h-4 w-4" />
                </div>
                <input
                  {...register('recoveryEmail', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'El correo no es válido',
                    },
                  })}
                  defaultValue={distributorInfo.recoveryEmail}
                  type="email"
                  placeholder="recuperacion@distribuidora.cl"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.recoveryEmail && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.recoveryEmail.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Access & Permissions Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Acceso y Permisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Estado
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <select
                    {...register('isActived')}
                    defaultValue={distributorInfo.isActived}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo (no podrá ingresar a la aplicación)</option>
                  </select>
                </div>
              </div>

              {/* Role (Disabled) */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Rol
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Truck className="h-4 w-4" />
                  </div>
                  <select
                    {...register('roleId')}
                    defaultValue={roleDistributor.length > 0 ? roleDistributor[0].id : ''}
                    disabled={true}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={roleDistributor.length > 0 ? roleDistributor[0].id : ''}>distributor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Contraseña
                {!distributorInfo.name && <span className="text-destructive ml-1">*</span>}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register(
                    'encrypted_password',
                    distributorInfo.name
                      ? {
                          minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                          },
                        }
                      : {
                          required: {
                            value: true,
                            message: 'Este campo es obligatorio',
                          },
                          minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                          },
                        }
                  )}
                  type="password"
                  placeholder={distributorInfo.name ? texts.placeholders.password : '********'}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.encrypted_password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.encrypted_password.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {texts.buttons.submitButton}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DistributorForm
