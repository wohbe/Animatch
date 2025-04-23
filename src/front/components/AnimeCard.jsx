import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Recommendations from './Recommendations';
import { UserContext } from '../context/UserContext';

function AnimeCard() {
    const { id } = useParams();
    const [animeDetails, setAnimeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const { isLogged, token } = useContext(UserContext);
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchUserPreferences = useCallback(async () => {
        if (!isLogged || !token) {
            setIsFavorite(false);
            setIsWatching(false);
            return;
        }

        console.log(`[AnimeCard ID: ${id}] fetchUserPreferences: Iniciando llamada a /api/anime/status/${id}`);

        try {
            const response = await fetch(`${API_URL}api/anime/status/${id}`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log(`[AnimeCard ID: ${id}] fetchUserPreferences: Respuesta status ${response.status}`);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(`[AnimeCard ID: ${id}] fetchUserPreferences: Datos recibidos:`, data);
                    setIsFavorite(!!data.isFavorite); 
                    setIsWatching(!!data.isWatching); 
                } else {
                    
                    const bodyText = await response.text();
                    console.error(`[AnimeCard ID: ${id}] fetchUserPreferences: Error - Respuesta OK pero no es JSON (${contentType}). Cuerpo:`, bodyText);
                    setIsFavorite(false); 
                    setIsWatching(false);
                }
            } else {
                 const errorText = await response.clone().text(); 
                 console.error(`[AnimeCard ID: ${id}] fetchUserPreferences: Error - Status ${response.status}. Cuerpo:`, errorText);
                 setIsFavorite(false);
                 setIsWatching(false);
            }
        } catch (err) {
            console.error(`[AnimeCard ID: ${id}] fetchUserPreferences: Error en catch:`, err);
            setIsFavorite(false);
            setIsWatching(false);
        }
        console.log(`[AnimeCard ID: ${id}] fetchUserPreferences: FIN`);
    }, [id, isLogged, token, API_URL]); 

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            setLoading(true);
            setError(null);
            setAnimeDetails(null);

            try {
                const response = await fetch(`${API_URL}api/anime/${id}`);
                if (!response.ok) {
                    let errorMsg = `HTTP error! status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg += ` - ${errorData?.message || 'No se pudo leer el mensaje de error JSON'}`;
                    } catch (jsonError) {
                        errorMsg += ` - ${await response.text()}`;
                    }
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                setAnimeDetails(data);

                if (isLogged) {
                    await fetchUserPreferences();
                } else {
                    setIsFavorite(false);
                    setIsWatching(false);
                }

            } catch (e) {
                console.error(`[AnimeCard ID: ${id}] fetchAnimeDetails: Error en catch:`, e);
                setError(e.message || 'Ocurrió un error desconocido');
                setIsFavorite(false); 
                setIsWatching(false);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeDetails();
    }, [id, isLogged, API_URL, fetchUserPreferences]); 

    const handleApiUpdate = async (endpoint, currentStatus, stateSetter, token) => {
        const previousStatus = currentStatus;
        stateSetter(!previousStatus);
        try {
            const response = await fetch(endpoint, {
                method: previousStatus ? 'DELETE' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                stateSetter(previousStatus); 
                const errorData = await response.json().catch(() => ({ message: `Error ${response.status}, sin cuerpo JSON.` }));
                throw new Error(`Fallo al actualizar: ${response.status} - ${errorData?.message || response.statusText}`);
            }
            
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error);
            alert(`Error al actualizar el estado: ${error.message}`);
            stateSetter(previousStatus); 
    };
}
    const handleFavoriteClick = () => {
        if (!isLogged || !token) return alert("Debes estar logueado para añadir a favoritos.");
        handleApiUpdate(`${API_URL}api/favorites/${id}`, isFavorite, setIsFavorite, token);
    };

    const handleWatchingClick = () => {
        if (!isLogged || !token) return alert("Debes estar logueado para añadir a tu lista de viendo.");
         handleApiUpdate(`${API_URL}api/watching/${id}`, isWatching, setIsWatching, token);
    };

    const handleTrailerClick = () => {
        if (animeDetails?.trailer?.url) {
             window.open(animeDetails.trailer.url, '_blank');
        }
    };

   
    if (loading) {
        return <div className="container text-center p-5">Cargando detalles del anime...</div>;
    }
    if (error) {
        return <div className="container alert alert-danger">Error al cargar los detalles del anime: {error}</div>;
    }
    if (!animeDetails) {
        return <div className="container text-center p-5">No se encontraron detalles para este anime.</div>;
    }

    return (
        <div className='container'>
             <div className="anime-card ">
                <div className='container-image'>
                    <img
                        src={animeDetails.image_url}
                        alt={animeDetails.title}
                        id='imagen_anime'
                        className="cover-image w-auto"
                    />
                    {isLogged && (
                         <div className='buttons-card'>
                            <button
                                type="button"
                                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                                onClick={handleFavoriteClick}
                                title={isFavorite ? 'Eliminar de favoritos' : 'Añadir a Favoritos'}
                            >
                                <i className={`fa-solid fa-heart ${isFavorite ? 'text-danger' : ''}`}></i>
                            </button>
                            <button
                                type="button"
                                className={`watching-button ${isWatching ? 'active' : ''}`}
                                onClick={handleWatchingClick}
                                title={isWatching ? 'Dejar de ver' : 'Marcar como viendo'}
                            >
                                <i className={`fa-solid ${isWatching ? 'fa-eye-slash' : 'fa-eye'}`}
                                   style={{ color: isWatching ? 'purple' : '' }}></i>
                            </button>
                            {animeDetails?.trailer?.url && (
                                <button
                                    type="button"
                                    className="trailer-button"
                                    onClick={handleTrailerClick}
                                    title='Ver Trailer'
                                >
                                    <i className="fa-solid fa-clapperboard"></i>
                                </button>
                            )}
                        </div>
                    )}
                    <br />
                </div>

                <div className='card-body px-3'>
                    <h1>{animeDetails.title}</h1>
                    <p className="synopsis">{animeDetails.synopsis || "Sin sinopsis disponible."}</p>
                    <div className="anime-details-info">
                        <ul className="anime-details-list">
                            <li className="genres-list-item">
                                <strong>Género: </strong>
                                {animeDetails.genres?.length > 0
                                    ? animeDetails.genres.map((genre, index) => (
                                        <span key={genre.id || genre.name} className="genre">
                                            {genre.name}{index < animeDetails.genres.length - 1 ? ', ' : ''}
                                        </span>
                                    ))
                                    : 'No especificado'}
                            </li>
                            <li className="estado-list-item">
                                <strong>Estado:</strong> {animeDetails.airing ? 'En emisión' : 'Finalizado'}
                            </li>
                            <li className="puntuacion-list-item">
                                <strong>Puntuación:</strong> {animeDetails.score ?? 'N/A'}
                            </li>
                            <li className="episodios-list-item">
                                <strong>Episodios:</strong> {animeDetails.episodes ?? 'N/A'}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {animeDetails.genres && animeDetails.genres.length > 0 && (
                <Recommendations genres={animeDetails.genres} currentAnimeId={parseInt(id, 10)} />
            )}
        </div>
    );
}


export default AnimeCard;