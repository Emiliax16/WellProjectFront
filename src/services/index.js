import axios from 'axios';
import { baseUrl, clientBack } from '../utils/routes.utils';

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Qué hacer cuando la sesión venció. Lo registra el AuthProvider, que es quien
// sabe cerrar la sesión; acá no hay acceso al contexto de React.
let alVencerSesion = null;

// Varias peticiones pueden recibir 401 a la vez (una vista que carga varias
// cosas): se comparte una sola verificación por token, con un tiempo máximo
// para que nunca quede esperando.
const verificacionesEnCurso = new Map();
const LIMITE_VERIFICACION_MS = 5000;

const sesionVencida = (autorizacion) => {
    if (!verificacionesEnCurso.has(autorizacion)) {
        const verificacion = apiClient
            .get(clientBack.getDetails, {
                headers: { Authorization: autorizacion },
                verificandoSesion: true,
                timeout: LIMITE_VERIFICACION_MS,
            })
            .then(() => false, (error) => error.response?.status === 401)
            .finally(() => verificacionesEnCurso.delete(autorizacion));
        verificacionesEnCurso.set(autorizacion, verificacion);
    }
    return verificacionesEnCurso.get(autorizacion);
};

export const registrarSesionVencida = (accion) => {
    alVencerSesion = accion;
    return () => {
        if (alVencerSesion === accion) alVencerSesion = null;
    };
};

// El backend responde 401 tanto si la sesión venció como si una sesión válida
// pide algo que no le corresponde. Cerrar la sesión ante cualquier 401 sacaría
// a usuarios legítimos, así que antes se verifica la sesión con
// `GET /users/data`: solo si esa consulta también da 401, la sesión venció.
// Si la verificación falla por red o por un 5xx, no se cierra la sesión.
//
// Un `Bearer undefined` (la cookie de 1 h ya expiró pero la vista sigue
// abierta) también se verifica y termina cerrando la sesión, que es lo
// esperado.
apiClient.interceptors.response.use(
    (respuesta) => respuesta,
    async (error) => {
        const config = error.config || {};
        const autorizacion = config.headers?.Authorization;
        if (error.response?.status === 401 && alVencerSesion && autorizacion && !config.verificandoSesion) {
            if (await sesionVencida(autorizacion)) {
                error.sesionVencida = true;
                alVencerSesion?.();
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
