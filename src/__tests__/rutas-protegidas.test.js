// rutas-protegidas.test.js
//
// Issue #43: la distribuidora solo ve sus empresas, no clientes ni pozos. Las
// rutas de clientes y pozos estaban abiertas a cualquier rol y el backend le
// respondía 401. Al protegerlas apareció un problema previo: al recargar una
// página protegida, `PrivateRoute` evaluaba antes de restaurar la sesión y
// mandaba al inicio. Estos tests cubren las dos cosas.

import fs from 'fs';
import path from 'path';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Cookies from 'universal-cookie';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import { getClientDetails } from '../services/clientServices';
import { getUserRole } from '../services/userServices';

jest.mock('axios');
jest.mock('../services', () => ({ __esModule: true, default: {}, registrarSesionVencida: () => () => {} }));
jest.mock('../services/clientServices', () => ({ getClientDetails: jest.fn() }));
jest.mock('../services/userServices', () => ({ getUserRole: jest.fn() }));

const ROLES_CLIENTE = ['admin', 'company', 'normal'];

const recargarEn = (ruta, roles) => {
  document.cookie = 'token=token-vigente; path=/';
  render(
    <CookiesProvider cookies={new Cookies()}>
      <MemoryRouter initialEntries={[ruta]}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<p>INICIO</p>} />
            <Route path={ruta} element={<PrivateRoute roles={roles}><p>PÁGINA PROTEGIDA</p></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </CookiesProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
});

describe('recargar una página protegida', () => {
  it('mantiene a un cliente en la página de sus pozos', async () => {
    getClientDetails.mockResolvedValue({ id: 7, client: { id: 3 } });
    getUserRole.mockResolvedValue({ type: 'normal' });

    recargarEn('/clients/3/wells', ROLES_CLIENTE);

    expect(await screen.findByText('PÁGINA PROTEGIDA')).toBeInTheDocument();
    expect(screen.queryByText('INICIO')).not.toBeInTheDocument();
  });

  it('mantiene a un admin en su panel', async () => {
    getClientDetails.mockResolvedValue({ id: 1 });
    getUserRole.mockResolvedValue({ type: 'admin' });

    recargarEn('/admin', ['admin']);

    expect(await screen.findByText('PÁGINA PROTEGIDA')).toBeInTheDocument();
  });

  it('manda al inicio si la sesión guardada ya no es válida', async () => {
    getClientDetails.mockResolvedValue(undefined);

    recargarEn('/clients/3/wells', ROLES_CLIENTE);

    expect(await screen.findByText('INICIO')).toBeInTheDocument();
  });
});

describe('distribuidora (#43)', () => {
  it('PrivateRoute le cierra una ruta con los roles de clientes y pozos', async () => {
    getClientDetails.mockResolvedValue({ id: 5, distributor: { id: 2 } });
    getUserRole.mockResolvedValue({ type: 'distributor' });

    recargarEn('/clients/3/wells', ROLES_CLIENTE);

    await waitFor(() => expect(screen.getByText('INICIO')).toBeInTheDocument());
    expect(screen.queryByText('PÁGINA PROTEGIDA')).not.toBeInTheDocument();
  });

  it('el router da a cada ruta de clientes y pozos exactamente los roles que corresponden', () => {
    // `index.js` monta la app con createRoot y no se puede importar, así que
    // se lee como texto. Se exige la lista exacta: así falla tanto si se abre a
    // la distribuidora como si se le quita el acceso a un rol legítimo.
    const fuente = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');
    const esperado = {
      '/clients/:id': "['admin', 'company', 'normal']",
      '/companies/:id/clients': "['admin', 'company']",
      '/clients/:id/wells': "['admin', 'company', 'normal']",
      '/clients/:clientId/wells/:code': "['admin', 'company', 'normal']",
    };

    for (const [ruta, roles] of Object.entries(esperado)) {
      const desde = fuente.indexOf(`path="${ruta}"`);
      expect(desde).toBeGreaterThan(-1);
      const bloque = fuente.slice(desde, fuente.indexOf('} />', desde));
      expect(bloque).toContain(`<PrivateRoute roles={${roles}}>`);
    }
  });
});

describe('cargas viejas de la sesión', () => {
  it('no repuebla el usuario si se cerró la sesión mientras cargaba', async () => {
    const { useAuth } = require('../context/AuthContext');
    let resolver;
    getClientDetails.mockReturnValue(new Promise((r) => { resolver = r; }));
    getUserRole.mockResolvedValue({ type: 'normal' });
    let auth;
    const Espia = () => { auth = useAuth(); return <p>{auth.user ? `USUARIO ${auth.user.id}` : 'SIN USUARIO'}</p>; };
    document.cookie = 'token=token-vigente; path=/';
    render(
      <CookiesProvider cookies={new Cookies()}>
        <MemoryRouter><AuthProvider><Espia /></AuthProvider></MemoryRouter>
      </CookiesProvider>
    );

    await waitFor(() => expect(getClientDetails).toHaveBeenCalled());
    await act(async () => auth.logout());
    await act(async () => resolver({ id: 7, client: { id: 3 } }));

    expect(screen.getByText('SIN USUARIO')).toBeInTheDocument();
  });
});
