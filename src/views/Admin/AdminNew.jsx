import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  Truck,
  UserPlus,
  Activity,
  Droplets
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatCard } from '../../components/StatCard'
import { QuickActionCard } from '../../components/QuickActionCard'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { getGlobalStats } from '../../services/statsServices'

function AdminNew() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const [cookies] = useCookies(['token'])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch global stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getGlobalStats(cookies.token)
        setStats(data)
      } catch (err) {
        console.error('Error loading stats:', err)
        setError('Error al cargar las estadísticas')
      } finally {
        setLoading(false)
      }
    }

    if (cookies.token) {
      fetchStats()
    }
  }, [cookies.token])

  const quickActions = [
    {
      title: 'Nuevo Cliente',
      icon: <UserPlus className="w-5 h-5" />,
      path: '/clients/new'
    },
    {
      title: 'Nueva Empresa',
      icon: <Building2 className="w-5 h-5" />,
      path: '/companies/new'
    },
    {
      title: 'Nueva Distribuidora',
      icon: <Truck className="w-5 h-5" />,
      path: '/distributors/new'
    },
  ]

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header - Minimalista y Premium */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Administración de tus Derechos del Agua
              </span>
            </h1>
            <p className="text-muted-foreground text-base mt-2">
              Bienvenido de vuelta, <span className="font-semibold text-foreground">{user?.name}</span>
            </p>
          </div>
          <Badge variant="default" className="h-8 px-3 text-xs font-semibold uppercase tracking-wider">
            {isAdmin ? 'Admin' : 'User'}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Stats Grid - Premium & Clickeable (fusiona Stats + Navigation) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clientes"
          value={stats.clients.total}
          icon={<Users className="w-5 h-5" />}
          trend={stats.clients.trend}
          onClick={() => navigate('/clients')}
          className="card-premium"
        />
        <StatCard
          title="Empresas"
          value={stats.companies.total}
          icon={<Building2 className="w-5 h-5" />}
          trend={stats.companies.trend}
          onClick={() => navigate('/companies')}
          className="card-premium"
        />
        <StatCard
          title="Distribuidoras"
          value={stats.distributors.total}
          icon={<Truck className="w-5 h-5" />}
          trend={stats.distributors.trend}
          onClick={() => navigate('/distributors')}
          className="card-premium"
        />
        <StatCard
          title="Pozos Activos"
          value={stats.wells.total}
          icon={<Droplets className="w-5 h-5" />}
          trend={stats.wells.trend}
          actionLabel="Ver pozos"
          onClick={() => navigate('/clients')}
          className="card-premium"
        />
      </div>

      {/* Quick Actions - Compacto y Minimalista */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
          <CardDescription>
            Operaciones frecuentes del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-4 px-4 flex items-center justify-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                onClick={() => navigate(action.path)}
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {action.icon}
                </div>
                <span className="font-medium text-sm">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed - Minimalista */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Nuevo cliente creado', entity: 'Juan Pérez', time: 'Hace 2h', type: 'success' },
              { action: 'Empresa actualizada', entity: 'Aguas del Valle', time: 'Hace 3h', type: 'default' },
              { action: 'Reporte enviado a DGA', entity: 'Pozo ABC123', time: 'Hace 5h', type: 'success' },
              { action: 'Error en envío', entity: 'Pozo XYZ456', time: 'Hace 1d', type: 'danger' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all group cursor-pointer"
              >
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'danger' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.entity}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-medium shrink-0">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminNew
