import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import useError from '../../../hooks/useError'
import { getAllDistributors } from '../../../services/distributorService'
import { DataTable } from '../../../components/DataTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Truck } from 'lucide-react'
import Alerts from '../../../components/Alerts'

function DistributorList() {
  const navigate = useNavigate()
  const [distributors, setDistributors] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()
  const [cookies] = useCookies(['token'])

  const getDistributors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const distributors = await getAllDistributors(cookies.token)
      setDistributors(distributors)
    } catch (error) {
      console.log('Error fetching distributors', error)
      setError('Error al cargar las distribuidoras')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, setError])

  useEffect(() => {
    getDistributors()
  }, [getDistributors])

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
  const getRowActions = (distributor) => ({
    view: `/distributors/${distributor.id}`,
    edit: `/distributors/${distributor.id}/edit`,
    delete: `/distributors/${distributor.id}/delete`,
  })

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Distribuidoras</h1>
            <p className="text-muted-foreground">
              Gestiona todas las distribuidoras del sistema
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
          <h1 className="text-3xl font-bold tracking-tight">Distribuidoras</h1>
          <p className="text-muted-foreground">
            Gestiona todas las distribuidoras del sistema
          </p>
        </div>
        <Button onClick={() => navigate('/distributors/new')} className="gap-2">
          <Truck className="h-4 w-4" />
          Nueva Distribuidora
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={distributors}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar distribuidoras por nombre, email..."
        getRowActions={getRowActions}
        emptyState={{
          title: 'No hay distribuidoras',
          description: 'Comienza creando tu primera distribuidora para gestionar empresas y clientes',
          action: {
            label: 'Crear Distribuidora',
            onClick: () => navigate('/distributors/new'),
          },
        }}
      />
    </div>
  )
}

export default DistributorList
