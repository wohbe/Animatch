import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ¡Añade esta línea!
import GenreRecommendations from './GenreRecommendations';
import '../index.css';

function AnimeCard() {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // TODO: Implementar lógica real de favoritos
  const [isWatching, setIsWatching] = useState(false); // TODO: Implementar lógica real de viendo

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);
      setAnimeDetails(null);

      try {
        const response = await fetch(`https://miniature-space-telegram-x5vqjw9w7v643vxqj-3001.app.github.dev/api/anime/${animeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status} - ${errorData?.message || 'Error al cargar los detalles del anime'}`);
        }
        const data = await response.json();
        setAnimeDetails(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // lógica para añadir/eliminar de favoritos en el backend
    if (isFavorite) {
      console.log('Eliminado de favoritos:', animeDetails?.title);
    } else {
      console.log('Añadido a favoritos:', animeDetails?.title);
    }
  };

  const handleWatchingClick = () => {
    setIsWatching(!isWatching);
    // lógica para añadir/eliminar de viendo en el backend
    if (isWatching) {
      console.log('Eliminado de ver más tarde:', animeDetails?.title);
    } else {
      console.log('Añadido a ver más tarde:', animeDetails?.title);
    }
  };

  const handleTrailerClick = () => {
    
    const trailerUrl = animeDetails?.trailer?.url || 'https://www.youtube.com/watch?v=K9Gnl0VeIVI';
    window.open(trailerUrl, '_blank');
  };

  if (loading) {
    return <div>Cargando detalles del anime...</div>;
  }

  if (error) {
    return <div>Error al cargar los detalles del anime: {error.message}</div>;
  }

  if (!animeDetails) {
    return <div>No se encontraron detalles para este anime.</div>;
  }

  return (
    <div className='container'>
      <div className="anime-card d-flex m-2 ">
        <div className='container-image w-100 '>
          <img src={animeDetails.image_url} alt={animeDetails.title} className="cover-image w-auto" />

          <button className={`favorite-button ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick} title={isFavorite ? 'Eliminar de favoritos' : 'Añadir a Favoritos'} >
            <i className={`fa-solid fa-heart ${isFavorite ? 'text-danger' : ''}`}></i>
          </button>

          <button
            className={`watching-button ${isWatching ? 'active' : ''} `} onClick={handleWatchingClick}
            title={isWatching ? 'Dejar de ver' : 'Añadir a viendo'} >
            <i className={`fa-solid ${isWatching ? 'fa-eye-slash' : 'fa-eye'}`}
              style={{ color: isWatching ? 'purple' : '' }}></i>
          </button>
          {console.log("URL del tráiler:", animeDetails?.trailer?.url)}
          {animeDetails?.trailer?.url && (
            <button className="trailer-button" onClick={handleTrailerClick} title='Trailer'>
              <i className="fa-solid fa-clapperboard"></i>
            </button>
          )}
        </div>

        <div className='card-body px-3'>
          <h1>{animeDetails.title}</h1>
          <p>{animeDetails.synopsis}</p><br />
          <div className="genres">Género:
            {animeDetails.genres && animeDetails.genres.map((genre) => (
              <span key={genre.id} className="genre">
                {genre.name}{animeDetails.genres.indexOf(genre) < animeDetails.genres.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div><br />
          <p>Estado: {animeDetails.airing ? 'En emisión' : 'Finalizado'}</p>
          <p>Puntuación: {animeDetails.score}</p>
          <p>Episodios: {animeDetails.episodes}</p>
       
        </div>
      </div>
      

    </div>
  );
}

export default AnimeCard;