import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCompanies } from '../../../services/companyServices'
import { useCookies } from 'react-cookie'
import useError from '../../../hooks/useError'
import { DataTable } from '../../../components/DataTable'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Building2 } from 'lucide-react'
import Alerts from '../../../components/Alerts'

function CompanyList() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const { error, setError } = useError()
  const [cookies] = useCookies(['token'])

  const getCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const companies = await getAllCompanies(cookies.token)
      setCompanies(companies)
    } catch (error) {
      console.log('Error fetching companies', error)
      setError('Error al cargar las empresas')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, setError])

  useEffect(() => {
    getCompanies()
  }, [getCompanies])

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
  const getRowActions = (company) => ({
    view: () => navigate(`/companies/${company.id}`),
    edit: () => navigate(`/companies/${company.id}/edit`, { state: { company } }),
    delete: () => navigate(`/companies/${company.id}/delete`, { state: { company } }),
  })

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
            <p className="text-muted-foreground">
              Gestiona todas las empresas del sistema
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
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gestiona todas las empresas del sistema
          </p>
        </div>
        <Button onClick={() => navigate('/companies/new')} className="gap-2">
          <Building2 className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={companies}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar empresas por nombre, email..."
        getRowActions={getRowActions}
        emptyState={{
          title: 'No hay empresas',
          description: 'Comienza creando tu primera empresa para gestionar clientes y pozos',
          action: {
            label: 'Crear Empresa',
            onClick: () => navigate('/companies/new'),
          },
        }}
      />
    </div>
  )
}

export default CompanyList
