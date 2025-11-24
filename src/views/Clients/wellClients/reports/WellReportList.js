import { useEffect, useState, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { getWellReports, getClientWell } from '../../../../services/clientServices'
import { sendReports } from '../../../../services/wellDataServices'
import { useCookies } from 'react-cookie'
import useError from '../../../../hooks/useError'
import { DataTable } from '../../../../components/DataTable'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import {
  Calendar,
  Send,
  FileText,
  Droplet,
  Gauge,
  Waves,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Activity,
  XCircle,
} from 'lucide-react'

function WellReportList() {
  const { clientId, code } = useParams()
  const { isAdmin, isCompany } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [cookies] = useCookies(['token'])
  const [wellReports, setWellReports] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [well, setWell] = useState(location.state?.well || null)
  const [sendingReports, setSendingReports] = useState(false)

  const fetchWell = useCallback(async () => {
    if (!well) {
      setLoading(true)
      try {
        const wellData = await getClientWell(cookies.token, clientId, code)
        setWell(wellData)
      } catch (error) {
        console.error('Error fetching well', error)
        setError('Error cargando los datos del pozo.')
      } finally {
        setLoading(false)
      }
    }
  }, [well, cookies.token, clientId, code, setError])

  useEffect(() => {
    fetchWell()
  }, [fetchWell])

  const fetchWellReports = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const reports = await getWellReports(
        cookies.token,
        clientId,
        code,
        0,
        100,
        selectedMonth,
        selectedYear
      )
      setWellReports(reports.rows || [])
    } catch (error) {
      console.log('Error fetching well reports', error)
      setError('Error cargando los reportes del pozo.')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, clientId, code, selectedMonth, selectedYear, setError])

  useEffect(() => {
    fetchWellReports()
  }, [fetchWellReports])

  const isWellActive = well?.isActived

  const handleSendReports = async () => {
    try {
      setSendingReports(true)
      setError(null)

      if (!isWellActive) {
        throw new Error('El pozo está desactivado.')
      }

      if (wellReports && wellReports.length !== 0) {
        const pendingReports = wellReports.filter((report) => !report.sent)
        if (pendingReports.length === 0) {
          throw new Error('No hay reportes pendientes.')
        } else {
          await sendReports(pendingReports)
          // Refresh reports after sending
          fetchWellReports()
        }
      }
    } catch (error) {
      console.error('Error enviando reportes:', error)
      setError(error.message || 'Error enviando los reportes.')
    } finally {
      setSendingReports(false)
    }
  }

  const columns = [
    {
      accessorKey: 'code',
      header: 'Código',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">{row.code}</span>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: (row) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{row.date}</span>
        </div>
      ),
    },
    {
      accessorKey: 'hour',
      header: 'Hora',
      cell: (row) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{row.hour}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalizador',
      header: 'Totalizador (m³)',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-sm">{row.totalizador ?? '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'caudal',
      header: 'Caudal (L/s)',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan-600" />
          <span className="font-mono text-sm">{row.caudal ?? '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'nivel_freatico',
      header: 'Nivel Freático (m)',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-indigo-600" />
          <span className="font-mono text-sm">{row.nivel_freatico ?? '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'sent',
      header: 'Estado',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.sent ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Badge variant="success" className="text-xs">
                Enviado
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-orange-600" />
              <Badge variant="outline" className="text-xs border-orange-600 text-orange-600">
                Pendiente
              </Badge>
            </>
          )}
        </div>
      ),
      sortable: true,
    },
  ]

  const pendingReportsCount = wellReports.filter((report) => !report.sent).length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/clients/${clientId}/wells`)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reportes del Pozo</h1>
              <p className="text-muted-foreground">
                {well?.name || code} - {well?.location || 'Ubicación no especificada'}
              </p>
            </div>
          </div>
        </div>
        {well && (
          <Badge variant={well.isActived ? 'success' : 'secondary'} className="text-sm">
            {well.isActived ? 'Pozo Activo' : 'Pozo Inactivo'}
          </Badge>
        )}
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

      {/* Filters Card */}
      <Card className="card-premium border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Selecciona el mes y año para filtrar los reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Month Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Mes</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString('es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Año</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Send Reports Button */}
          {wellReports.length > 0 && pendingReportsCount > 0 && (isAdmin || isCompany) && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Enviar reportes pendientes a la DGA</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingReportsCount} reporte{pendingReportsCount !== 1 ? 's' : ''} pendiente
                    {pendingReportsCount !== 1 ? 's' : ''} de envío
                  </p>
                </div>
                <Button
                  onClick={handleSendReports}
                  disabled={!isWellActive || sendingReports}
                  className="gap-2"
                  title={
                    !isWellActive
                      ? 'El pozo debe estar activado para enviar reportes'
                      : 'Enviar todos los reportes pendientes a la DGA'
                  }
                >
                  {sendingReports ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar a DGA
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        data={wellReports}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por código, fecha o hora..."
        actions={{
          view: false,
          edit: false,
          delete: false,
        }}
        emptyState={{
          title: 'No hay reportes',
          description: `No se encontraron reportes para ${new Date(selectedYear, selectedMonth - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}.`,
        }}
      />

      {/* Info Card */}
      {wellReports.length > 0 && (
        <Card className="bg-muted/50 border-0">
          <CardContent className="flex items-start gap-3 pt-6">
            <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium">Resumen de reportes</p>
              <div className="grid gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span>Total de reportes:</span>
                  <span className="font-semibold">{wellReports.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reportes enviados:</span>
                  <span className="font-semibold text-green-600">
                    {wellReports.filter((r) => r.sent).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reportes pendientes:</span>
                  <span className="font-semibold text-orange-600">{pendingReportsCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WellReportList
