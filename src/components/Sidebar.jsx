import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from './ThemeProvider'
import {
  LayoutDashboard,
  Users,
  Building2,
  Truck,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import Logo from "../assets/img/img5.webp"

export function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, isCompany, isDistributor, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  // Hide sidebar on landing page, login, and telemetry
  const noSidebarPaths = ['/login', '/', '/telemetria']
  if (noSidebarPaths.includes(location.pathname.toLowerCase())) {
    return <>{children}</>
  }

  const menuItems = []

  // Admin navigation
  if (isAdmin) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
      { icon: Users, label: 'Clientes', path: '/clients' },
      { icon: Building2, label: 'Empresas', path: '/companies' },
      { icon: Truck, label: 'Distribuidoras', path: '/distributors' },
    )
  }

  // Company navigation
  if (isCompany && user?.company) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Dashboard', path: `/companies/${user.company.id}` },
      { icon: Users, label: 'Mis Clientes', path: `/companies/${user.company.id}/clients` },
    )
  }

  // Distributor navigation
  if (isDistributor && user?.distributor) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Dashboard', path: `/distributors/${user.distributor.id}` },
      { icon: Building2, label: 'Mis Empresas', path: `/distributors/${user.distributor.id}/companies` },
    )
  }

  // Normal user navigation
  if (!isAdmin && !isCompany && !isDistributor && user?.client) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Mi Portal', path: `/clients/${user.client.id}` },
      { icon: Users, label: 'Mis Pozos', path: `/clients/${user.client.id}/wells` },
    )
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin'
    if (isCompany) return 'Empresa'
    if (isDistributor) return 'Distribuidora'
    return 'Usuario'
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b",
        collapsed && "justify-center px-2"
      )}>
        <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight">Promedición SpA</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                collapsed && "justify-center",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User Menu + Collapse */}
      <div className="border-t p-3 space-y-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={cycleTheme}
          className={cn("w-full", collapsed && "justify-center")}
        >
          {getThemeIcon()}
          {!collapsed && (
            <span className="ml-2">
              {theme === 'dark' ? 'Oscuro' : theme === 'light' ? 'Claro' : 'Sistema'}
            </span>
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors",
              collapsed && "justify-center px-2"
            )}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs font-medium">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate('/') }} className="text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm transition-opacity",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-card border-r shadow-lg transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-subtle">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
