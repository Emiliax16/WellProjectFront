import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCompaniesByDistributor } from '../../../services/companyServices';
import { useCookies } from 'react-cookie';
import useError from '../../../hooks/useError';
import { DataTable } from '../../../components/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Building2, Plus } from 'lucide-react';
import Alerts from '../../../components/Alerts';
import { useNavigate } from 'react-router-dom';

function CompaniesByDistributor() {
  const { id: distributorId } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, setError } = useError();
  const [cookies] = useCookies(['token']);

  const getCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companies = await getCompaniesByDistributor(cookies.token, distributorId);
      setCompanies(companies);
    } catch (error) {
      console.log('Error fetching companies', error);
      setError('Error al cargar las empresas de la distribuidora');
    } finally {
      setLoading(false);
    }
  }, [cookies.token, setError, distributorId]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  // Definir columnas para la tabla
  const columns = [
    {
      accessorKey: 'user.name',
      header: 'Nombre de Empresa',
      accessorFn: (row) => row.user?.name || 'Sin nombre',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
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
      accessorKey: 'companyRut',
      header: 'RUT',
      accessorFn: (row) => row.companyRut || '-',
      cell: (row) => (
        <div className="font-mono text-sm">{row.companyRut || '-'}</div>
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
  ];

  // Definir acciones para cada fila
  const getRowActions = (company) => ({
    view: `/companies/${company.id}`,
    edit: `/companies/${company.id}/edit`,
    delete: `/companies/${company.id}/delete`,
  });

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresas de la Distribuidora</h1>
            <p className="text-muted-foreground">
              Gestiona las empresas asociadas a esta distribuidora
            </p>
          </div>
        </div>
        <Alerts type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas de la Distribuidora</h1>
          <p className="text-muted-foreground">
            Gestiona las empresas asociadas a esta distribuidora
          </p>
        </div>
        <Button onClick={() => navigate(`/distributors/${distributorId}/companies/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* Tabla de empresas */}
      <DataTable
        columns={columns}
        data={companies}
        searchKey="user.name"
        searchPlaceholder="Buscar empresa..."
        loading={loading}
        getRowActions={getRowActions}
        emptyMessage="No hay empresas asociadas a esta distribuidora"
      />
    </div>
  );
}

export default CompaniesByDistributor;
