import React from 'react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { postNewClient } from '../services/clientServices'
import { getAllUsersRoles } from '../services/userServices'
import { useNavigate } from 'react-router-dom'
import { clientFront, companyFront } from '../utils/routes.utils'
import useError from '../hooks/useError'
import NewClientText from '../texts/Clients/oneClients/NewClientText.json'
import EditClientText from '../texts/Clients/oneClients/EditClientText.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Users,
  Inbox,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

function UserForm({
  userInfo = {
    id: '',
    name: '',
    alias: '',
    location: '',
    phoneNumber: '',
    isActived: true,
    roleId: 2,
    roleType: 'normal',
    email: '',
    personalEmail: '',
  },
  createdFromCompany = false,
  companyId = null,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const [cookies] = useCookies(['token'])
  const { error, setError } = useError()
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener roles desde el backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllUsersRoles(cookies.token)
        let filteredRoles = rolesData.filter((role) => role.type !== 'company')

        if (createdFromCompany) {
          filteredRoles = filteredRoles.filter((role) => role.type === 'normal')
        }
        setRoles(filteredRoles)
      } catch (error) {
        console.error('Error fetching roles:', error)
        setError('No se pudieron cargar los roles.')
      }
    }

    fetchRoles()
  }, [cookies.token, setError, createdFromCompany])

  useEffect(() => {
    const role = roles.find((r) => r.type === userInfo.roleType)
    if (role) {
      setValue('roleId', role.id)
    }
    setValue('isActived', userInfo.isActived)
  }, [setValue, userInfo.roleType, userInfo.isActived, roles])

  const onSubmit = async (data) => {
    if (cookies.token) {
      setIsSubmitting(true)
      try {
        if (!data.encrypted_password) delete data.encrypted_password
        const role = roles.find((r) => r.id === data.roleId)
        data.roleType = role?.type
        data.companyId = companyId
        await postNewClient(cookies.token, data, userInfo.id)

        if (createdFromCompany) {
          navigate(`/${companyFront.urlCompanies}/${companyId}/${clientFront.urlClients}`)
        } else {
          navigate(`/${clientFront.urlClients}`)
        }
      } catch (error) {
        console.log(error)
        const message = error.response?.data?.error
          ? error.response.data.error
          : error.response?.data?.errors
          ? error.response.data.errors.join(', ')
          : error.message
        setError(message)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setError('Token expirado, por favor inicie sesión nuevamente.')
    }
  }

  const texts = userInfo.id === '' ? NewClientText : EditClientText

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{texts.titles.principalTitle}</h1>
          <p className="text-muted-foreground">{texts.descriptions.principalDescription}</p>
        </div>
        <Badge variant="default" className="text-sm">
          {userInfo.id ? 'Editar' : 'Nuevo'}
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos básicos del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nombre Completo
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  {...register('fullName', {
                    required: { value: true, message: 'Este campo es obligatorio' },
                    maxLength: 70,
                  })}
                  defaultValue={userInfo.name}
                  placeholder="Juan Pablo Cisternas"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Alias */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Alias</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  {...register('name', { required: false })}
                  defaultValue={userInfo.alias}
                  placeholder="Juanpi"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Ubicación
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    {...register('location', {
                      required: { value: true, message: 'Este campo es obligatorio' },
                      maxLength: 100,
                    })}
                    defaultValue={userInfo.location}
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

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Teléfono
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    {...register('phoneNumber', {
                      required: { value: true, message: 'Este campo es obligatorio' },
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: 'El número de teléfono no es válido',
                      },
                    })}
                    defaultValue={userInfo.phoneNumber}
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
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Información de Contacto
            </CardTitle>
            <CardDescription>Correos electrónicos y acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Corporate Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Correo Corporativo
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email', {
                    required: { value: true, message: 'Este campo es obligatorio' },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'El correo no es válido',
                    },
                  })}
                  defaultValue={userInfo.email}
                  placeholder="nombre@empresa.com"
                  type="email"
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

            {/* Personal Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Correo Personal
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Inbox className="h-4 w-4" />
                </div>
                <input
                  {...register('personalEmail', {
                    required: { value: true, message: 'Este campo es obligatorio' },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'El correo no es válido',
                    },
                  })}
                  defaultValue={userInfo.personalEmail}
                  placeholder="nombre@gmail.com"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.personalEmail && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.personalEmail.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Contraseña
                {!userInfo.name && <span className="text-destructive ml-1">*</span>}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register(
                    'encrypted_password',
                    userInfo.name
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
                  placeholder={userInfo.name ? texts.placeholders.password : 'Mínimo 8 caracteres'}
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.encrypted_password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.encrypted_password.message}
                </p>
              )}
              {!userInfo.name && (
                <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 8 caracteres</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Access & Permissions Section */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Acceso y Permisos
            </CardTitle>
            <CardDescription>Configuración de roles y estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Estado</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <select
                    {...register('isActived')}
                    defaultValue={userInfo.isActived}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo (no podrá ingresar a la aplicación)</option>
                  </select>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Rol</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                  </div>
                  <select
                    {...register('roleId')}
                    defaultValue={userInfo.roleId}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
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

export default UserForm
