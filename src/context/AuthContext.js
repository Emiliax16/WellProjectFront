
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {getClientDetails} from '../services/clientServices';
import { baseUrl, auth } from '../utils/routes.utils';
import useLoading from '../hooks/useLoading';
import useAdminStatus from '../hooks/useAdminStatus';
import useCompanyStatus from '../hooks/useCompanyStatus';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, loadingIcon, setLoading] = useLoading();
    const [isAdmin, setAdminStatus] = useAdminStatus();
    const [isCompany, setCompanyStatus] = useCompanyStatus();
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
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [cookies.token, setAdminStatus, setCompanyStatus, setLoading]);
    
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
            const { token, user } = response.data;
            if (cookies.token) {
                removeCookie('token', { path: '/' });
            }

            if (token) {
                setCookie('token', token, {
                    path: '/',
                    expires: new Date(Date.now() + 3600000), 
                    secure: true, 
                    httpOnly: false,  // por ahora false, cuando estemos en https cambiar a true
                    sameSite: 'Strict'
                  });
                setUser(user);
                setAdminStatus(user);
                setCompanyStatus(user);
            }
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
    };

    const value = { user, login, logout, loading, loadingIcon, isAdmin, isCompany };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
