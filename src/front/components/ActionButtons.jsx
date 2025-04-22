import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const ActionButtons = ({ anime, initialStatus, onUpdate = { isFavorite: false, isWatching: false } }) => {
    const { user, token } = useContext(UserContext);
    const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const [localIsFavorite, setLocalIsFavorite] = useState(initialStatus.isFavorite);
    const [localIsWatching, setLocalIsWatching] = useState(initialStatus.isWatching);
    const [isLoading, setIsLoading] = useState({
        favorite: false,
        watching: false
    });

    const handleFavorite = async () => {
        if (!user || !token) {
            alert("Por favor inicia sesión primero");
            return;
        }

        setIsLoading(prev => ({ ...prev, favorite: true }));

        try {
            const method = localIsFavorite ? 'DELETE' : 'POST';
            const response = await fetch(`${baseURL}/api/favorites/${anime.id}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.trim()}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar favoritos");
            }

            setLocalIsFavorite(!localIsFavorite);
            alert(localIsFavorite ? "✗ Eliminado de Favoritos" : "✓ Añadido a Favoritos");
            onUpdate?.();

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(prev => ({ ...prev, favorite: false }));
        }
    };

    const handleWatching = async () => {
        if (!user || !token) {
            alert("Por favor inicia sesión primero");
            return;
        }

        setIsLoading(prev => ({ ...prev, watching: true }));

        try {
            const method = localIsWatching ? 'DELETE' : 'POST';
            const response = await fetch(`${baseURL}/api/watching/${anime.id}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.trim()}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar lista");
            }

            setLocalIsWatching(!localIsWatching);
            alert(localIsWatching ? "✗ Eliminado de 'Viendo'" : "✓ Añadido a 'Viendo'");
            onUpdate?.();

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(prev => ({ ...prev, watching: false }));
        }
    };

    return (
        <div className="button-overlay">
            {/* Botón de Favoritos */}
            <button
                className={`boton ${localIsFavorite ? 'active' : ''}`}
                onClick={handleFavorite}
                disabled={isLoading.favorite}
                aria-label={localIsFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
                <svg viewBox="0 0 24 24" fill={localIsFavorite ? "#ff6f61" : "none"} stroke="#ffffff">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {isLoading.favorite && <span className="loading-spinner"></span>}
            </button>

            {/* Botón de Watching */}
            <button
                className={`boton ${localIsWatching ? 'active' : ''}`}
                onClick={handleWatching}
                disabled={isLoading.watching}
                aria-label={localIsWatching ? "Dejar de ver" : "Marcar como viendo"}
            >
                <svg viewBox="0 0 24 24" fill={localIsWatching ? "#ff6f61" : "white"}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
                {isLoading.watching && <span className="loading-spinner"></span>}
            </button>
        </div>
    );
};

export default ActionButtons;