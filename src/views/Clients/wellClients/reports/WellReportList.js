import { useEffect, useState, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { getWellReports, getClientWell } from '../../../../services/clientServices'
import { sendReports, bulkDeleteReports } from '../../../../services/wellDataServices'
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
  Download,
  Trash2,
} from 'lucide-react'
import * as XLSX from 'xlsx'

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
  const [selectedReports, setSelectedReports] = useState([])
  const [deletingReports, setDeletingReports] = useState(false)

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

      // Si hay reportes seleccionados, enviar solo esos
      // Si no hay selección, enviar todos los pendientes
      let reportsToSend = []
      if (selectedReports.length > 0) {
        reportsToSend = wellReports.filter((report) => 
          selectedReports.includes(report.id) && !report.sent
        )
        if (reportsToSend.length === 0) {
          throw new Error('Los reportes seleccionados ya fueron enviados.')
        }
      } else {
        reportsToSend = wellReports.filter((report) => !report.sent)
        if (reportsToSend.length === 0) {
          throw new Error('No hay reportes pendientes.')
        }
      }

      await sendReports(reportsToSend)
      setSelectedReports([])
      fetchWellReports()
    } catch (error) {
      console.error('Error enviando reportes:', error)
      setError(error.message || 'Error enviando los reportes.')
    } finally {
      setSendingReports(false)
    }
  }

  const handleSelectReport = (reportId) => {
    setSelectedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId)
      } else {
        return [...prev, reportId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedReports.length === wellReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(wellReports.map((report) => report.id))
    }
  }

  const handleDownloadExcel = () => {
    const reportsToDownload = selectedReports.length > 0
      ? wellReports.filter((report) => selectedReports.includes(report.id))
      : wellReports

    if (reportsToDownload.length === 0) {
      setError('No hay reportes para descargar')
      return
    }

    // Preparar datos para Excel
    const excelData = reportsToDownload.map((report) => ({
      'Código': report.code,
      'Fecha': report.date,
      'Hora': report.hour,
      'Totalizador (m³)': report.totalizador,
      'Caudal (L/s)': report.caudal,
      'Nivel Freático (m)': report.nivel_freatico,
      'Estado': report.sent ? 'Enviado' : 'Pendiente',
    }))

    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes')

    // Descargar archivo
    const fileName = `reportes_${code}_${selectedMonth}_${selectedYear}.xlsx`
    XLSX.writeFile(workbook, fileName)

    setSelectedReports([])
  }

  const handleDeleteReports = async () => {
    if (selectedReports.length === 0) {
      setError('Debe seleccionar al menos un reporte para eliminar')
      return
    }

    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar ${selectedReports.length} reporte(s)? Esta acción no se puede deshacer.`
    )

    if (!confirmDelete) return

    try {
      setDeletingReports(true)
      setError(null)

      await bulkDeleteReports(selectedReports)
      
      setSelectedReports([])
      fetchWellReports()
    } catch (error) {
      console.error('Error eliminando reportes:', error)
      setError(error.response?.data?.message || 'Error eliminando los reportes.')
    } finally {
      setDeletingReports(false)
    }
  }

  const columns = [
    {
      accessorKey: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectedReports.length === wellReports.length && wellReports.length > 0}
          onChange={handleSelectAll}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedReports.includes(row.id)}
          onChange={() => handleSelectReport(row.id)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      ),
      sortable: false,
    },
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
                {well?.name || 'Sin nombre'} con código {code} - {well?.location || 'Ubicación no especificada'}
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

          {/* Action Buttons */}
          {wellReports.length > 0 && (
            <div className="mt-6 pt-6 border-t space-y-4">
              {/* Selection and Download Controls */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Acciones con reportes</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedReports.length > 0 
                      ? `${selectedReports.length} reporte${selectedReports.length !== 1 ? 's' : ''} seleccionado${selectedReports.length !== 1 ? 's' : ''}`
                      : 'Ningún reporte seleccionado'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="gap-2"
                  >
                    {selectedReports.length === wellReports.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadExcel}
                    className="gap-2"
                    disabled={wellReports.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Descargar Excel
                  </Button>
                  {(isAdmin || isCompany) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteReports}
                      className="gap-2"
                      disabled={selectedReports.length === 0 || deletingReports}
                    >
                      {deletingReports ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Send to DGA Button */}
              {pendingReportsCount > 0 && (isAdmin || isCompany) && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Enviar reportes a la DGA</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedReports.length > 0
                        ? `Se enviarán ${wellReports.filter(r => selectedReports.includes(r.id) && !r.sent).length} reporte(s) seleccionado(s)`
                        : `${pendingReportsCount} reporte${pendingReportsCount !== 1 ? 's' : ''} pendiente${pendingReportsCount !== 1 ? 's' : ''} de envío`}
                    </p>
                  </div>
                  <Button
                    onClick={handleSendReports}
                    disabled={!isWellActive || sendingReports}
                    className="gap-2"
                    title={
                      !isWellActive
                        ? 'El pozo debe estar activado para enviar reportes'
                        : selectedReports.length > 0
                        ? 'Enviar reportes seleccionados a la DGA'
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
                        {selectedReports.length > 0 ? 'Enviar Seleccionados' : 'Enviar Todos'}
                      </>
                    )}
                  </Button>
                </div>
              )}
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
