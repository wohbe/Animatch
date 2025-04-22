import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/FinalProject.css'; // Tus estilos personalizados
import { RouterProvider } from "react-router-dom";
import { router } from './routes'; // Tu ruta personalizada
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { UserContextProvider } from './context/UserContext';
import NavBar from './components/Navbar';

const Main = () => {
    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <UserContextProvider>
                <StoreProvider>
                    <RouterProvider router={router} />
                </StoreProvider>
            </UserContextProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);

