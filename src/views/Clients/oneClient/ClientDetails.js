import { useState, useEffect, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { useParams, useNavigate } from 'react-router-dom'
import { getClientDetailsById } from '../../../services/clientServices'
import { useAuth } from '../../../context/AuthContext'
import useError from '../../../hooks/useError'
import Alerts from '../../../components/Alerts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Skeleton } from '../../../components/ui/skeleton'
import { Separator } from '../../../components/ui/separator'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Inbox,
  Plus,
  Eye,
  Building2,
  Activity
} from 'lucide-react'

function ClientDetails() {
  const { id: clientId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDistributor } = useAuth()
  const [cookies] = useCookies(['token'])
  const navigate = useNavigate()
  const { error, setError } = useError()

  const fetchClientDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const clientDetails = await getClientDetailsById(cookies.token, clientId)
      if (!clientDetails) throw new Error('No se encontraron datos del cliente')
      setUser(clientDetails)
    } catch (err) {
      console.log(err.message)
      setError('Error al cargar los detalles del cliente')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, clientId, setError])

  useEffect(() => {
    fetchClientDetails()
  }, [fetchClientDetails])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-48" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles del Cliente</h1>
            <p className="text-muted-foreground">Información completa del cliente</p>
          </div>
        </div>
        <Alerts type="error" message={error} />
      </div>
    )
  }

  if (!user) return null

  const infoItems = [
    {
      icon: User,
      label: 'Nombre Completo',
      value: user.person?.fullName || 'No especificado',
    },
    {
      icon: User,
      label: 'Alias',
      value: user.name || 'No especificado',
    },
    {
      icon: Mail,
      label: 'Email Corporativo',
      value: user.email || 'No especificado',
    },
    {
      icon: Inbox,
      label: 'Email Personal',
      value: user.person?.personalEmail || 'No especificado',
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: user.person?.location || 'No especificado',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: user.person?.phoneNumber || 'No especificado',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.person?.fullName || 'Cliente'}</h1>
              <p className="text-muted-foreground">
                {user.name ? `También conocido como ${user.name}` : 'Detalles del cliente'}
              </p>
            </div>
          </div>
        </div>
        <Badge variant={user.isActived ? 'success' : 'secondary'} className="text-sm">
          {user.isActived ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <Separator />

      {/* Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos de contacto y ubicación del cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {infoItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="mt-0.5 rounded-lg bg-muted p-2 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold truncate mt-0.5">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Gestiona los pozos y datos del cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/clients/${clientId}/wells`)}
                className="w-full justify-start gap-2"
                variant="default"
                size="lg"
              >
                <Eye className="h-4 w-4" />
                Ver Pozos del Cliente
              </Button>

              {!isDistributor && (
                <Button
                  onClick={() => navigate(`/clients/${clientId}/wells/new`)}
                  className="w-full justify-start gap-2"
                  variant="outline"
                  size="lg"
                >
                  <Plus className="h-4 w-4" />
                  Crear Nuevo Pozo
                </Button>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Más opciones</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/clients/${clientId}/edit`)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => navigate(`/clients/${clientId}/delete`, { state: { client: user } })}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
          <CardDescription>Detalles y estadísticas del cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Pozos Activos</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Reportes Enviados</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Último Reporte</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientDetails
