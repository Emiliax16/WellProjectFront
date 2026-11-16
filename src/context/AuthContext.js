
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {getClientDetails} from '../services/clientServices';
import { getUserRole } from '../services/userServices';
import { getRedirectionPath } from '../strategies/redirectionStrategy';
import { registrarSesionVencida } from '../services';
import { baseUrl, auth } from '../utils/routes.utils';
import useLoading from '../hooks/useLoading';
import useAdminStatus from '../hooks/useAdminStatus';
import useCompanyStatus from '../hooks/useCompanyStatus';
import useDistributorStatus from '../hooks/useDistributorStatus';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, loadingIcon, setLoading] = useLoading();
    const [isAdmin, setAdminStatus] = useAdminStatus();
    const [isCompany, setCompanyStatus] = useCompanyStatus();
    const [isDistributor, setDistributorStatus] = useDistributorStatus();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    // Si al cargar la página hay una cookie, la sesión se está restaurando.
    // Mientras tanto `PrivateRoute` debe esperar: antes evaluaba con el usuario
    // todavía en null y mandaba al inicio a quien recargaba una página protegida.
    const [restaurandoSesion, setRestaurandoSesion] = useState(() => Boolean(cookies.token));
    const baseURL = baseUrl;
    // Token que `login()` ya dejó resuelto (perfil y rol). Cuando su cookie se
    // guarda, el efecto de abajo no lo vuelve a cargar: esa recarga desmontaba
    // y volvía a montar la página de destino y, si fallaba, cerraba la sesión
    // recién abierta.
    const tokenResuelto = useRef(null);
    // Token de la restauración en curso; se limpia al cerrar sesión o al iniciar
    // una nueva, para descartar resultados de una carga anterior.
    const cargaVigente = useRef(null);
    
    const fetchUserDetails = useCallback(async () => {
        if (!cookies.token || cookies.token === tokenResuelto.current) {
            setRestaurandoSesion(false);
            return;
        }
        // Si mientras carga se cierra la sesión o se abre otra, este resultado
        // ya no corresponde y no debe repoblar el usuario ni los roles.
        const tokenDeEstaCarga = cookies.token;
        cargaVigente.current = tokenDeEstaCarga;
        const sigueVigente = () => cargaVigente.current === tokenDeEstaCarga;
        try {
            setLoading(true);
            const response = await getClientDetails(tokenDeEstaCarga);
            if (!sigueVigente()) return;
            // Los roles se esperan antes de terminar la carga: si no, por un
            // instante el usuario quedaba sin rol y `PrivateRoute` lo sacaba.
            const rol = response ? await getUserRole(response.id, tokenDeEstaCarga) : null;
            if (!sigueVigente()) return;
            await Promise.all([
                setAdminStatus(response, tokenDeEstaCarga, rol),
                setCompanyStatus(response, tokenDeEstaCarga, rol),
                setDistributorStatus(response, tokenDeEstaCarga, rol),
            ]);
            setUser(response);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        } finally {
            setLoading(false);
            setRestaurandoSesion(false);
        }
    }, [cookies.token, setAdminStatus, setCompanyStatus, setLoading, setDistributorStatus]);
    
    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    // Si una llamada a la API detecta que la sesión venció (por ejemplo, el
    // usuario fue desactivado), se cierra la sesión y se vuelve al login.
    const cerrarSesionVencida = useRef(null);
    cerrarSesionVencida.current = () => {
        tokenResuelto.current = null;
        logout();
        // El aviso viaja en la URL porque la recarga borra el estado de la
        // vista que recibió el error.
        if (window.location.pathname !== '/login') {
            window.location.assign('/login?sesion=vencida');
        }
    };
    useEffect(() => registrarSesionVencida(() => cerrarSesionVencida.current()), []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseURL}${auth.login}`, {
                email,
                password
            });
            const { token } = response.data;
            cargaVigente.current = null;
            if (!token) {
                throw new Error('El servidor no entregó una sesión.');
            }

            // La respuesta del login no trae el perfil (`client`, `company`,
            // `distributor`). Se piden el perfil y el rol con el token nuevo antes
            // de guardar la cookie: así la redirección no depende de una segunda
            // carga, no hay una carrera con el efecto que reacciona a la cookie, y
            // si algo falla no queda una sesión a medias.
            const detalles = await getClientDetails(token);
            if (!detalles) {
                throw new Error('No se pudo cargar tu perfil. Intenta de nuevo.');
            }
            // Una sola consulta de rol; si falla, el error llega al formulario en
            // vez de confundirse con "no tiene perfil".
            const rol = await getUserRole(detalles.id, token);
            const [isAdminNuevo, isCompanyNuevo, isDistributorNuevo] = await Promise.all([
                setAdminStatus(detalles, token, rol),
                setCompanyStatus(detalles, token, rol),
                setDistributorStatus(detalles, token, rol),
            ]);
            // Una cuenta sin perfil no tiene adónde ir: se rechaza antes de
            // guardar la cookie, para no dejar una sesión a medias.
            if (getRedirectionPath(isAdminNuevo, isCompanyNuevo, isDistributorNuevo, detalles) === '/login') {
                throw new Error('Tu cuenta no tiene un perfil asociado. Contacta al administrador.');
            }
            setUser(detalles);
            tokenResuelto.current = token;
            setCookie('token', token, {
                path: '/',
                expires: new Date(Date.now() + 3600000),
                // `secure` solo bajo HTTPS: en http://localhost, Safari descarta
                // las cookies seguras y el login nunca se completaba.
                secure: window.location.protocol === 'https:',
                sameSite: 'Strict'
            });
            return {
                user: detalles,
                isAdmin: isAdminNuevo,
                isCompany: isCompanyNuevo,
                isDistributor: isDistributorNuevo,
            };
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        cargaVigente.current = null;
        removeCookie('token', { path: '/' });
        setUser(null);
        setAdminStatus(null);
        setCompanyStatus(null);
        setDistributorStatus(null);
    };

    const value = { user, login, logout, loading: loading || restaurandoSesion, loadingIcon, isAdmin, isCompany, isDistributor };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
