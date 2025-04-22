import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    return (
        <UserContext.Provider value={{user, setUser, isLogged, setIsLogged, token, setToken}}> {/* Forma abreviada para objetos con mismo nombre que variable*/}
                {children}
        </UserContext.Provider>
    );
};