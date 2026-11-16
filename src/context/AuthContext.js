
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {getClientDetails} from '../services/clientServices';
import { getUserRole } from '../services/userServices';
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
    const baseURL = baseUrl;
    
    const fetchUserDetails = useCallback(async () => {
        if (cookies.token) {
            try {
                setLoading(true);
                const response = await getClientDetails(cookies.token);
                setUser(response);
                setAdminStatus(response);
                setCompanyStatus(response);
                setDistributorStatus(response);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [cookies.token, setAdminStatus, setCompanyStatus, setLoading, setDistributorStatus]);
    
    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseURL}${auth.login}`, {
                email,
                password
            });
            const { token } = response.data;
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
            setUser(detalles);
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
        removeCookie('token', { path: '/' });
        setUser(null);
        setAdminStatus(null);
        setCompanyStatus(null);
        setDistributorStatus(null);
    };

    const value = { user, login, logout, loading, loadingIcon, isAdmin, isCompany, isDistributor };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
