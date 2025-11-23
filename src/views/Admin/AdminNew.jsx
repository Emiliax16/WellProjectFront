import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  Truck,
  UserPlus,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatCard } from '../../components/StatCard'
import { QuickActionCard } from '../../components/QuickActionCard'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'

function AdminNew() {
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()

  // Datos de ejemplo - reemplazar con datos reales del API
  const stats = {
    clients: 142,
    companies: 28,
    distributors: 8,
    activeWells: 89,
  }

  const quickActions = [
    {
      title: 'Nuevo Cliente',
      description: 'Crear un cliente nuevo',
      icon: <UserPlus className="w-8 h-8" />,
      path: '/clients/new'
    },
    {
      title: 'Nueva Empresa',
      description: 'Registrar una empresa',
      icon: <Building2 className="w-8 h-8" />,
      path: '/companies/new'
    },
    {
      title: 'Nueva Distribuidora',
      description: 'Crear distribuidora',
      icon: <Truck className="w-8 h-8" />,
      path: '/distributors/new'
    },
  ]

  const navigationCards = [
    {
      title: 'Ver Clientes',
      description: 'Gestionar todos los clientes',
      icon: <Users className="w-6 h-6" />,
      path: '/clients',
      count: stats.clients
    },
    {
      title: 'Ver Empresas',
      description: 'Gestionar empresas registradas',
      icon: <Building2 className="w-6 h-6" />,
      path: '/companies',
      count: stats.companies
    },
    {
      title: 'Ver Distribuidoras',
      description: 'Gestionar distribuidoras',
      icon: <Truck className="w-6 h-6" />,
      path: '/distributors',
      count: stats.distributors
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Bienvenido de vuelta, <span className="font-medium text-foreground">{user?.name}</span>
            </p>
          </div>
          <Badge variant="default" className="h-9 px-4 text-sm font-medium shadow-premium">
            {isAdmin ? 'ADMIN' : 'USER'}
          </Badge>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="hover-lift">
          <StatCard
            title="Clientes Activos"
            value={stats.clients}
            icon={<Users className="w-6 h-6" />}
            variant="default"
            className="card-premium"
          />
        </div>
        <div className="hover-lift">
          <StatCard
            title="Empresas"
            value={stats.companies}
            icon={<Building2 className="w-6 h-6" />}
            variant="success"
            className="card-premium"
          />
        </div>
        <div className="hover-lift">
          <StatCard
            title="Distribuidoras"
            value={stats.distributors}
            icon={<Truck className="w-6 h-6" />}
            variant="default"
            className="card-premium"
          />
        </div>
        <div className="hover-lift">
          <StatCard
            title="Pozos Activos"
            value={stats.activeWells}
            icon={<Activity className="w-6 h-6" />}
            variant="success"
            className="card-premium"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="card-premium border-0">
        <CardHeader>
          <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
          <CardDescription className="text-base">
            Operaciones comunes del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <div key={index} className="hover-lift">
                <QuickActionCard
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onClick={() => navigate(action.path)}
                  className="border-0 shadow-premium"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {navigationCards.map((card, index) => (
          <Card
            key={index}
            className="card-premium hover-lift cursor-pointer border-0 overflow-hidden group"
            onClick={() => navigate(card.path)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold">
                {card.title}
              </CardTitle>
              <div className="text-primary group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-2">{card.count}</div>
              <p className="text-sm text-muted-foreground mb-4">
                {card.description}
              </p>
              <Button variant="ghost" className="w-full group-hover:bg-primary/10 transition-colors" size="sm">
                Ver todos →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed (ejemplo - conectar con datos reales) */}
      <Card className="card-premium border-0">
        <CardHeader>
          <CardTitle className="text-xl">Actividad Reciente</CardTitle>
          <CardDescription className="text-base">
            Últimas acciones en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Nuevo cliente creado', entity: 'Juan Pérez', time: 'Hace 2 horas', type: 'success' },
              { action: 'Empresa actualizada', entity: 'Aguas del Valle', time: 'Hace 3 horas', type: 'default' },
              { action: 'Reporte enviado a DGA', entity: 'Pozo ABC123', time: 'Hace 5 horas', type: 'success' },
              { action: 'Error en envío', entity: 'Pozo XYZ456', time: 'Hace 1 día', type: 'danger' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all group cursor-pointer border border-transparent hover:border-border/50">
                <div className={`h-2.5 w-2.5 rounded-full shadow-lg ${
                  activity.type === 'success' ? 'bg-green-500 shadow-green-500/50' :
                  activity.type === 'danger' ? 'bg-red-500 shadow-red-500/50' :
                  'bg-blue-500 shadow-blue-500/50'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {activity.entity}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminNew
