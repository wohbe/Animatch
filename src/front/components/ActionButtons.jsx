import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const ActionButtons = ({ anime, isFavorite, getAnimeState, handleFavorite, handleWatching }) => {
    const { isLogged } = useContext(UserContext);
    const currentState = getAnimeState(anime);

    const handleFavoriteClick = () => {
        if (!isLogged) {
            // Puedes mostrar un modal o redireccionar al login aquí
            alert('Por favor inicia sesión para guardar favoritos');
            return;
        }
        handleFavorite(anime);
    };

    const handleWatchingClick = () => {
        if (!isLogged) {
            alert('Por favor inicia sesión para agregar a tu lista');
            return;
        }
        handleWatching(anime);
    };

    return (
        <div className="button-overlay">
            {/* Botón de Favoritos */}
            <button
                id="favoritos"
                className={`boton ${isFavorite ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
            </button>

            {/* Botón de Viendo */}
            <button
                id="viendo"
                className={`boton ${currentState === 'watching' ? 'active' : ''}`}
                onClick={handleWatchingClick}
                aria-label={currentState === 'watching' ? "Dejar de ver" : "Agregar a 'viendo'"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                </svg>
            </button>

        </div>
    );
};

export default ActionButtons;