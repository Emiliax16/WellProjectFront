// login.test.js
//
// Issue #41: tras un login correcto, el formulario podía quedarse quieto, sin
// redirigir ni mostrar error. La respuesta del login no trae el perfil del
// usuario y los hooks de rol consultaban con la cookie del render anterior, así
// que la redirección dependía de una segunda carga que podía no ocurrir (por
// ejemplo, si el navegador no guardaba la cookie). Ahora `login()` resuelve el
// perfil y el rol con el token nuevo, guarda la cookie al final y devuelve el
// resultado, y el formulario redirige con él.
//
// Cada render usa su propia instancia de cookies: la instancia por defecto de
// react-cookie es global y arrastraría la sesión de un test al siguiente.

import { useState } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../views/Login';
import { getClientDetails } from '../services/clientServices';
import { getUserRole } from '../services/userServices';

const mockNavigate = jest.fn();

jest.mock('axios');
jest.mock('../services', () => ({ __esModule: true, default: {}, registrarSesionVencida: () => () => {} }));
jest.mock('../services/clientServices', () => ({ getClientDetails: jest.fn() }));
jest.mock('../services/userServices', () => ({ getUserRole: jest.fn() }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const TOKEN_NUEVO = 'token-nuevo';

const montar = (contenido) => render(
  <CookiesProvider cookies={new Cookies()}>
    <MemoryRouter>
      <AuthProvider>{contenido}</AuthProvider>
    </MemoryRouter>
  </CookiesProvider>
);

const enviarFormulario = async () => {
  // `Input.js` no asocia la etiqueta al campo, así que se buscan por `name`.
  await userEvent.type(document.querySelector('input[name="email"]'), 'cliente@ejemplo.cl');
  await userEvent.type(document.querySelector('input[name="password"]'), 'clave-correcta');
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar' }));
};

const borrarCookie = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

beforeEach(() => {
  jest.clearAllMocks();
  borrarCookie();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  axios.post.mockResolvedValue({ data: { token: TOKEN_NUEVO, user: { id: 7, email: 'cliente@ejemplo.cl' } } });
});

afterEach(() => {
  console.error.mockRestore();
  borrarCookie();
});

describe('login() del contexto (#41)', () => {
  // Lo que distingue el arreglo: antes `login()` no devolvía nada y el
  // formulario dependía de que el estado se actualizara en otro render.
  const Consumidor = () => {
    const { login } = useAuth();
    const [resultado, setResultado] = useState(null);
    return (
      <>
        <button onClick={async () => setResultado(await login('a@b.cl', 'x'))}>entrar</button>
        <pre data-testid="resultado">{resultado ? JSON.stringify(resultado) : ''}</pre>
      </>
    );
  };

  it('devuelve el perfil y el rol resueltos con el token nuevo', async () => {
    getClientDetails.mockResolvedValue({ id: 4, company: { id: 9 } });
    getUserRole.mockResolvedValue({ type: 'company' });
    montar(<Consumidor />);

    await userEvent.click(screen.getByRole('button', { name: 'entrar' }));

    await waitFor(() => expect(screen.getByTestId('resultado').textContent).not.toBe(''));
    expect(JSON.parse(screen.getByTestId('resultado').textContent)).toEqual({
      user: { id: 4, company: { id: 9 } },
      isAdmin: false,
      isCompany: true,
      isDistributor: false,
    });
    expect(getClientDetails).toHaveBeenCalledWith(TOKEN_NUEVO);
    expect(getUserRole).toHaveBeenCalledTimes(1);
    expect(getUserRole).toHaveBeenCalledWith(4, TOKEN_NUEVO);
    expect(document.cookie).toContain(`token=${TOKEN_NUEVO}`);
  });
});

describe('aviso de sesión vencida (#44)', () => {
  it('lo muestra cuando el portal redirigió por sesión vencida', () => {
    render(
      <CookiesProvider cookies={new Cookies()}>
        <MemoryRouter initialEntries={['/login?sesion=vencida']}>
          <AuthProvider><Login /></AuthProvider>
        </MemoryRouter>
      </CookiesProvider>
    );

    expect(screen.getByText('Tu sesión expiró. Vuelve a iniciar sesión.')).toBeInTheDocument();
  });

  it('no lo muestra en un ingreso normal', () => {
    montar(<Login />);

    expect(screen.queryByText('Tu sesión expiró. Vuelve a iniciar sesión.')).not.toBeInTheDocument();
  });
});

describe('formulario de login (#41)', () => {
  it.each([
    ['un cliente a su perfil', { id: 7, client: { id: 3 } }, 'normal', '/clients/3'],
    ['un admin al panel', { id: 1 }, 'admin', '/admin'],
    ['una empresa a su página', { id: 4, company: { id: 9 } }, 'company', '/companies/9'],
    ['una distribuidora a su página', { id: 5, distributor: { id: 2 } }, 'distributor', '/distributors/2'],
  ])('redirige a %s', async (_caso, perfil, rol, ruta) => {
    getClientDetails.mockResolvedValue(perfil);
    getUserRole.mockResolvedValue({ type: rol });
    montar(<Login />);

    await enviarFormulario();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(ruta, { replace: true }));
  });

  it('consulta con el token nuevo aunque quede la cookie vencida de otra sesión', async () => {
    // La cookie vieja ya no es válida: restaurarla al montar falla y el
    // usuario queda en el formulario, que es cuando inicia sesión de nuevo.
    document.cookie = 'token=token-de-otra-persona; path=/';
    getClientDetails.mockImplementation(async (token) => (token === TOKEN_NUEVO ? { id: 7, client: { id: 3 } } : undefined));
    getUserRole.mockResolvedValue({ type: 'normal' });
    montar(<Login />);
    await act(async () => {});
    expect(mockNavigate).not.toHaveBeenCalled();
    getClientDetails.mockClear();
    getUserRole.mockClear();

    await enviarFormulario();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/clients/3', { replace: true }));
    expect(getClientDetails).toHaveBeenCalledWith(TOKEN_NUEVO);
    expect(getUserRole).toHaveBeenCalledWith(7, TOKEN_NUEVO);
    expect(getClientDetails).not.toHaveBeenCalledWith('token-de-otra-persona');
  });

  it('muestra un error si la cuenta no tiene perfil y no guarda la sesión', async () => {
    getClientDetails.mockResolvedValue({ id: 7 });
    getUserRole.mockResolvedValue({ type: 'normal' });
    montar(<Login />);

    await enviarFormulario();

    expect(await screen.findByText('Tu cuenta no tiene un perfil asociado. Contacta al administrador.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain(TOKEN_NUEVO);
  });

  it('no vuelve a cargar el perfil cuando se guarda la cookie del login', async () => {
    // Esa recarga desmontaba y volvía a montar la página de destino, y si
    // fallaba cerraba la sesión recién abierta.
    getClientDetails.mockResolvedValue({ id: 7, client: { id: 3 } });
    getUserRole.mockResolvedValue({ type: 'normal' });
    montar(<Login />);

    await enviarFormulario();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/clients/3', { replace: true }));
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });

    expect(getClientDetails).toHaveBeenCalledTimes(1);
    expect(getUserRole).toHaveBeenCalledTimes(1);
  });

  it('muestra el mensaje de la API si las credenciales son incorrectas', async () => {
    axios.post.mockRejectedValue({ response: { data: { error: 'Correo o contraseña incorrectos.' } } });
    montar(<Login />);

    await enviarFormulario();

    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('muestra un error claro y no guarda la sesión si falla la carga del perfil', async () => {
    // El servicio real captura su error y devuelve undefined.
    getClientDetails.mockResolvedValue(undefined);
    montar(<Login />);

    await enviarFormulario();

    expect(await screen.findByText('No se pudo cargar tu perfil. Intenta de nuevo.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain(TOKEN_NUEVO);
  });

  it('muestra el error real si falla la consulta del rol, no "sin perfil"', async () => {
    getClientDetails.mockResolvedValue({ id: 1 });
    getUserRole.mockRejectedValue({ message: 'Network Error' });
    montar(<Login />);

    await enviarFormulario();

    expect(await screen.findByText('Network Error')).toBeInTheDocument();
    expect(screen.queryByText(/no tiene un perfil asociado/)).not.toBeInTheDocument();
    expect(document.cookie).not.toContain(TOKEN_NUEVO);
  });

  it('deshabilita el botón mientras inicia sesión', async () => {
    let resolver;
    getClientDetails.mockReturnValue(new Promise((r) => { resolver = r; }));
    getUserRole.mockResolvedValue({ type: 'normal' });
    montar(<Login />);

    await enviarFormulario();

    const boton = await screen.findByRole('button', { name: 'Ingresando…' });
    expect(boton).toBeDisabled();
    await act(async () => resolver({ id: 7, client: { id: 3 } }));
  });
});
