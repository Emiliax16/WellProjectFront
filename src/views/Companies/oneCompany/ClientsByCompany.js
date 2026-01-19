import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getClientsByCompany } from '../../../services/clientServices'
import { useCookies } from 'react-cookie'
import useError from '../../../hooks/useError'
import { DataTable } from '../../../components/DataTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { UserPlus, Users, ChevronLeft } from 'lucide-react'
import Alerts from '../../../components/Alerts'

function ClientsByCompany() {
  const { id: companyId } = useParams()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()
  const [cookies] = useCookies(['token'])

  const getClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const clients = await getClientsByCompany(cookies.token, companyId)
      setClients(clients)
    } catch (error) {
      console.log('Error fetching clients', error)
      setError('Error al cargar los clientes de la empresa')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, setError, companyId])

  useEffect(() => {
    getClients()
  }, [getClients])

  // Definir columnas para la tabla
  const columns = [
    {
      accessorKey: 'user.name',
      header: 'Nombre',
      accessorFn: (row) => row.user?.name || 'Sin nombre',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.user?.name || 'Sin nombre'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'user.email',
      header: 'Email',
      accessorFn: (row) => row.user?.email || '-',
      cell: (row) => (
        <div className="text-muted-foreground">{row.user?.email || '-'}</div>
      ),
    },
    {
      accessorKey: 'user.isActived',
      header: 'Estado',
      accessorFn: (row) => (row.user?.isActived ? 'Activo' : 'Inactivo'),
      cell: (row) => (
        <Badge variant={row.user?.isActived ? 'success' : 'secondary'}>
          {row.user?.isActived ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
      sortable: true,
    },
  ]

  // Definir acciones para cada fila
  const getRowActions = (client) => ({
    view: () => navigate(`/clients/${client.id}`),
    edit: () => navigate(`/clients/${client.id}/edit`, { state: { client, companyId } }),
    delete: () => navigate(`/clients/${client.id}/delete`, { state: { client, companyId } }),
  })

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes de la Empresa</h1>
            <p className="text-muted-foreground">
              Gestiona los clientes asociados a esta empresa
            </p>
          </div>
        </div>
        <Alerts type="error" message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/companies/${companyId}`)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes de la Empresa</h1>
            <p className="text-muted-foreground">
              Gestiona los clientes asociados a esta empresa
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/clients/new', { state: { createdFromCompany: true, companyId } })}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabla de clientes */}
      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Buscar cliente por nombre, email..."
        loading={loading}
        getRowActions={getRowActions}
        emptyState={{
          title: 'No hay clientes',
          description: 'No hay clientes asociados a esta empresa. Crea uno nuevo para comenzar.',
          action: {
            label: 'Crear Primer Cliente',
            onClick: () => navigate('/clients/new', { state: { createdFromCompany: true, companyId } }),
          },
        }}
      />
    </div>
  )
}

export default ClientsByCompany