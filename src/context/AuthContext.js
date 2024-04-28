
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const baseURL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/`;

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (cookies.token) {
                try {
                    console.log(`${baseURL}${process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO}`);
                    const response = await axios.get(`${baseURL}${process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO}`, {
                        headers: { Authorization: `Bearer ${cookies.token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [baseURL, cookies.token]);


    const login = async (email, password) => {
        try {
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
        }
    };

    const logout = () => {
        removeCookie('token', { path: '/' });
        setUser(null);
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
