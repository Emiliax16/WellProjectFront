import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { getClientWells } from '../../../services/clientServices'
import { activateWell } from '../../../services/wellServices'
import { useAuth } from '../../../context/AuthContext'
import useError from '../../../hooks/useError'
import { DataTable } from '../../../components/DataTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import {
  Plus,
  MapPin,
  FileText,
  Power,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import WellsText from '../../../texts/WellsText.json'

function ClientWells() {
  const { id: clientId } = useParams()
  const navigate = useNavigate()
  const [cookies] = useCookies(['token'])
  const [wells, setWells] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()
  const { isDistributor } = useAuth()

  const fetchClientWells = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getClientWells(cookies.token, clientId, 0, 100)
      setWells(response.rows || [])
    } catch (err) {
      console.log(err)
      setError(WellsText.data.error)
    } finally {
      setLoading(false)
    }
  }, [cookies.token, clientId, setError])

  useEffect(() => {
    fetchClientWells()
  }, [fetchClientWells])

  const handleActivation = async (wellId) => {
    try {
      await activateWell(cookies.token, wellId)
      // Refresh the list after activation
      fetchClientWells()
    } catch (error) {
      console.log(error)
      setError('Error al cambiar el estado del pozo')
    }
  }

  const isActivationAllowed = (well) => {
    return Boolean(well?.rutEmpresa && well?.rutUsuario && well?.password)
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
      accessorKey: 'name',
      header: 'Nombre',
      cell: (row) => <div className="font-medium">{row.name || 'Sin nombre'}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Ubicación',
      cell: (row) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-sm">{row.location || 'No especificada'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'rutEmpresa',
      header: 'RUT Empresa',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.rutEmpresa || '-'}</span>
      ),
    },
    {
      accessorKey: 'isActived',
      header: 'Estado',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.isActived ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Badge variant="success" className="text-xs">
                Activo
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-gray-400" />
              <Badge variant="secondary" className="text-xs">
                Inactivo
              </Badge>
            </>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: 'actions',
      header: 'Acciones Rápidas',
      sortable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/clients/${row.clientId}/wells/${row.code}`)}
            className="h-8 gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            Ver Reportes
          </Button>
          {!isDistributor && (
            <Button
              variant={row.isActived ? 'outline' : 'default'}
              size="sm"
              onClick={() => handleActivation(row.id)}
              disabled={!isActivationAllowed(row)}
              className="h-8 gap-1.5"
              title={
                !isActivationAllowed(row)
                  ? 'Faltan campos requeridos: RUT empresa, RUT informante o contraseña'
                  : ''
              }
            >
              <Power className="h-3.5 w-3.5" />
              {row.isActived ? 'Desactivar' : 'Activar'}
            </Button>
          )}
        </div>
      ),
    },
  ]

  const getRowActions = (well) => {
    if (isDistributor) {
      return {
        view: `/clients/${well.clientId}/wells/${well.code}`,
        edit: null,
        delete: null,
      }
    }
    return {
      view: `/clients/${well.clientId}/wells/${well.code}`,
      edit: `/clients/${well.clientId}/wells/${well.code}/edit`,
      delete: `/clients/${well.clientId}/wells/${well.code}/delete`,
    }
  }

  if (error && !loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{WellsText.titles.principalTitle}</h1>
            <p className="text-muted-foreground">Lista de pozos del cliente</p>
          </div>
          {!isDistributor && (
            <Button onClick={() => navigate(`/clients/${clientId}/wells/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Pozo
            </Button>
          )}
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{WellsText.titles.principalTitle}</h1>
          <p className="text-muted-foreground">Gestiona los pozos y sus reportes</p>
        </div>
        {!isDistributor && (
          <Button onClick={() => navigate(`/clients/${clientId}/wells/new`)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Pozo
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={wells}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por código, nombre o ubicación..."
        getRowActions={getRowActions}
        actions={{
          view: true,
          edit: !isDistributor,
          delete: !isDistributor,
        }}
        emptyState={{
          title: WellsText.data.noDataFound || 'No hay pozos',
          description: 'No se encontraron pozos para este cliente. Crea uno nuevo para comenzar.',
          action: !isDistributor
            ? {
                label: 'Crear Primer Pozo',
                onClick: () => navigate(`/clients/${clientId}/wells/new`),
              }
            : undefined,
        }}
      />

      {/* Info Card */}
      {wells.length > 0 && (
        <Card className="bg-muted/50 border-0">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium">Información sobre activación de pozos:</p>
              <p>
                Para activar un pozo, debe tener configurados los siguientes campos: RUT de empresa, RUT de
                informante y contraseña. Los pozos activos pueden enviar reportes al sistema DGA.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ClientWells
