import React, { useState } from 'react';
import '../index.css';

function AnimeCard() {
  const anime = {
    title: 'Chainsaw Man',
    synopsis:
      'Denji es un adolescente que vive con un demonio motosierra llamado Pochita. Para pagar la deuda que le dejó su padre tras su muerte, ha tenido que ganarse el pan como puede matando demonios y vendiendo sus cadáverse a la mafia, aunque su vida siempre ha sido miserable.',
    coverImage:
      'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-NuHM32a3VJsb.png',
    genres: ['Acción', 'Aventura', 'Fantasía'],
    status: 'En emisión',
    score: 8.5,
    episodes: 12,
    seasons: 1,
    startDate: '2023-10-26',
    endDate: 'En emisión',
    studio: 'Estudio',
    director: 'Director',
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      console.log('Eliminado de favoritos:', anime.title);
    } else {
      console.log('Añadido a favoritos:', anime.title);
    }
  };
  const handlewatchLaterClick = () => {
    setIsWatchLater(!isWatchLater);
    if (isWatchLater) {
      console.log('Eliminado de ver mas tarde:', anime.title);
    } else {
      console.log('Añadido a ver mas tarde:', anime.title);
    }
  };

  const handleWatchingClick = () => {
    setIsWatching(!isWatching);
    if (isWatching) {
      console.log('Eliminado de ver más tarde:', anime.title);
    } else {
      console.log('Añadido a ver más tarde:', anime.title);
    }
  };
  const handleFinishedClick = () => {
    setIsFinished(!isFinished);
    if (isFinished) {
      console.log('Eliminado de terminados:', anime.title);
    } else {
      console.log('Añadido a terminados:', anime.title);
    }
  };
  
  const trailerUrl = 'https://www.youtube.com/watch?v=K9Gnl0VeIVI'; 
  
  const handleTrailerClick = () => {
    window.open(trailerUrl, '_blank'); 
  };

  return (
    <div className='container'>
      <div className="anime-card d-flex m-2 ">
        <div className='container-image w-100 '>
          <img src={anime.coverImage} alt={anime.title} className="cover-image w-auto" />

          <button className= {`favorite-button ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick} title={isFavorite ? 'Eliminar de favoritos' : 'Añadir a Favoritos'} >
            <i className={`fa-solid fa-heart ${isFavorite ? 'text-danger' : ''}`}></i>
          </button>
          <button
            className={`watchLater-button ${isWatchLater ? 'active' : ''} `} onClick={handlewatchLaterClick}
            title={isWatchLater ? 'Quitar de ver mas tarde' : 'Añadir a ver mas tarde'} >
            <i className={`fa-regular ${isWatchLater ? 'fa-clock' : 'fa-clock'} ${isWatchLater ? 'text-warning' : ''}`}></i>
          </button>
          <button
            className={`watching-button ${isWatching ? 'active' : ''} `} onClick={handleWatchingClick}
            title={isWatching ? 'Dejar de ver' : 'Añadir a viendo'} >
            <i className={`fa-solid ${isWatching ? 'fa-eye-slash' : 'fa-eye'}`}
            style={{ color: isWatching ? 'purple' : '' }}></i>
          </button>
          <button
            className={`finished-button ${isFinished ? 'active' : ''} `} onClick={handleFinishedClick}
            title={isFinished ? 'Quitar de terminados' : 'Añadir a terminados'} >
            <i className={`fa-regular ${isFinished ? 'fa-check-circle' : 'fa-check-circle'} ${isFinished ? 'text-success' : ''}`}></i>
            
          </button>
          <button className="trailer-button" onClick={handleTrailerClick} title='Trailer'>
            <i className="fa-solid fa-clapperboard"></i>
          </button>
        </div>

        <div className='card-body px-3'>
          <h1>{anime.title}</h1>
          <p>{anime.synopsis}</p><br />
          <div className="genres">Género:&nbsp;
            {anime.genres.map((genre, index) => (
              <span key={genre} className="genre">
                {genre}{index < anime.genres.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div><br />
          <p>Estado: {anime.status}</p>
          <p>Puntuación: {anime.score}</p>
          <p>Episodios: {anime.episodes}</p>
          <p>Temporadas: {anime.seasons}</p>
          <p>Fecha de inicio: {anime.startDate}</p>
          <p>Fecha de fin: {anime.endDate}</p>
          <p>Estudio: {anime.studio}</p>
          <p>Director: {anime.director}</p>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;