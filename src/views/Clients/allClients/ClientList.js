import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllClients } from '../../../services/clientServices'
import { useCookies } from 'react-cookie'
import useError from '../../../hooks/useError'
import { DataTable } from '../../../components/DataTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { UserPlus } from 'lucide-react'
import Alerts from '../../../components/Alerts'

function ClientList() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()
  const [cookies] = useCookies(['token'])

  const getClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const clients = await getAllClients(cookies.token)
      setClients(clients)
    } catch (error) {
      console.log('Error fetching clients', error)
      setError('Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, setError])

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
        <div className="font-medium">{row.user?.name || 'Sin nombre'}</div>
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
    view: `/clients/${client.id}`,
    edit: `/clients/${client.id}/edit`,
    delete: `/clients/${client.id}/delete`,
  })

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gestiona todos los clientes del sistema
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona todos los clientes del sistema
          </p>
        </div>
        <Button onClick={() => navigate('/clients/new')} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={clients}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar clientes por nombre, email..."
        getRowActions={getRowActions}
        emptyState={{
          title: 'No hay clientes',
          description: 'Comienza creando tu primer cliente para gestionar pozos y reportes',
          action: {
            label: 'Crear Cliente',
            onClick: () => navigate('/clients/new'),
          },
        }}
      />
    </div>
  )
}

export default ClientList
