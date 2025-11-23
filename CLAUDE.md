# CLAUDE.md - WellProjectFront

Esta documentación proporciona una guía completa para trabajar con el frontend del sistema de gestión de pozos de agua chileno.

## Resumen del Proyecto

**WellProjectFront** es una aplicación web React para la gestión y monitoreo de pozos de agua en Chile, con cumplimiento de las regulaciones de la DGA (Dirección General de Aguas). Permite a distribuidores, empresas y clientes gestionar pozos, visualizar reportes de telemetría y enviar información a la DGA según la Resolución 1238.

## Stack Tecnológico

### Core
- **React** 18.2.0 - Biblioteca UI
- **React Router** v6.23.0 - Enrutamiento SPA
- **Axios** 1.6.8 - Cliente HTTP para API

### UI & Styling
- **Material-UI** (@mui/material) 5.15.16 - Componentes base
- **Tailwind CSS** 3.4.3 - Utilidades de estilo
- **@material-tailwind/react** 2.1.9 - Componentes híbridos
- **@emotion/react** & **@emotion/styled** - CSS-in-JS para MUI

### Íconos
- **@mui/icons-material** 5.15.16
- **@fortawesome** (react, solid icons)
- **@heroicons/react** 2.1.3
- **react-icons** 5.1.0

### Formularios & Estado
- **react-hook-form** 7.51.3 - Gestión de formularios
- **react-cookie** 7.1.4 - Autenticación (JWT en cookies)

### Utilidades
- **file-saver** 2.0.5 - Descargas de archivos
- **jszip** 3.10.1 - Compresión ZIP
- **xlsx** 0.18.5 - Exportación/importación Excel

## 🎨 Epic de Rediseño Frontend - IMPORTANTE

### Objetivo
Rediseño completo del frontend para lograr una experiencia de usuario **hermosa, robusta y moderna**.

### Filosofía de Diseño
- **Hermoso & Profesional**: Experiencia visual impactante, limpia, minimalista y profesional
- **Componentes Modernos**: Material-UI como base para componentes profesionales y limpios
- **Más Allá de la Excelencia**: Magic UI para patrones avanzados y experiencias excepcionales
- **Lo Mejor de Todos los Mundos**: Combinar Tailwind CSS (utilidades), Material-UI (componentes) y Magic UI (interacciones/animaciones)

### Principios Clave
1. **Minimalista & Limpio**: Eliminar desorden visual, usar espacios en blanco efectivamente
2. **Profesional**: Apariencia corporativa confiable
3. **Moderno**: Tendencias contemporáneas (animaciones suaves, micro-interacciones, glass morphism)
4. **Hermoso**: Cada componente debe ser visualmente atractivo
5. **Consistente**: Diseño consistente en todas las vistas
6. **Accesible**: Cumplimiento WCAG y excelente usabilidad

### Estrategia de Implementación
- Priorizar UX y atractivo visual en cada decisión
- Usar Material-UI como foundation
- Mejorar con utilidades Tailwind para control preciso
- Añadir Magic UI para animaciones y elementos interactivos avanzados
- Diseño responsive para todos los tamaños de pantalla
- Implementar transiciones suaves y micro-interacciones
- Usar paleta de colores y sistema tipográfico cohesivo

## Estructura del Proyecto

