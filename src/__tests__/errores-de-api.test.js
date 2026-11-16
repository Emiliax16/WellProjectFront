// errores-de-api.test.js
//
// Issue #44: los errores se mostraban tal como los entrega axios ("Request
// failed with status code 401"), sin distinguir una sesión vencida de un envío
// fallido, y varios formularios reventaban ante un error de red. Además, con la
// revalidación de sesión del backend (WellProject#103), un usuario desactivado
// recibe 401 en todo, y el portal debe cerrar su sesión.

import apiClient, { registrarSesionVencida } from '../services';
import {
  mensajeDeError,
  MENSAJE_SESION_VENCIDA,
  MENSAJE_SIN_CONEXION,
  MENSAJE_DEMASIADOS_INTENTOS,
  MENSAJE_ERROR_SERVIDOR,
} from '../utils/apiErrors';

const errorHttp = (status, data) => ({ isAxiosError: true, message: `Request failed with status code ${status}`, response: { status, data } });

describe('mensajeDeError', () => {
  it('usa el mensaje del backend en un error 4xx', () => {
    expect(mensajeDeError(errorHttp(400, { error: 'El cliente indicado no es válido.' }))).toBe('El cliente indicado no es válido.');
  });

  it('une la lista de errores de validación', () => {
    expect(mensajeDeError(errorHttp(400, { errors: ['Email ya existe', 'Nombre vacío'] }))).toBe('Email ya existe, Nombre vacío');
  });

  it('acepta el campo message que usan el monitoreo y las estadísticas', () => {
    expect(mensajeDeError(errorHttp(500, { message: 'Error al obtener estadísticas globales' }))).toBe('Error al obtener estadísticas globales');
  });

  it('indica la sesión vencida cuando el interceptor la detectó', () => {
    expect(mensajeDeError({ ...errorHttp(401, { error: 'Recurso no autorizado.' }), sesionVencida: true })).toBe(MENSAJE_SESION_VENCIDA);
  });

  it('distingue un error de red, sin respuesta del servidor', () => {
    expect(mensajeDeError({ isAxiosError: true, message: 'Network Error' })).toBe(MENSAJE_SIN_CONEXION);
  });

  it('traduce el 429 de Nginx, que responde HTML', () => {
    expect(mensajeDeError(errorHttp(429, '<html>429 Too Many Requests</html>'))).toBe(MENSAJE_DEMASIADOS_INTENTOS);
  });

  it('usa un texto genérico en un 5xx sin mensaje', () => {
    expect(mensajeDeError(errorHttp(502, '<html>Bad Gateway</html>'))).toBe(MENSAJE_ERROR_SERVIDOR);
  });

  it('usa el texto por defecto en un 4xx sin mensaje', () => {
    expect(mensajeDeError(errorHttp(404, '<html>'), 'Error eliminando los reportes.')).toBe('Error eliminando los reportes.');
  });

  it('respeta los errores propios de la vista', () => {
    expect(mensajeDeError(new Error('No hay reportes pendientes.'))).toBe('No hay reportes pendientes.');
  });

  it('nunca muestra el mensaje crudo de axios', () => {
    for (const status of [400, 401, 403, 404, 429, 500]) {
      expect(mensajeDeError(errorHttp(status, undefined))).not.toMatch(/Request failed/);
    }
  });
});

describe('interceptor de 401', () => {
  const adaptadorOriginal = apiClient.defaults.adapter;
  let respuestas;
  let llamadas;
  let alVencer;
  let desregistrar;

  // Simula el servidor: cada URL responde con el status configurado.
  beforeEach(() => {
    llamadas = [];
    respuestas = {};
    apiClient.defaults.adapter = async (config) => {
      llamadas.push(config.url);
      const status = respuestas[config.url] ?? 200;
      const respuesta = { status, data: status === 200 ? { ok: true } : { error: 'Recurso no autorizado.' }, headers: {}, config };
      if (status >= 400) {
        const error = new Error(`Request failed with status code ${status}`);
        Object.assign(error, { isAxiosError: true, config, response: respuesta });
        throw error;
      }
      return respuesta;
    };
    alVencer = jest.fn();
    desregistrar = registrarSesionVencida(alVencer);
  });

  afterEach(() => {
    desregistrar();
    apiClient.defaults.adapter = adaptadorOriginal;
  });

  const pedir = (url) => apiClient.get(url, { headers: { Authorization: 'Bearer token' } }).catch((e) => e);

  it('cierra la sesión si la verificación también responde 401', async () => {
    respuestas = { companies: 401, [process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO]: 401 };

    const error = await pedir('companies');

    expect(alVencer).toHaveBeenCalledTimes(1);
    expect(error.sesionVencida).toBe(true);
    expect(mensajeDeError(error)).toBe(MENSAJE_SESION_VENCIDA);
  });

  it('no cierra la sesión si el 401 era por falta de permisos', async () => {
    // La sesión es válida: la verificación responde 200.
    respuestas = { 'companies/99': 401 };

    const error = await pedir('companies/99');

    expect(alVencer).not.toHaveBeenCalled();
    expect(error.sesionVencida).toBeUndefined();
    expect(mensajeDeError(error)).toBe('Recurso no autorizado.');
  });

  it('no verifica la sesión ante otros errores', async () => {
    respuestas = { wells: 500 };

    await pedir('wells');

    expect(llamadas).toEqual(['wells']);
    expect(alVencer).not.toHaveBeenCalled();
  });

  it('no verifica la sesión en peticiones sin token', async () => {
    respuestas = { publica: 401 };

    await apiClient.get('publica').catch(() => {});

    expect(llamadas).toEqual(['publica']);
  });
});
