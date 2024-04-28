
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { createContext, useContext, useState, useEffect } from 'react';
import {getClientDetails} from '../services/clientServices';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const baseURL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/`;

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
    }, [baseURL, cookies.token]);


    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseURL}${process.env.REACT_APP_API_ENDPOINT_AUTH_LOGIN}`, {
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
                console.log(user)
            }
            console.log(user)
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

    const value = { user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