```
WellProjectFront/
├── public/                    # Assets estáticos
├── src/
│   ├── assets/               # Imágenes (webp: logo, img2-8, instagramQR)
│   ├── components/           # Componentes reutilizables
│   │   ├── cards/           # IconCard, ActionAreaCard
│   │   ├── layout/          # Componentes de layout (vacío, pendiente)
│   │   ├── ui/              # Componentes UI (vacío, pendiente)
│   │   ├── Alerts.js        # Wrapper de MUI Alert
│   │   ├── DatePicker.js    # Selector de fecha
│   │   ├── Footer.js        # Pie de página del sitio
│   │   ├── Icon.js          # Mapeo de íconos MUI
│   │   ├── input.js         # Input con validación (react-hook-form)
│   │   ├── landingPageNavbar.js  # Navbar de landing page
│   │   ├── navbar.js        # Navegación principal
│   │   ├── PageTitle.js     # Componente de título de página
│   │   ├── PasswordDialog.js # Modal de confirmación de contraseña
│   │   ├── PrivateRoute.js  # HOC para rutas protegidas por rol
│   │   ├── select.js        # Select dropdown
│   │   ├── companyForm.js   # Formulario de empresa
│   │   ├── distributorForm.js # Formulario de distribuidora
│   │   ├── userForm.js      # Formulario de cliente/usuario
│   │   └── wellForm.js      # Formulario de pozo
│   ├── context/
│   │   └── AuthContext.js   # Contexto de autenticación global
│   ├── hooks/               # Custom hooks
│   │   ├── useLoading.js    # Estado de carga con ícono animado
│   │   ├── useError.js      # Gestión de errores
│   │   ├── useSuccess.js    # Gestión de mensajes de éxito
│   │   ├── usePagination.js # Paginación basada en URL
│   │   ├── useAdminStatus.js      # Verificación de rol admin
│   │   ├── useCompanyStatus.js    # Verificación de rol company
│   │   └── useDistributorStatus.js # Verificación de rol distributor
│   ├── services/            # Capa de servicios API
│   │   ├── index.js        # Cliente Axios base
│   │   ├── clientServices.js      # CRUD de clientes
│   │   ├── companyServices.js     # CRUD de empresas
│   │   ├── distributorService.js  # CRUD de distribuidoras
│   │   ├── wellServices.js        # Activación de pozos
│   │   ├── wellDataServices.js    # Envío de reportes a DGA
│   │   ├── userServices.js        # Roles de usuario
│   │   └── landingPageServices.js # Formulario de contacto
│   ├── strategies/
│   │   └── redirectionStrategy.js # Estrategia de redirección por rol
│   ├── texts/               # Textos JSON para i18n (actualmente español chileno)
│   │   ├── landingPageText.json
│   │   ├── WellsText.json
│   │   ├── components/
│   │   │   └── navbarText.json
│   │   ├── Clients/
│   │   │   └── oneClients/  # NewClientText, EditClientText, ClientDetailsText
│   │   ├── Companies/
│   │   │   └── oneCompany/  # NewCompanyText, EditCompanyText, CompanyDetailsText
│   │   ├── Distributors/
│   │   │   └── oneDistributor/ # NewDistributorText, EditDistributorText, DistributorDetailsText
│   │   └── Wells/           # NewWellText, EditWellText, WellRowText
│   ├── utils/               # Funciones de utilidad
│   │   ├── landingPageData/ # Datos de landing page (features, tech, info)
│   │   ├── routes.utils.js  # Definición centralizada de rutas API
│   │   ├── export.utils.js  # Exportación a Excel
│   │   ├── wellReport.utils.js  # Configuración de tablas de reportes
│   │   └── numberFormat.utils.js # Formateo de números
│   ├── views/               # Componentes de página
│   │   ├── Admin/           # Dashboard de administrador
│   │   ├── Clients/
│   │   │   ├── allClients/  # Lista de todos los clientes
│   │   │   ├── oneClient/   # Detalles, editar, eliminar cliente
│   │   │   └── wellClients/ # Pozos del cliente y reportes
│   │   ├── Companies/
│   │   │   ├── allCompanies/ # Lista de empresas
│   │   │   └── oneCompany/   # Detalles, editar, eliminar empresa
│   │   ├── Distributors/
│   │   │   ├── allDistributors/ # Lista de distribuidoras
│   │   │   └── oneDistributor/  # Detalles, editar, eliminar distribuidora
│   │   ├── LandingPage.js   # Página pública de marketing
│   │   ├── Login.js         # Autenticación
│   │   ├── Telemetria.js    # Vista de telemetría pública
│   │   └── View.js          # Vista genérica
│   ├── index.js             # Punto de entrada de la aplicación
│   ├── index.css            # Estilos globales + Tailwind imports
│   └── Test.js              # Componente de prueba
├── .env                      # Variables de entorno (NO commitear)
├── .env.production          # Variables de producción
├── .env.sample              # Plantilla de variables de entorno
├── package.json             # Dependencias y scripts
├── tailwind.config.js       # Configuración de Tailwind
└── README.md                # Documentación del proyecto
```

**Total**: 81+ archivos JavaScript/JSX en `src/`

## Arquitectura

### Jerarquía de Entidades

```
Distributor (Distribuidora)
    └── Company (Empresa)
        └── Client (Cliente)
            └── Well (Pozo)
                └── WellData/Report (Reporte)
```

### Sistema de Roles

**4 roles principales:**

1. **admin**: Acceso total, gestiona distribuidoras, empresas, clientes y pozos
2. **distributor**: Visualiza empresas y sus clientes
3. **company**: Gestiona clientes y pozos dentro de su empresa
4. **normal**: Usuario regular, gestiona sus propios pozos

### Autenticación

- **JWT almacenado en cookies**
- Expiración: 1 hora (frontend) / 24 horas (backend)
- Configuración de cookie: `secure: true`, `httpOnly: false`, `sameSite: 'Strict'`
- AuthContext provee: `user`, `login`, `logout`, `loading`, `loadingIcon`, `isAdmin`, `isCompany`, `isDistributor`

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. POST a `${baseURL}/users/login` con email/contraseña
3. Backend valida y retorna JWT + objeto user
4. Token guardado en cookie, user en contexto
5. Redirección basada en rol (ver `redirectionStrategy.js`):
   - **admin** → `/admin`
   - **company** → `/companies/:companyId`
   - **distributor** → `/distributors/:distributorId`
   - **normal** → `/clients/:clientId`

### Estructura de Rutas

**Públicas:**
- `/` - Landing page
- `/login` - Autenticación
- `/telemetria` - Vista pública de telemetría

**Protegidas (con PrivateRoute):**
- `/admin` - Dashboard (admin only)
- `/distributors/*` - Gestión de distribuidoras (admin)
- `/companies/*` - Gestión de empresas (admin, distributor)
- `/clients/*` - Gestión de clientes (admin, company)
- `/clients/:id/wells/*` - Gestión de pozos (admin, company, normal)
- `/clients/:clientId/wells/:code` - Reportes de pozo (todos los roles)

### Servicios API

**Configuración Base**: `src/services/index.js`
```javascript
const apiClient = axios.create({
  baseURL: baseUrl, // Desde variables de entorno
  headers: { 'Content-Type': 'application/json' }
});
```

**Servicios disponibles:**

**clientServices.js** (13 funciones):
- `getAllClients(token)` - Obtener todos los clientes
- `getClientsByCompany(token, companyId)` - Clientes de una empresa
- `getClientDetails(token)` - Detalles del usuario actual
- `getClientDetailsById(token, clientId)` - Detalles de cliente específico
- `getClientWells(token, clientId, page, size)` - Pozos del cliente (paginado)
- `getClientWell(token, clientId, wellCode)` - Pozo específico
- `getWellReports(token, clientId, wellCode, page, size, month, year)` - Reportes paginados con filtros
- `postNewClient(token, data, clientId)` - Crear/actualizar cliente
- `postNewWell(token, data, clientId, wellCode)` - Crear/actualizar pozo
- `deleteWellByCode(token, clientId, wellCode)` - Eliminar pozo
- `deleteClientById(token, clientId)` - Eliminar cliente

**companyServices.js** (5 funciones):
- `getAllCompanies(token)` - Todas las empresas
- `getCompanyDetailsById(token, companyId)` - Detalles de empresa
- `getCompaniesByDistributor(token, distributorId)` - Empresas de distribuidora
- `postNewCompany(token, data, companyId)` - Crear/actualizar empresa
- `deleteCompanyById(token, companyId)` - Eliminar empresa

**distributorService.js** (4 funciones):
- `getAllDistributors(token)` - Todas las distribuidoras
- `getDistributorDetailsById(token, distributorId)` - Detalles de distribuidora
- `postNewDistributor(token, data, distributorId)` - Crear/actualizar distribuidora
- `deleteDistributorById(token, distributorId)` - Eliminar distribuidora

**wellDataServices.js** (1 función):
- `sendReports(reports)` - Enviar reportes seleccionados a DGA

**wellServices.js** (1 función):
- `activateWell(token, wellId)` - Activar/desactivar pozo

**userServices.js**:
- `getUserRole(userId, token)` - Obtener rol de usuario
- `getAllUsersRoles(token)` - Obtener todos los roles

**landingPageServices.js**:
- `postContactRequest(data)` - Enviar formulario de contacto

### Gestión de Estado

**Patrón**: React Context + Custom Hooks (sin Redux)

**AuthContext** (`src/context/AuthContext.js`):
- Estado global de autenticación
- Provee: user, login, logout, loading, loadingIcon, isAdmin, isCompany, isDistributor

**Custom Hooks**:
- **useLoading()**: `[loading, loadingIcon, setLoading]` - Estado de carga con ícono animado
- **useError()**: `{ error, setError }` - Gestión de mensajes de error
- **useSuccess()**: `{ success, setSuccess }` - Gestión de mensajes de éxito
- **usePagination(defaultSize)**: `{ page, size, setPage, setSize }` - Paginación basada en URL params
- **useAdminStatus()**: `[isAdmin, setAdminStatus]` - Verifica rol de admin
- **useCompanyStatus()**: `[isCompany, setCompanyStatus]` - Verifica rol de empresa
- **useDistributorStatus()**: `[isDistributor, setDistributorStatus]` - Verifica rol de distribuidora

