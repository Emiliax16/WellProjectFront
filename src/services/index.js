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
apiClient.interceptors.response.use(
    (respuesta) => respuesta,
    async (error) => {
        const config = error.config || {};
        const autorizacion = config.headers?.Authorization;
        if (error.response?.status === 401 && alVencerSesion && autorizacion && !config.verificandoSesion) {
            try {
                await apiClient.get(clientBack.getDetails, {
                    headers: { Authorization: autorizacion },
                    verificandoSesion: true,
                });
            } catch (errorDeVerificacion) {
                if (errorDeVerificacion.response?.status === 401) {
                    error.sesionVencida = true;
                    alVencerSesion();
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
