import React from 'react'
import { useForm } from 'react-hook-form'
import { useCookies } from 'react-cookie'
import { useParams, useNavigate } from 'react-router-dom'
import { postNewWell } from '../services/clientServices'
import { clientFront, wellBack } from '../utils/routes.utils'
import useError from '../hooks/useError'
import NewWellText from '../texts/Wells/NewWellText.json'
import EditWellText from '../texts/Wells/EditWellText.json'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Droplet,
  MapPin,
  FileText,
  Building2,
  User,
  Lock,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react'

const { urlClients } = clientFront
const { getWells } = wellBack

function WellForm({ well }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const { id: clientId } = useParams()
  const [cookies] = useCookies(['token'])
  const navigate = useNavigate()
  const { error, setError } = useError()

  const text = well ? EditWellText : NewWellText
  const errorText = well ? 'Error al editar el pozo: ' : 'Error al crear el pozo: '

  const onSubmit = async (data) => {
    setError(null)
    if (cookies.token) {
      try {
        // Si rutEmpresa está vacío o es undefined, usar el RUT_BASE del .env
        if (!data.rutEmpresa || data.rutEmpresa.trim() === '') {
          data.rutEmpresa = process.env.REACT_APP_RUT_BASE
        }
        const code = well ? well.code : null
        await postNewWell(cookies.token, data, clientId, code)
        const url = `/${urlClients}/${clientId}/${getWells}`
        navigate(url)
      } catch (error) {
        const message = error.response.data.errors
          ? error.response.data.errors.join(', ')
          : error.message
        setError(errorText + message)
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{text.titles.principalTitle}</h1>
          <p className="text-muted-foreground">{text.descriptions.principalDescription}</p>
        </div>
        <Badge variant="default" className="text-sm">
          {well ? 'Editar' : 'Nuevo'}
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
        {/* Well Information Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Información del Pozo
            </CardTitle>
            <CardDescription>Datos básicos de identificación y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nombre
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Droplet className="h-4 w-4" />
                </div>
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: 70,
                  })}
                  defaultValue={well ? well.name : ''}
                  placeholder="Pozo 1"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Palabra que identifique al pozo con facilidad</p>
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Código de Obra
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <FileText className="h-4 w-4" />
                </div>
                <input
                  {...register('code', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: 100,
                  })}
                  defaultValue={well ? well.code : ''}
                  placeholder="ABC1638234"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.code && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ubicación
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
                  defaultValue={well ? well.location : ''}
                  placeholder="Santiago, Arturo Prat 4715"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Ciudad, Comuna y dirección completa</p>
              {errors.location && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.location.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* DGA Credentials Card */}
        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Credenciales DGA
            </CardTitle>
            <CardDescription>
              Información requerida para la integración con el sistema DGA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* RUT Empresa */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                RUT de Centro de Control
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  {...register('rutEmpresa', {
                    pattern: {
                      value: /^[1-9]\d*-(\d|k|K)$/,
                      message: 'El RUT debe ir en el formato 12345678-9',
                    },
                  })}
                  defaultValue={well ? well.rutEmpresa : ''}
                  placeholder={process.env.REACT_APP_RUT_BASE || '12345678-9'}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Si se deja vacío, se usará el RUT base configurado en el sistema
              </p>
              {errors.rutEmpresa && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.rutEmpresa.message}
                </p>
              )}
            </div>

            {/* RUT Usuario */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                RUT del Usuario Informante
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <input
                  {...register('rutUsuario', {
                    pattern: {
                      value: /^[1-9]\d*-(\d|k|K)$/,
                      message: 'El RUT debe ir en el formato 12345678-9',
                    },
                  })}
                  defaultValue={well ? well.rutUsuario : ''}
                  placeholder="12345678-9"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.rutUsuario && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.rutUsuario.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Contraseña del Usuario Informante
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="*********"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="flex items-start gap-3 pt-6">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium">Información sobre activación</p>
              <p className="text-blue-700 dark:text-blue-200">
                Para que un pozo pueda ser activado y enviar reportes al DGA, debe tener configurados
                los tres campos de credenciales: RUT de centro de control, RUT del informante y contraseña.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/${urlClients}/${clientId}/${getWells}`)}
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
                {text.buttons.submitButton}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default WellForm
