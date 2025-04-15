import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';

function AnimeCard() {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [isWatching, setIsWatching] = useState(false); 
  const [likes, setLikes] = useState(0); 
  const [hasLiked, setHasLiked] = useState(false); 

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

  const handleLikeClick = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      // Integrar con el backend para registrar el like del usuario
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
      // Integrar con el backend para eliminar el like del usuario
    }
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
      <div className="anime-card d-flex ">
        <div className='container-image'>
          <img src={animeDetails.image_url} alt={animeDetails.title} id='imagen_anime' className="cover-image w-auto" />
            <div className='buttons-card'>
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
          <div className="likes-container">ME GUSTA! &nbsp; 
            <button className={`like-button ${hasLiked ? 'liked' : ''}`} onClick={handleLikeClick} title={hasLiked ? 'Quitar me gusta' : 'Me gusta'}>
              <i className="fa-solid fa-thumbs-up"></i>
            </button>
            <span className="like-count">{likes}</span>
          </div>
        </div>

        <div className='card-body px-3'>
          <h1>{animeDetails.title}</h1>
          <p className="synopsis">{animeDetails.synopsis}</p>
          <div className="anime-details-info">
            <ul className="anime-details-list">
              <li className="genres-list-item">
                <strong>Género:&nbsp;</strong>
                {animeDetails.genres && animeDetails.genres.map((genre) => (
                  <span key={genre.id} className="genre">
                 {genre.name} {animeDetails.genres.indexOf(genre) < animeDetails.genres.length - 1 ?', ' : ''}
                  </span>
                ))}
              </li>
              <li className="estado-list-item">
                <strong>Estado:</strong> {animeDetails.airing ? 'En emisión' : 'Finalizado'}
              </li>
              <li className="puntuacion-list-item">
                <strong>Puntuación:</strong> {animeDetails.score !== null ? animeDetails.score : 'No disponible'}
              </li>
              <li className="episodios-list-item">
                <strong>Episodios:</strong> {animeDetails.episodes !== null ? animeDetails.episodes : 'No disponible'}
              </li>
            </ul>
          </div>
        </div>
      </div>


    </div>
  );
}

export default AnimeCard;