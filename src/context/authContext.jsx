import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedToken = Cookies.get('auth_token');
        const savedUser = Cookies.get('auth_user');

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
    }, [token]);

    const login = (token, userData) => {
        Cookies.set('auth_token', token, { expires: 7 });
        Cookies.set('auth_user', JSON.stringify(userData), { expires: 7 });
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove('auth_token');
        Cookies.remove('auth_user');
        setToken(null);
        setUser(null);
    };



    return (
        <AuthContext.Provider value={{ token, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
