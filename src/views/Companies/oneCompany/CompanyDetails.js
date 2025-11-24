import { useState, useEffect, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyDetailsById } from '../../../services/companyServices'
import { useAuth } from '../../../context/AuthContext'
import useError from '../../../hooks/useError'
import Alerts from '../../../components/Alerts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Skeleton } from '../../../components/ui/skeleton'
import { Separator } from '../../../components/ui/separator'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Inbox,
  Plus,
  Eye,
  FileText,
  Image as ImageIcon,
  Activity
} from 'lucide-react'

function CompanyDetails() {
  const { id: companyId } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAdmin, isCompany } = useAuth()
  const [cookies] = useCookies(['token'])
  const navigate = useNavigate()
  const { error, setError } = useError()

  const fetchCompanyDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const companyDetails = await getCompanyDetailsById(cookies.token, companyId)
      if (!companyDetails) throw new Error('No se encontraron datos de la empresa')
      setCompany(companyDetails)
    } catch (err) {
      console.log(err.message)
      setError('Error al cargar los detalles de la empresa')
    } finally {
      setLoading(false)
    }
  }, [cookies.token, companyId, setError])

  useEffect(() => {
    fetchCompanyDetails()
  }, [fetchCompanyDetails])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-48" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles de la Empresa</h1>
            <p className="text-muted-foreground">Información completa de la empresa</p>
          </div>
        </div>
        <Alerts type="error" message={error} />
      </div>
    )
  }

  if (!company) return null

  const infoItems = [
    {
      icon: Building2,
      label: 'Nombre',
      value: company.user?.name || 'No especificado',
    },
    {
      icon: FileText,
      label: 'RUT',
      value: company.companyRut || 'No especificado',
    },
    {
      icon: Mail,
      label: 'Email Corporativo',
      value: company.user?.email || 'No especificado',
    },
    {
      icon: Inbox,
      label: 'Email de Recuperación',
      value: company.recoveryEmail || 'No especificado',
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: company.location || 'No especificado',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: company.phoneNumber || 'No especificado',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{company.user?.name || 'Empresa'}</h1>
              <p className="text-muted-foreground">
                {company.companyRut ? `RUT: ${company.companyRut}` : 'Detalles de la empresa'}
              </p>
            </div>
          </div>
        </div>
        <Badge variant={company.user?.isActived ? 'success' : 'secondary'} className="text-sm">
          {company.user?.isActived ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>

      <Separator />

      {/* Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information Card */}
        <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>Datos de contacto y ubicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {infoItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="mt-0.5 rounded-lg bg-muted p-2 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold truncate mt-0.5">{item.value}</p>
                    </div>
                  </div>
                )
              })}

              {/* Logo Section */}
              {company.companyLogo && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 rounded-lg bg-muted p-2 group-hover:bg-primary/10 transition-colors">
                      <ImageIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Logo</p>
                      <p className="text-sm font-semibold truncate mt-0.5 text-primary hover:underline cursor-pointer">
                        Ver logo
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Gestiona los clientes de la empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(isAdmin || isCompany) && (
                <>
                  <Button
                    onClick={() => navigate(`/companies/${companyId}/clients`)}
                    className="w-full justify-start gap-2"
                    size="lg"
                    variant="default"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Clientes
                  </Button>

                  <Button
                    onClick={() =>
                      navigate('/clients/new', {
                        state: { createdFromCompany: true, companyId: companyId },
                      })
                    }
                    className="w-full justify-start gap-2"
                    size="lg"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    Crear Nuevo Cliente
                  </Button>
                </>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Más opciones</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/companies/${companyId}/edit`)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => navigate(`/companies/${companyId}/delete`, { state: { company } })}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="card-premium border-0 hover:shadow-premium-lg transition-all">
        <CardHeader>
          <CardTitle>Estadísticas de la Empresa</CardTitle>
          <CardDescription>Resumen de actividad y métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Clientes Activos</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Pozos Totales</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary mb-1">-</div>
              <p className="text-sm text-muted-foreground">Reportes del Mes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyDetails
