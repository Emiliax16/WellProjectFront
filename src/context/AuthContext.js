
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { createContext, useContext, useState, useEffect } from 'react';
import {getClientDetails} from '../services/clientServices';
import { baseUrl, auth } from '../utils/routes.utils';
import useLoading from '../hooks/useLoading';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, loadingIcon, setLoading] = useLoading();
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const baseURL = baseUrl;

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (cookies.token) {
                try {
                    setLoading(true);
                    const response = await getClientDetails(cookies.token);
                    setUser(response);
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
                finally {
                    setLoading(false);
                }
            }
        };
        fetchUserDetails();
    }, [baseURL, cookies.token, setLoading]);


    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseURL}${auth.login}`, {
                email,
                password
            });
            const { token, user } = response.data;
            if (token) {
                setCookie('token', token, {
                    path: '/',
                    expires: new Date(Date.now() + 604800000), // 7 ddias
                    secure: true, 
                    httpOnly: false,  // por ahora false, cuando estemos en https cambiar a true
                    sameSite: 'Strict'
                  });
                setUser(user);
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeCookie('token', { path: '/' });
        setUser(null);
    };

    const value = { user, login, logout, loading, loadingIcon };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
