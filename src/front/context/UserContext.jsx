import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !token) {
            setToken(storedToken);
        }
    }, []);

    const verifyToken = async (storedToken) => {
        try {
            const response = await fetch(`${baseURL}/api/protected`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });

            if (!response.ok) {
                throw new Error('Token inválido');
            }

            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
            return true;

        } catch (error) {
            logout();
            return false;
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) return;

            try {
                const response = await fetch(`${baseURL}/api/protected`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken.trim()}`  // Eliminates blank spaces
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const userData = await response.json();
                setUser(userData);

            } catch (error) {
                console.error("Error verificando token:", error.message);
                logout();
            }
        };
        verifyToken();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </UserContext.Provider>
    );
};