// Convierte un error de una llamada a la API en un mensaje que la persona que
// usa el portal pueda entender y actuar en consecuencia.
//
// Antes, las vistas mostraban `error.message` tal cual lo entrega axios
// ("Request failed with status code 401"), sin distinguir una sesión vencida de
// un envío fallido (issue #44). Y varias leían `error.response.data` sin
// comprobar que hubiera respuesta, así que un error de red reventaba el `catch`.
export const MENSAJE_SESION_VENCIDA = 'Tu sesión expiró. Vuelve a iniciar sesión.';
export const MENSAJE_SIN_CONEXION = 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
export const MENSAJE_DEMASIADOS_INTENTOS = 'Demasiados intentos. Espera unos minutos e intenta de nuevo.';
export const MENSAJE_ERROR_SERVIDOR = 'Ocurrió un error en el servidor. Intenta de nuevo en unos minutos.';

const mensajeDelBackend = (data) => {
  if (!data || typeof data !== 'object') return null;
  if (typeof data.error === 'string' && data.error) return data.error;
  if (Array.isArray(data.errors) && data.errors.length) return data.errors.join(', ');
  if (typeof data.message === 'string' && data.message) return data.message;
  return null;
};

export const mensajeDeError = (error, porDefecto = 'Ocurrió un error. Intenta de nuevo.') => {
  if (!error) return porDefecto;
  // Errores propios de la vista (validaciones locales), no de la API.
  if (!error.isAxiosError && !error.response) return error.message || porDefecto;
  if (error.sesionVencida) return MENSAJE_SESION_VENCIDA;
  if (!error.response) return MENSAJE_SIN_CONEXION;

  const { status, data } = error.response;
  if (status === 429) return mensajeDelBackend(data) || MENSAJE_DEMASIADOS_INTENTOS;
  if (status >= 500) return mensajeDelBackend(data) || MENSAJE_ERROR_SERVIDOR;
  return mensajeDelBackend(data) || porDefecto;
};