**Estado local**: `useState` para datos específicos de componente

### Componentes Clave

**Diseño Atómico (Atomic Design-inspired)**:

**Átomos**:
- `input.js` - Campo de entrada con validación
- `select.js` - Dropdown select
- `Alerts.js` - Wrapper de MUI Alert
- `Icon.js` - Mapeo de íconos
- `PageTitle.js` - Título de página
- `DatePicker.js` - Selector de fecha

**Moléculas**:
- `cards/IconCard.js` - Card con ícono
- `cards/ActionAreaCard.js` - Card clickeable
- `PasswordDialog.js` - Modal de confirmación de contraseña

**Organismos**:
- `navbar.js` - Navegación principal (con menú de usuario, logout)
- `landingPageNavbar.js` - Navegación de landing page
- `Footer.js` - Pie de página
- `userForm.js` - Formulario de cliente (con react-hook-form)
- `companyForm.js` - Formulario de empresa
- `distributorForm.js` - Formulario de distribuidora
- `wellForm.js` - Formulario de pozo

**Páginas** (Todas en `src/views/`):
- `LandingPage.js` - Marketing público, hero, features, contacto
- `Login.js` - Autenticación
- `Admin/Admin.js` - Dashboard de administrador
- Vistas CRUD para Distributors, Companies, Clients, Wells

### Validación de Formularios

**react-hook-form**: Todos los formularios principales

**Ejemplo de uso**:
```javascript
const { register, handleSubmit, formErrors } = useForm();

<Input
  name="Email"
  label="email"
  register={register}
  validation={{
    required: "Email es requerido",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email inválido"
    }
  }}
  errors={formErrors}
/>
```

**Validaciones específicas**:
- **Email**: Formato de email válido
- **Teléfono chileno**: Formato +56 9 XXXX XXXX
- **RUT chileno**: Formato XX.XXX.XXX-X o XXXXXXXX-X
- **Contraseña**: Mínimo 8 caracteres

## Configuración

### Variables de Entorno

**Archivo**: `.env` (ver `.env.sample` como plantilla)

**Conexión API**:
```bash
REACT_APP_API_PORT=3000
REACT_APP_API_HOST=localhost
REACT_APP_API_PROTOCOL=http
NODE_ENV=development
```

**URLs Generadas**:
- **Development**: `http://localhost:3000/`
- **Production**: `https://promedicionbackend.com/`

**Endpoints API** (todos configurables vía env vars):
- Auth: `users/login`, `users/register`
- Users: `users`, `users/data`, `users/role`, `users/roles`
- Clients: `users`, `clients`
- Companies: `companies`
- Distributors: `distributors`
- Wells: `wells`, `wells/create`
- WellData: `welldata`, `repostAllReportsToDGA`

**Variables especiales**:
```bash
REACT_APP_DELETE_PASSWORD=    # Contraseña para operaciones críticas
REACT_APP_RUT_BASE=           # RUT por defecto para pozos
```

### Tailwind CSS

**Archivo**: `tailwind.config.js`

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'ping': 'ping 2s infinite',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,  // Estilos base de Tailwind habilitados
  },
}
```

**Estilos Globales** (`src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-custom {
  background-image: url('./assets/img/img2.webp');
  background-position: center;
  background-size: cover;
}
```

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo (http://localhost:3000)
npm start

# Build de producción
npm run build

# Ejecutar tests
npm test

# Eject de Create React App (NO RECOMENDADO)
npm run eject
```

## Deployment

**Plataforma**: AWS S3 + CloudFront

**Proceso**:
```bash
# 1. Build de producción
npm run build

# 2. Sincronizar con S3
aws s3 sync build/ s3://YOUR-BUCKET --delete

# 3. Invalidar caché de CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_CLOUDFRONT_ID \
  --paths "/*"
```

**URL de Producción**: https://promedicionbackend.com/

## Flujos Principales

### Flujo de Envío de Reportes

1. Dispositivo IoT/sensor envía datos al backend
2. Backend almacena como registros WellData
3. Frontend muestra reportes en tabla paginada
4. Admin/Company puede seleccionar reportes
5. Botón "Enviar a DGA" ejecuta `sendReports()`
6. Backend procesa y envía a DGA chilena
7. Servicio SENDER (Rails cron job) maneja envíos automáticos
8. Estado de reporte actualizado a `sent: true`

### Flujo de Creación de Pozo

1. Usuario navega a `/clients/:id/wells/new`
2. WellForm se carga
3. Usuario llena: nombre, ubicación, código, RUTs, contraseña
4. Si `rutEmpresa` está vacío, se llena automáticamente desde `REACT_APP_RUT_BASE`
5. Submit ejecuta `postNewWell()`
6. Backend valida y crea pozo
7. Redirección a `/clients/:id/wells`

### Flujo de Login

1. Usuario ingresa credenciales en `/login`
2. POST a `${baseURL}/users/login` con email/password
3. Backend valida, retorna JWT + user object
4. Token guardado en cookie, user en contexto
5. Hooks de rol determinan permisos de usuario
6. `redirectionStrategy.js` determina página de destino según rol

## Convenciones de Código

### Organización de Archivos
- **Componentes**: PascalCase (`UserForm.js`, `IconCard.js`)
- **Hooks**: camelCase con prefijo `use` (`useLoading.js`)
- **Servicios**: camelCase con sufijo `Services` (`clientServices.js`)
- **Utilidades**: camelCase con sufijo `.utils` (`routes.utils.js`)
- **Textos**: PascalCase con sufijo `Text.json` (`NewClientText.json`)

### Internacionalización (i18n)
- **Todo el texto visible debe estar en archivos JSON** en `src/texts/`
- **Idioma actual**: Español chileno
- **Listo para multi-idioma**: Solo duplicar JSONs para otros idiomas

**Ejemplo de uso**:
```javascript
import NewClientText from '../texts/Clients/oneClients/NewClientText.json'

<h2>{NewClientText.titles.principalTitle}</h2>
<p>{NewClientText.descriptions.principalDescription}</p>
```

### Estilos
- **Preferir Tailwind** para layouts, spacing, colors
- **Usar MUI** para componentes complejos (tablas, modals, buttons)
- **Emotion** solo para estilos específicos de MUI
- **Evitar CSS inline** excepto para casos muy específicos

## Estado Actual y Oportunidades

### Fortalezas
- ✅ Estructura bien organizada y modular
- ✅ Separación clara de responsabilidades
- ✅ Sistema de roles robusto
- ✅ Listo para internacionalización
- ✅ Servicios API bien estructurados
- ✅ Validación completa de formularios
- ✅ Paginación implementada
- ✅ Exportación a Excel

### Áreas de Mejora (Rediseño)
- 🎨 **UI rudimentaria**: Diseño básico, necesita modernización completa
- 🎨 **Dashboard de admin**: Muy básico, requiere rediseño mayor
- 🎨 **Vistas de lista**: Tablas HTML planas, necesitan componentes modernos
- 🎨 **Animaciones**: Limitadas, agregar micro-interacciones
- 🎨 **Sin dark mode**: Implementar tema oscuro
- 🎨 **Inconsistencia visual**: Tres sistemas CSS mezclados
- 🎨 **Formularios**: Funcionales pero no atractivos visualmente
- 🎨 **Landing page**: Bien diseñada, pero páginas internas deben alcanzar mismo nivel

### Directorios Vacíos (Oportunidad)
- `src/lib/` - Listo para lógica de biblioteca
- `src/components/ui/` - Listo para componentes UI atómicos
- `src/components/layout/` - Listo para componentes de layout

## Testing

**Configuración**:
- Jest + React Testing Library
- Archivos: `setupTests.js`, `reportWebVitals.js`
- **Estado**: Cobertura mínima (oportunidad de mejora)

## Compatibilidad de Navegadores

**Target** (desde package.json):

**Producción**:
- `>0.2%` market share
- Not dead browsers
- Not Opera Mini

**Desarrollo**:
- Last Chrome version
- Last Firefox version
- Last Safari version

## Performance

**Optimizaciones actuales**:
- ✅ Paginación para datasets grandes
- ✅ web-vitals monitoring
- ✅ Imágenes en formato webp

**Oportunidades**:
- React.lazy() para code splitting
- Lazy loading de imágenes
- Memoización (React.memo, useMemo)
- Virtual scrolling para tablas grandes

## Recursos Adicionales

### Documentación Externa
- [React 18 Docs](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)
- [react-hook-form](https://react-hook-form.com/)

### Repositorio
- GitHub: https://github.com/Emiliax16/WellProject
- Rama principal: `master`

### Contacto del Sistema
- Landing page incluye formulario de contacto
- WhatsApp floating button
- Instagram QR en footer

---

**Última actualización**: 2025-11-22
**Versión**: 1.0.0
**Autor**: Equipo WellProject
**Estado**: ✅ Producción (rediseño en progreso)
