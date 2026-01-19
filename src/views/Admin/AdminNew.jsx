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
  Droplets,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatCard } from '../../components/StatCard'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { getGlobalStats } from '../../services/statsServices'
import { getActivityLogs } from '../../services/activityLogServices'
import { cn } from '../../lib/utils'

function AdminNew() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const [cookies] = useCookies(['token'])
  const [stats, setStats] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch global stats and activity logs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, logsResponse] = await Promise.all([
          getGlobalStats(cookies.token),
          getActivityLogs(cookies.token, 0, 10)
        ])
        setStats(statsData)
        setActivityLogs(logsResponse.data)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    if (cookies.token) {
      fetchData()
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

  // Entity configuration for activity logs
  const entityConfig = {
    client: {
      icon: Users,
      label: 'Cliente',
      badgeClass: 'border-green-500/50 text-green-700 dark:text-green-400 bg-green-500/10'
    },
    company: {
      icon: Building2,
      label: 'Empresa',
      badgeClass: 'border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-500/10'
    },
    distributor: {
      icon: Truck,
      label: 'Distribuidora',
      badgeClass: 'border-orange-500/50 text-orange-700 dark:text-orange-400 bg-orange-500/10'
    },
    well: {
      icon: Droplets,
      label: 'Pozo',
      badgeClass: 'border-cyan-500/50 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10'
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    return `Hace ${diffDays}d`
  }

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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Administración de tus Derechos del Agua
              </span>
            </h1>
            <p className="text-muted-foreground text-base mt-3">
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

      {/* Activity Feed - Premium Design */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en el sistema
              </CardDescription>
            </div>
            {activityLogs.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activityLogs.length} actividades
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activityLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityLogs.map((log) => {
                const config = entityConfig[log.entityType]
                const Icon = config.icon

                return (
                  <div
                    key={log.id}
                    className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all group"
                  >
                    {/* Avatar del Usuario */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {log.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Contenido Principal */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header: Usuario + Acción */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                          {log.user.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {log.action === 'created' && 'creó'}
                          {log.action === 'activated' && 'activó'}
                          {log.action === 'deactivated' && 'desactivó'}
                        </span>

                        {/* Badge de Tipo de Entidad */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            log.action === 'deactivated' ? 'border-red-500/50 text-red-700 dark:text-red-400 bg-red-500/10' : config.badgeClass
                          )}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>

                      {/* Nombre de la Entidad Creada */}
                      <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                        {log.entityName}
                      </p>

                      {/* Contexto Jerárquico */}
                      {log.context && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {log.context.client && (
                            <>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{log.context.client.name}</span>
                              </div>
                              {(log.context.company || log.context.distributor) && <ChevronRight className="w-3 h-3" />}
                            </>
                          )}

                          {log.context.company && (
                            <>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                <span>{log.context.company.name}</span>
                              </div>
                              {log.context.distributor && <ChevronRight className="w-3 h-3" />}
                            </>
                          )}

                          {log.context.distributor && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{log.context.distributor.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground font-medium">
                        {formatTimeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminNew
