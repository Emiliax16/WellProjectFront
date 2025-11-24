import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import {
  Users,
  Building2,
  Truck,
  Droplets,
  Activity,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Separator } from '../../components/ui/separator'
import { getActivityLogs } from '../../services/activityLogServices'
import { cn } from '../../lib/utils'

function ActivityLog() {
  const [cookies] = useCookies(['token'])
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 25,
    total: 0
  })

  // Fetch activity logs
  const fetchLogs = async (page = 0) => {
    try {
      setLoading(true)
      const response = await getActivityLogs(cookies.token, page, pagination.size)
      setActivityLogs(response.data)
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total
      })
    } catch (err) {
      console.error('Error loading activity logs:', err)
      setError('Error al cargar los registros de actividad')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cookies.token) {
      fetchLogs(0)
    }
  }, [cookies.token])

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

  // Format full date and time
  const formatFullDateTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  // Pagination handlers
  const totalPages = Math.ceil(pagination.total / pagination.size)
  const currentPage = pagination.page

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchLogs(page)
    }
  }

  const goToFirstPage = () => goToPage(0)
  const goToLastPage = () => goToPage(totalPages - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPreviousPage = () => goToPage(currentPage - 1)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  // Loading state
  if (loading && activityLogs.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Separator />
        <div className="space-y-4">
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
          <h1 className="text-4xl font-bold tracking-tight">Actividad del Sistema</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Actividad del Sistema</h1>
            <p className="text-muted-foreground text-base mt-2">
              Historial completo de acciones realizadas en el sistema
            </p>
          </div>
          <Badge variant="secondary" className="h-8 px-3 text-xs font-semibold">
            {pagination.total} registros
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Activity Feed */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Registro de Actividad</CardTitle>
              <CardDescription>
                Todas las acciones registradas en orden cronológico
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activityLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-base font-medium">No hay actividad registrada</p>
              <p className="text-sm mt-1">Los registros de actividad aparecerán aquí</p>
            </div>
          ) : (
            <>
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
                      <div className="flex-shrink-0 text-right space-y-1">
                        <p className="text-xs font-medium text-foreground">
                          {formatFullDateTime(log.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {currentPage * pagination.size + 1} - {Math.min((currentPage + 1) * pagination.size, pagination.total)} de {pagination.total} registros
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstPage}
                      disabled={currentPage === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage >= totalPages - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastPage}
                      disabled={currentPage >= totalPages - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityLog
