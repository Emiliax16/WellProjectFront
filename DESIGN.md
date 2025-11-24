# WellProject Frontend - Design System & Redesign Plan

**Objetivo**: Transformar el frontend de WellProject en una aplicación de clase mundial con diseño minimalista, profesional y moderno, inspirado en los mejores dashboards del mundo (GitHub, Stripe, Linear, Vercel).

**Fecha**: 2025-11-22
**Estado**: 📋 Plan de Rediseño
**Prioridad**: 🔥 Alta

---

## 📊 Análisis del Estado Actual

### ❌ Problemas Críticos Identificados

1. **Dashboard de Admin**: Extremadamente básico - solo botones de colores brillantes sin estructura
2. **Tablas HTML planas**: Sin paginación visual atractiva, sin filtros modernos
3. **Navbar básico**: Material-UI sin personalización, sin breadcrumbs
4. **Sin jerarquía visual**: Todo tiene el mismo peso visual
5. **Colores inconsistentes**: `bg-green-500`, `bg-pink-500`, `bg-orange-500` sin sistema
6. **Headers hardcodeados**: "Welcome to the clients view" en verde brillante
7. **Sin feedback visual**: Loading states básicos (spinning cat icon)
8. **Formularios funcionales pero antiestéticos**: Sin diseño moderno
9. **Sin dark mode**: Esencial en 2025
10. **Tres sistemas CSS mezclados**: Material-UI + Tailwind + @material-tailwind sin cohesión

### ✅ Fortalezas a Mantener

- Arquitectura de componentes sólida
- Sistema de autenticación robusto
- Lógica de negocio bien separada
- Internacionalización preparada

---

## 🎯 Recomendación de Herramienta: **Shadcn/ui**

### ¿Por qué Shadcn/ui es la mejor opción?

#### ✅ Ventajas Decisivas

1. **Propiedad total del código**: Copy-paste approach - no es una dependencia npm
2. **Tailwind-first**: Integración perfecta con tu stack actual
3. **Radix UI primitives**: Accesibilidad A+ (WCAG 2.1) out-of-the-box
4. **Customización extrema**: Cada componente es tuyo, modifícalo sin límites
5. **React 19 + Tailwind v4 ready**: Última tecnología (2025)
6. **OKLCH colors**: Colores perceptualmente uniformes (mejor que HSL)
7. **929+ bloques, 1115+ componentes**: Ecosistema masivo
8. **Zero runtime overhead**: Solo Tailwind classes, no CSS-in-JS
9. **TypeScript-first**: Type safety completa (migraremos gradualmente)
10. **Dark mode nativo**: Variables CSS + class switching

#### 🆚 Comparación con Alternativas

| Feature | Shadcn/ui | Magic UI | Material-UI | Ant Design |
|---------|-----------|----------|-------------|------------|
| **Propiedad del código** | ✅ Total | ❌ Dependencia | ❌ Dependencia | ❌ Dependencia |
| **Tailwind-first** | ✅ Nativo | ✅ Compatible | ❌ Emotion | ❌ Less |
| **Bundle size** | 🟢 Mínimo | 🟡 Medio | 🔴 Grande | 🔴 Grande |
| **Customización** | 🟢 Ilimitada | 🟡 Limitada | 🟡 Compleja | 🟡 Temas |
| **Accesibilidad** | 🟢 A+ (Radix) | 🟡 B | 🟢 A | 🟡 B+ |
| **Dark mode** | 🟢 Nativo | 🟢 Sí | 🟡 Manual | 🟢 Sí |
| **Moderno (2025)** | 🟢 Sí | 🟢 Sí | 🟡 Legacy | 🟡 Legacy |
| **Learning curve** | 🟢 Baja | 🟡 Media | 🟡 Media | 🟡 Media |

#### 🎨 Magic UI: Rol Complementario

**Magic UI** es excelente para:
- Landing page animations
- Marketing sections
- Hero components con efectos wow
- Micro-interactions especiales

**Plan**: Usar **Shadcn/ui** para el dashboard/app, **Magic UI** para landing page y secciones de marketing.

---

## 🎨 Design System

### 1. Paleta de Colores (OKLCH)

**Sistema de color semántico** inspirado en GitHub + Stripe:

```css
/* Colores Base (Light Mode) */
--background: 0 0% 100%;           /* Blanco puro */
--foreground: 224 71% 4%;          /* Casi negro, tinte azul */
--card: 0 0% 100%;
--card-foreground: 224 71% 4%;

/* Colores Neutros (Grises) */
--muted: 220 13% 96%;              /* Gris muy claro */
--muted-foreground: 220 9% 46%;    /* Gris medio */
--border: 220 13% 91%;             /* Borde sutil */
--input: 220 13% 91%;
--ring: 215 20% 65%;               /* Focus ring azul suave */

/* Primary (Azul profesional - estilo GitHub) */
--primary: 213 94% 68%;            /* #3B82F6 equivalente */
--primary-foreground: 0 0% 100%;

/* Secondary (Gris oscuro) */
--secondary: 220 13% 96%;
--secondary-foreground: 220 9% 10%;

/* Accent (Azul vibrante - acentos) */
--accent: 217 91% 60%;
--accent-foreground: 0 0% 100%;

/* Estados */
--destructive: 0 84% 60%;          /* Rojo para acciones destructivas */
--destructive-foreground: 0 0% 100%;

--success: 142 71% 45%;            /* Verde para éxito */
--success-foreground: 0 0% 100%;

--warning: 38 92% 50%;             /* Ámbar para advertencias */
--warning-foreground: 0 0% 100%;

--info: 199 89% 48%;               /* Azul cielo para info */
--info-foreground: 0 0% 100%;
```

```css
/* Dark Mode */
[data-theme="dark"] {
  --background: 224 71% 4%;         /* Casi negro */
  --foreground: 213 31% 91%;        /* Blanco off-white */
  --card: 224 71% 6%;
  --card-foreground: 213 31% 91%;

  --muted: 223 47% 11%;
  --muted-foreground: 215 20% 65%;
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  --ring: 213 94% 68%;

  --primary: 213 94% 68%;
  --primary-foreground: 224 71% 4%;

  --secondary: 222 47% 11%;
  --secondary-foreground: 213 31% 91%;

  /* Estados ajustados para dark mode */
  --destructive: 0 63% 50%;
  --success: 142 71% 40%;
  --warning: 38 92% 45%;
  --info: 199 89% 43%;
}
```

### 2. Tipografía

**Sistema tipográfico de dos fuentes** (estilo GitHub/Linear):

```css
/* Fuentes */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Tamaños (Escala modular 1.250 - Major Third) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */

/* Pesos */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

**Jerarquía de Títulos**:

```tsx
// Display (Hero, landing page)
<h1 className="text-5xl font-bold tracking-tight">

// H1 (Page titles)
<h1 className="text-3xl font-semibold tracking-tight">

// H2 (Section headers)
<h2 className="text-2xl font-semibold">

// H3 (Subsections)
<h3 className="text-xl font-semibold">

// H4 (Card titles)
<h4 className="text-lg font-medium">

// Body
<p className="text-base text-muted-foreground">

// Small
<span className="text-sm text-muted-foreground">

// Caption
<caption className="text-xs text-muted-foreground">
```

### 3. Espaciado

**Sistema de espaciado de 4px** (estilo Tailwind):

```css
/* Base unit: 4px (0.25rem) */
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */

/* Uso común */
/* - Gap entre elementos pequeños: spacing-2 (8px) */
/* - Gap entre elementos: spacing-4 (16px) */
/* - Gap entre secciones: spacing-6 (24px) */
/* - Padding de cards: spacing-6 (24px) */
/* - Padding de modals: spacing-8 (32px) */
/* - Margen entre secciones grandes: spacing-12 (48px) */
```

### 4. Bordes y Sombras

**Radios de borde**:

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - inputs, tags */
--radius-md: 0.5rem;     /* 8px - cards, buttons */
--radius-lg: 0.75rem;    /* 12px - modals, popovers */
--radius-xl: 1rem;       /* 16px - hero cards */
--radius-full: 9999px;   /* Círculo completo */
```

**Sombras** (inspiradas en Stripe - sutiles y elegantes):

```css
/* Light mode */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* Dark mode - más sutiles */
[data-theme="dark"] {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6);
}
```

### 5. Animaciones y Transiciones

**Duraciones** (estilo Framer Motion):

```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Timing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce */
```

**Transiciones comunes**:

```css
/* Default transition para interactive elements */
.interactive {
  transition: all var(--duration-base) var(--ease-out);
}

/* Hover effects */
.hover-lift {
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from bottom */
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Skeleton pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 🧩 Inventario de Componentes a Rediseñar

### Prioridad 1: Componentes Base (Shadcn/ui)

Estos son los componentes de Shadcn/ui que instalaremos:

```bash
# Instalación de Shadcn/ui
npx shadcn@latest init

# Componentes core
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add tabs
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add command
npx shadcn@latest add popover
npx shadcn@latest add sheet
npx shadcn@latest add form
npx shadcn@latest add calendar
npx shadcn@latest add breadcrumb
npx shadcn@latest add pagination
```

### Prioridad 2: Componentes Compuestos (Custom)

Construiremos sobre Shadcn/ui:

1. **AppShell** (Layout principal)
   - Sidebar colapsable
   - Header con breadcrumbs
   - Content area
   - Footer

2. **Sidebar Navigation**
   - Íconos + labels
   - Collapsible sections
   - Active state indicators
   - Search/Command palette

3. **DataTable** (Tabla avanzada)
   - Sorting
   - Filtering
   - Pagination
   - Column visibility toggle
   - Row selection
   - Actions menu
   - Export to Excel/CSV

4. **StatCard** (Cards de métricas)
   - Título + valor + variación
   - Sparkline charts (opcional)
   - Color coding

5. **FormBuilder**
   - react-hook-form integration
   - Validación inline
   - Error states elegantes
   - Success states

6. **EmptyState**
   - Ilustración
   - Título + descripción
   - CTA button

7. **LoadingState**
   - Skeleton loaders (no spinning cats)
   - Progress bars
   - Suspense boundaries

---

## 📐 Rediseño Vista por Vista

### 1. Dashboard de Admin (`/admin`)

**Estado actual**: Botones de colores sin estructura

**Rediseño propuesto**: Dashboard moderno estilo GitHub

```tsx
// Layout
<AppShell>
  <PageHeader
    title="Dashboard"
    description="Vista general del sistema"
    actions={<Button>Nueva acción</Button>}
  />

  {/* Métricas principales */}
  <Grid cols={4} gap={6}>
    <StatCard
      title="Clientes Activos"
      value="142"
      change="+12%"
      changeType="positive"
      icon={<UsersIcon />}
    />
    <StatCard
      title="Pozos Activos"
      value="89"
      change="+5%"
      changeType="positive"
      icon={<WellIcon />}
    />
    <StatCard
      title="Reportes Enviados"
      value="1,234"
      change="+23%"
      changeType="positive"
      icon={<FileTextIcon />}
    />
    <StatCard
      title="Reportes Pendientes"
      value="45"
      change="-8%"
      changeType="negative"
      icon={<AlertCircleIcon />}
    />
  </Grid>

  {/* Acciones rápidas */}
  <Card>
    <CardHeader>
      <CardTitle>Acciones Rápidas</CardTitle>
      <CardDescription>Operaciones comunes</CardDescription>
    </CardHeader>
    <CardContent>
      <Grid cols={3} gap={4}>
        <QuickActionCard
          title="Nuevo Cliente"
          description="Crear un cliente nuevo"
          icon={<UserPlusIcon />}
          onClick={() => navigate('/clients/new')}
        />
        <QuickActionCard
          title="Nueva Empresa"
          description="Registrar una empresa"
          icon={<BuildingIcon />}
          onClick={() => navigate('/companies/new')}
        />
        <QuickActionCard
          title="Nueva Distribuidora"
          description="Crear distribuidora"
          icon={<TruckIcon />}
          onClick={() => navigate('/distributors/new')}
        />
      </Grid>
    </CardContent>
  </Card>

  {/* Actividad reciente */}
  <Card>
    <CardHeader>
      <CardTitle>Actividad Reciente</CardTitle>
    </CardHeader>
    <CardContent>
      <ActivityFeed items={recentActivity} />
    </CardContent>
  </Card>
</AppShell>
```

**Elementos clave**:
- ✅ Métricas visuales con iconos
- ✅ Cards organizadas en grid
- ✅ Jerarquía visual clara
- ✅ Colores del design system
- ✅ Espaciado consistente

---

### 2. Lista de Clientes (`/clients`)

**Estado actual**: Tabla HTML plana con header verde

**Rediseño propuesto**: DataTable moderna

```tsx
<AppShell>
  <PageHeader
    title="Clientes"
    description="Gestión de clientes del sistema"
    breadcrumbs={[
      { label: 'Dashboard', href: '/admin' },
      { label: 'Clientes', current: true }
    ]}
    actions={
      <Button onClick={() => navigate('/clients/new')}>
        <PlusIcon /> Nuevo Cliente
      </Button>
    }
  />

  {/* Filters */}
  <Card className="mb-6">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          icon={<SearchIcon />}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>

  {/* DataTable */}
  <DataTable
    columns={[
      {
        id: 'name',
        header: 'Nombre',
        accessorKey: 'user.name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{row.original.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {row.original.user.email}
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'company',
        header: 'Empresa',
        accessorKey: 'company.user.name',
      },
      {
        id: 'status',
        header: 'Estado',
        accessorKey: 'user.isActived',
        cell: ({ row }) => (
          <Badge variant={row.original.user.isActived ? 'success' : 'secondary'}>
            {row.original.user.isActived ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
      {
        id: 'wells',
        header: 'Pozos',
        accessorKey: 'wells',
        cell: ({ row }) => row.original.wells?.length || 0
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/clients/${row.original.id}`)}>
                <EyeIcon /> Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/clients/${row.original.id}/edit`)}>
                <EditIcon /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.id)}
                className="text-destructive"
              >
                <TrashIcon /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ]}
    data={clients}
    pagination
    sorting
    filtering
  />
</AppShell>
```

**Elementos clave**:
- ✅ Breadcrumbs para navegación
- ✅ Search + filters en card separada
- ✅ Avatar + nombre + email en celda
- ✅ Badge para estados
- ✅ Dropdown menu para acciones
- ✅ Sin header verde horrible

---

### 3. Reportes de Pozo (`/clients/:clientId/wells/:code`)

**Estado actual**: DatePicker + botón + tabla MUI

**Rediseño propuesto**: Vista moderna con filtros avanzados

```tsx
<AppShell>
  <PageHeader
    title={`Reportes - Pozo ${well?.code}`}
    description={well?.name}
    breadcrumbs={[
      { label: 'Dashboard', href: '/admin' },
      { label: 'Clientes', href: '/clients' },
      { label: client?.user.name, href: `/clients/${clientId}` },
      { label: 'Pozos', href: `/clients/${clientId}/wells` },
      { label: well?.code, current: true }
    ]}
    actions={
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExportExcel}>
          <DownloadIcon /> Exportar
        </Button>
        {(isAdmin || isCompany) && (
          <Button
            onClick={handleSendReports}
            disabled={!well?.isActived}
          >
            <SendIcon /> Enviar a DGA
          </Button>
        )}
      </div>
    }
  />

  {/* Well Status Card */}
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-3 h-3 rounded-full",
            well?.isActived ? "bg-green-500" : "bg-gray-400"
          )} />
          <div>
            <p className="font-medium">
              {well?.isActived ? 'Pozo Activo' : 'Pozo Inactivo'}
            </p>
            <p className="text-sm text-muted-foreground">
              {well?.location}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <SettingsIcon /> Configurar
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Filters Card */}
  <Card className="mb-6">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleResetFilters}>
          Limpiar filtros
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Stats Cards */}
  <Grid cols={4} gap={4} className="mb-6">
    <StatCard
      title="Total Reportes"
      value={numRows}
      icon={<FileTextIcon />}
    />
    <StatCard
      title="Enviados"
      value={sentReports}
      icon={<CheckCircleIcon />}
      variant="success"
    />
    <StatCard
      title="Pendientes"
      value={pendingReports}
      icon={<ClockIcon />}
      variant="warning"
    />
    <StatCard
      title="Caudal Promedio"
      value={`${avgCaudal.toFixed(2)} L/s`}
      icon={<DropletIcon />}
    />
  </Grid>

  {/* DataTable */}
  <DataTable
    columns={[
      { id: 'code', header: 'Código', accessorKey: 'code' },
      {
        id: 'date',
        header: 'Fecha',
        accessorKey: 'date',
        cell: ({ row }) => format(new Date(row.original.realDate), 'dd/MM/yyyy')
      },
      { id: 'hour', header: 'Hora', accessorKey: 'hour' },
      {
        id: 'totalizador',
        header: 'Totalizador (m³)',
        accessorKey: 'totalizador',
        cell: ({ row }) => row.original.totalizador.toLocaleString()
      },
      {
        id: 'caudal',
        header: 'Caudal (L/s)',
        accessorKey: 'caudal',
        cell: ({ row }) => row.original.caudal.toFixed(2)
      },
      {
        id: 'nivel_freatico',
        header: 'Nivel Freático (m)',
        accessorKey: 'nivel_freatico',
        cell: ({ row }) => row.original.nivel_freatico.toFixed(2)
      },
      {
        id: 'sent',
        header: 'Estado',
        accessorKey: 'sent',
        cell: ({ row }) => (
          <Badge variant={row.original.sent ? 'success' : 'secondary'}>
            {row.original.sent ? 'Enviado' : 'Pendiente'}
          </Badge>
        )
      },
    ]}
    data={wellReports}
    pagination
    sorting
  />
</AppShell>
```

**Elementos clave**:
- ✅ Well status card prominente
- ✅ Filtros en card dedicada
- ✅ Métricas de resumen (stats cards)
- ✅ Tabla con formato numérico apropiado
- ✅ Badges para estados
- ✅ Acciones en header

---

### 4. Navbar (Global)

**Estado actual**: Material-UI básico sin personalización

**Rediseño propuesto**: AppShell con Sidebar

```tsx
<div className="flex h-screen">
  {/* Sidebar */}
  <Sidebar collapsed={sidebarCollapsed}>
    <SidebarHeader>
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        {!sidebarCollapsed && (
          <span className="font-semibold text-lg">WellProject</span>
        )}
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarNav>
        {/* Admin */}
        {isAdmin && (
          <>
            <SidebarItem
              icon={<LayoutDashboardIcon />}
              label="Dashboard"
              href="/admin"
              active={pathname === '/admin'}
            />
            <SidebarSeparator />
            <SidebarItem
              icon={<UsersIcon />}
              label="Clientes"
              href="/clients"
              active={pathname.startsWith('/clients')}
            />
            <SidebarItem
              icon={<BuildingIcon />}
              label="Empresas"
              href="/companies"
              active={pathname.startsWith('/companies')}
            />
            <SidebarItem
              icon={<TruckIcon />}
              label="Distribuidoras"
              href="/distributors"
              active={pathname.startsWith('/distributors')}
            />
          </>
        )}

        {/* Company */}
        {isCompany && (
          <>
            <SidebarItem
              icon={<LayoutDashboardIcon />}
              label="Dashboard"
              href={`/companies/${user.company.id}`}
            />
            <SidebarItem
              icon={<UsersIcon />}
              label="Mis Clientes"
              href={`/companies/${user.company.id}/clients`}
            />
          </>
        )}

        {/* Normal User */}
        {!isAdmin && !isCompany && !isDistributor && user?.client && (
          <>
            <SidebarItem
              icon={<LayoutDashboardIcon />}
              label="Mi Portal"
              href={`/clients/${user.client.id}`}
            />
            <SidebarItem
              icon={<WellIcon />}
              label="Mis Pozos"
              href={`/clients/${user.client.id}/wells`}
            />
          </>
        )}
      </SidebarNav>
    </SidebarContent>

    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <SettingsIcon /> Configuración
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOutIcon /> Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="mt-2"
      >
        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Button>
    </SidebarFooter>
  </Sidebar>

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto bg-background">
    <div className="container py-6">
      {children}
    </div>
  </main>
</div>
```

**Elementos clave**:
- ✅ Sidebar colapsable (estilo GitHub/Linear)
- ✅ Íconos + labels
- ✅ Active states claros
- ✅ User dropdown en footer
- ✅ Dark mode toggle
- ✅ Sin AppBar top (más moderno)

---

### 5. Formularios (Clientes, Empresas, Pozos)

**Estado actual**: react-hook-form funcional pero sin diseño

**Rediseño propuesto**: Formularios modernos con validación inline

```tsx
<AppShell>
  <PageHeader
    title="Nuevo Cliente"
    description="Crear un nuevo cliente en el sistema"
    breadcrumbs={[
      { label: 'Dashboard', href: '/admin' },
      { label: 'Clientes', href: '/clients' },
      { label: 'Nuevo', current: true }
    ]}
  />

  <div className="max-w-2xl">
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
        <CardDescription>
          Complete los datos del nuevo cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección: Datos de Usuario */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datos de Usuario</h3>
              <Separator />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nombre para inicio de sesión
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="juan@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="encrypted_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 8 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActived"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Estado Activo
                      </FormLabel>
                      <FormDescription>
                        Permitir acceso al sistema
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Sección: Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datos Personales</h3>
              <Separator />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Alberto Pérez González" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+56 9 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Personal</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan.personal@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Santiago, Chile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sección: Empresa */}
            {(isAdmin || isCompany) && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Empresa</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa Asociada</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map(company => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Empresa a la que pertenece el cliente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/clients')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />}
                Crear Cliente
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
</AppShell>
```

**Elementos clave**:
- ✅ Secciones separadas con títulos
- ✅ FormDescription para ayuda contextual
- ✅ Validación inline con FormMessage
- ✅ Switch para boolean values
- ✅ Grid para campos relacionados
- ✅ Loading states en botones
- ✅ Max-width para legibilidad

---

### 6. Loading States y Empty States

**Estado actual**: Spinning cat icon, sin empty states

**Rediseño propuesto**: Skeleton loaders + Empty states elegantes

```tsx
// Skeleton Loader para tabla
<div className="space-y-4">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ))}
</div>

// Empty State
<EmptyState
  icon={<InboxIcon className="w-16 h-16 text-muted-foreground" />}
  title="No hay clientes"
  description="Comienza creando tu primer cliente para gestionar pozos de agua"
  action={
    <Button onClick={() => navigate('/clients/new')}>
      <PlusIcon /> Crear Cliente
    </Button>
  }
/>

// Empty State para filtros sin resultados
<EmptyState
  icon={<SearchIcon className="w-16 h-16 text-muted-foreground" />}
  title="No se encontraron resultados"
  description="Intenta ajustar tus filtros de búsqueda"
  action={
    <Button variant="outline" onClick={handleClearFilters}>
      Limpiar filtros
    </Button>
  }
/>
```

---

### 7. Dark Mode

**Implementación**:

```tsx
// ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

**Toggle en navbar**:

```tsx
<DropdownMenuItem onClick={() => {
  const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
  setTheme(newTheme)
}}>
  {theme === 'dark' && <MoonIcon />}
  {theme === 'light' && <SunIcon />}
  {theme === 'system' && <MonitorIcon />}
  {theme === 'dark' ? 'Modo Oscuro' : theme === 'light' ? 'Modo Claro' : 'Sistema'}
</DropdownMenuItem>
```

---

## 🚀 Plan de Implementación

### Fase 1: Setup (Semana 1)

**Objetivo**: Preparar el entorno para Shadcn/ui

```bash
# 1. Instalar Shadcn/ui
npx shadcn@latest init

# Configuración recomendada:
# - TypeScript: No (por ahora, migrar gradualmente)
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - React Server Components: No
# - Tailwind config: tailwind.config.js
# - Components dir: src/components/ui
# - Utils dir: src/lib/utils
# - Import alias: @/

# 2. Actualizar Tailwind Config
# (shadcn init lo hace automáticamente)

# 3. Instalar íconos
npm install lucide-react

# 4. Instalar dependencias adicionales
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
npm install date-fns  # Para formateo de fechas moderno
```

**Tareas**:
- [ ] Ejecutar `npx shadcn@latest init`
- [ ] Instalar componentes base (button, card, input, etc.)
- [ ] Crear archivo `src/lib/utils.ts` con función `cn()`
- [ ] Configurar ThemeProvider
- [ ] Crear variables CSS en `src/index.css`
- [ ] Testear dark mode toggle

### Fase 2: Design System (Semana 1-2)

**Objetivo**: Establecer tokens de diseño

**Tareas**:
- [ ] Definir paleta de colores OKLCH en CSS variables
- [ ] Configurar tipografía (instalar Inter font)
- [ ] Crear archivo `tailwind.config.js` customizado
- [ ] Documentar sistema de espaciado
- [ ] Crear Storybook o Ladle para componentes (opcional)
- [ ] Crear página `/design-system` (solo dev) para visualizar tokens

### Fase 3: Componentes Base (Semana 2-3)

**Objetivo**: Instalar y customizar componentes de Shadcn/ui

**Tareas**:
- [ ] Instalar 25+ componentes de Shadcn/ui (ver lista arriba)
- [ ] Customizar estilos si es necesario
- [ ] Crear componentes compuestos:
  - [ ] AppShell
  - [ ] Sidebar
  - [ ] PageHeader
  - [ ] Breadcrumbs
  - [ ] StatCard
  - [ ] EmptyState
  - [ ] LoadingState / Skeleton
- [ ] Documentar uso de cada componente

### Fase 4: Navbar y Layout (Semana 3)

**Objetivo**: Rediseñar navegación global

**Tareas**:
- [ ] Crear nuevo AppShell con Sidebar
- [ ] Implementar Sidebar collapsible
- [ ] Migrar lógica de navbar actual a Sidebar
- [ ] Implementar user dropdown
- [ ] Dark mode toggle
- [ ] Breadcrumbs component
- [ ] Testear responsive (mobile sidebar)

### Fase 5: Dashboard de Admin (Semana 4)

**Objetivo**: Rediseñar `/admin`

**Tareas**:
- [ ] Eliminar botones de colores
- [ ] Crear StatCards con métricas
- [ ] Crear QuickActionCards
- [ ] Implementar ActivityFeed
- [ ] Grid layout con Tailwind
- [ ] Conectar con datos reales (si disponibles)

### Fase 6: Listas (Clientes, Empresas, Distribuidoras) (Semana 5-6)

**Objetivo**: Rediseñar vistas de lista con DataTable

**Tareas**:
- [ ] Crear DataTable component reutilizable
- [ ] Implementar sorting
- [ ] Implementar filtering
- [ ] Implementar pagination
- [ ] Implementar column visibility
- [ ] Implementar row selection
- [ ] Migrar ClientList
- [ ] Migrar CompanyList
- [ ] Migrar DistributorList
- [ ] Añadir search + filters en cards
- [ ] Implementar empty states

### Fase 7: Detalles y Formularios (Semana 7-8)

**Objetivo**: Rediseñar vistas de detalles y formularios

**Tareas**:
- [ ] Migrar todos los formularios a Shadcn/ui Form
- [ ] Implementar validación inline
- [ ] Mejorar UX de errores
- [ ] Añadir FormDescription
- [ ] Cards para secciones de formulario
- [ ] Loading states en botones
- [ ] Success feedback (toasts)

### Fase 8: Reportes de Pozo (Semana 9)

**Objetivo**: Rediseñar vista de reportes

**Tareas**:
- [ ] Rediseñar well status card
- [ ] Mejorar filtros (mes/año)
- [ ] Añadir stats cards (total, enviados, pendientes, caudal promedio)
- [ ] Migrar tabla a DataTable
- [ ] Mejorar botón "Enviar a DGA" con loading + confirmation
- [ ] Export to Excel mejorado

### Fase 9: Landing Page (Semana 10)

**Objetivo**: Rediseñar landing page con Magic UI

**Tareas**:
- [ ] Instalar Magic UI components
- [ ] Rediseñar hero section con animaciones
- [ ] Mejorar features section (Bento Grid)
- [ ] Añadir testimonials (si aplica)
- [ ] Mejorar formulario de contacto
- [ ] Animaciones de scroll (Framer Motion)

### Fase 10: Polish y Performance (Semana 11-12)

**Objetivo**: Optimización y refinamiento

**Tareas**:
- [ ] Code splitting (React.lazy)
- [ ] Optimizar imágenes
- [ ] Añadir transiciones entre páginas
- [ ] Mejorar estados de loading globales
- [ ] Implementar error boundaries
- [ ] Testing de accesibilidad (WCAG 2.1)
- [ ] Testing de performance (Lighthouse)
- [ ] Testing en diferentes browsers
- [ ] Testing mobile/tablet
- [ ] Documentación final

---

## 📚 Recursos y Referencias

### Design Inspiration

1. **GitHub Dashboard**
   - Sidebar colapsable
   - Cards de stats
   - DataTable con filtros avanzados
   - Dark mode impecable

2. **Stripe Dashboard**
   - Minimalismo extremo
   - Tipografía perfecta
   - Jerarquía visual clara
   - Animaciones sutiles

3. **Linear**
   - Command palette (⌘K)
   - Keyboard shortcuts
   - Sidebar navigation
   - Fast, responsive

4. **Vercel Dashboard**
   - Clean cards
   - Perfect spacing
   - Great empty states
   - Deployment logs UI

### Tools

- **Figma** (opcional): Para mockups de alta fidelidad
- **Excalidraw**: Para wireframes rápidos
- **Realtime Colors**: Para probar paletas de colores
- **Coolors**: Generador de paletas
- **FontPair**: Combinar fuentes
- **Lighthouse**: Performance testing

### Documentation

- **Shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/
- **Framer Motion**: https://www.framer.com/motion/

---

## ✅ Checklist de Calidad

Antes de considerar una vista "completa", verificar:

- [ ] **Responsive**: Mobile, tablet, desktop
- [ ] **Dark mode**: Funciona perfectamente en ambos temas
- [ ] **Accesibilidad**: Keyboard navigation, ARIA labels, contrast ratios
- [ ] **Loading states**: Skeleton loaders, no flashes
- [ ] **Empty states**: Ilustración + título + descripción + CTA
- [ ] **Error handling**: Error boundaries, user-friendly messages
- [ ] **Performance**: < 3s FCP, < 5s LCP (Lighthouse)
- [ ] **Animation**: Smooth 60fps, no jank
- [ ] **Typography**: Hierarchy clara, legibilidad
- [ ] **Spacing**: Consistente con design system
- [ ] **Colors**: Del design system, no hardcoded
- [ ] **Icons**: Lucide icons, tamaño consistente
- [ ] **Interactions**: Hover states, focus states, active states
- [ ] **Feedback**: Toasts, confirmations para acciones críticas

---

## 🎯 Métricas de Éxito

**Objetivo cuantificable**:

| Métrica | Antes | Meta | Herramienta |
|---------|-------|------|-------------|
| **Lighthouse Performance** | ~60 | >90 | Chrome DevTools |
| **Lighthouse Accessibility** | ~75 | >95 | Chrome DevTools |
| **Bundle Size** | ~800kb | <500kb | webpack-bundle-analyzer |
| **First Contentful Paint** | ~3.5s | <2s | Lighthouse |
| **Time to Interactive** | ~5s | <3.5s | Lighthouse |
| **Cumulative Layout Shift** | ~0.15 | <0.1 | Lighthouse |

---

## 🔄 Estrategia de Migración

**Enfoque incremental** (no rewrite completo):

1. **Coexistencia**: Shadcn/ui components conviven con Material-UI
2. **Feature flags**: Habilitar nuevo diseño vista por vista
3. **A/B testing**: Comparar versiones si es necesario
4. **Rollback plan**: Mantener código viejo hasta confirmar nuevo diseño

**Ruta de migración por componente**:

```
Material-UI Button → Shadcn Button
Material-UI Table → DataTable (custom con Shadcn)
Material-UI Dialog → Shadcn Dialog
Material-UI Menu → Shadcn DropdownMenu
Material-UI Alert → Shadcn Alert / Toast
```

---

## 📝 Notas Finales

### ¿Por qué este approach?

1. **Minimalista**: Menos es más - cada elemento tiene un propósito
2. **Moderno**: Tecnología 2025 (React 19, Tailwind v4, OKLCH)
3. **Profesional**: Inspirado en los mejores dashboards del mundo
4. **Performante**: Shadcn/ui = zero runtime, solo Tailwind
5. **Mantenible**: Código propio, fácil de modificar
6. **Accesible**: Radix UI = A+ accessibility
7. **Escalable**: Design system sólido

### Próximos Pasos Inmediatos

1. ✅ **Aprobar este plan**
2. ⏳ **Fase 1: Setup** (empezar hoy mismo)
3. ⏳ **Crear branch `redesign/shadcn-setup`**
4. ⏳ **Instalar Shadcn/ui**
5. ⏳ **Primera PR: AppShell + Sidebar**

---

**Última actualización**: 2025-11-22
**Versión**: 1.0.0
**Autor**: Claude + Equipo WellProject
**Estado**: 📋 Esperando aprobación
