import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

const STATUS_META = {
  green: {
    label: 'Verde',
    description: 'Comunicación dentro de lo esperado',
    badgeClass: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/40',
    dotClass: 'bg-green-500',
    icon: CheckCircle2,
  },
  yellow: {
    label: 'Amarillo',
    description: 'Advertencia, requiere revisión preventiva',
    badgeClass: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/40',
    dotClass: 'bg-yellow-500',
    icon: Clock,
  },
  red: {
    label: 'Rojo',
    description: 'Incidencia crítica, debe notificarse',
    badgeClass: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/40',
    dotClass: 'bg-red-500',
    icon: XCircle,
  },
}

const formatLastCommunication = (isoString) => {
  if (!isoString) return 'Sin datos registrados'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return 'Sin datos registrados'
  return date.toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const formatMinutes = (minutes) => {
  if (minutes === null || minutes === undefined) return 'Sin datos'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rem = minutes % 60
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`
}

export function WellsStatusPanel({ data, loading }) {
  if (loading) {
    return (
      <Card className="border-0 card-premium">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monitoreo de Pozos</CardTitle>
          <CardDescription>Cargando estado de comunicación...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!data) return null

  const { summary, wells, alert } = data
  const hasAlert = alert?.hasCriticalWells

  return (
    <div className="space-y-4">
      {hasAlert && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Alerta: {alert.criticalCount} pozo(s) sin comunicación hace más de 6 horas
            </p>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">
              Revisa el listado y verifica el estado de los equipos en terreno. Se notificará
              automáticamente a Promedición por correo cada 6 horas mientras exista al menos un pozo crítico.
            </p>
          </div>
        </div>
      )}

      <Card className="border-0 card-premium">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg font-semibold">Monitoreo de Pozos</CardTitle>
              <CardDescription>
                Última comunicación y semáforo operativo ({summary.total} pozo(s) activo(s))
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={STATUS_META.green.badgeClass}>
                <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${STATUS_META.green.dotClass}`} />
                {summary.green} verdes
              </Badge>
              <Badge className={STATUS_META.yellow.badgeClass}>
                <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${STATUS_META.yellow.dotClass}`} />
                {summary.yellow} amarillos
              </Badge>
              <Badge className={STATUS_META.red.badgeClass}>
                <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${STATUS_META.red.dotClass}`} />
                {summary.red} rojos
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {wells.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No hay pozos activos para monitorear.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                    <th className="py-2 px-3 font-semibold">Pozo</th>
                    <th className="py-2 px-3 font-semibold">Código</th>
                    <th className="py-2 px-3 font-semibold">Última comunicación</th>
                    <th className="py-2 px-3 font-semibold">Hace</th>
                    <th className="py-2 px-3 font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {wells.map((well) => {
                    const meta = STATUS_META[well.status] || STATUS_META.red
                    const Icon = meta.icon
                    return (
                      <tr key={well.wellId} className="border-b hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground">{well.name}</p>
                          {well.location && (
                            <p className="text-xs text-muted-foreground">{well.location}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-muted-foreground">
                          {well.code}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {formatLastCommunication(well.lastCommunication)}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {formatMinutes(well.minutesSinceLast)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Badge className={meta.badgeClass}>
                            <Icon className="h-3 w-3 mr-1" />
                            {meta.label}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
