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
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      console.log('Eliminado de favoritos:', anime.title);
    } else {
      console.log('Añadido a favoritos:', anime.title);
    }
  };

  const handleWatchLaterClick = () => {
    setIsWatchLater(!isWatchLater);
    if (isWatchLater) {
      console.log('Eliminado de ver más tarde:', anime.title);
    } else {
      console.log('Añadido a ver más tarde:', anime.title);
    }
  };

  const handleWatchedClick = () => {
    setIsWatched(!isWatched);
    if (isWatched) {
      console.log('Marcado como no visto:', anime.title);
    } else {
      console.log('Marcado como visto:', anime.title);
    }
  };

  return (
    <div className='container'>
      <div className="anime-card d-flex m-2">
        <img src={anime.coverImage} alt={anime.title} className="cover-image" />
        <div className='card-body px-3'>
          <h1>{anime.title}</h1>
          <p>{anime.synopsis}</p>
          <div className="genres">Genre:&nbsp;
    {anime.genres.map((genre, index) => (
        <span key={genre} className="genre">
            {genre}{index < anime.genres.length - 1 ? ', ' : ''}
        </span>
    ))}
</div>
          <p>Estado: {anime.status}</p>
          <p>Puntuación: {anime.score}</p>
          <p>Episodios: {anime.episodes}</p>
          <p>Temporadas: {anime.seasons}</p>
          <p>Fecha de inicio: {anime.startDate}</p>
          <p>Fecha de fin: {anime.endDate}</p>
          <p>Estudio: {anime.studio}</p>
          <p>Director: {anime.director}</p>


          <div className="anime-buttons d-flex justify-content-around">
            <button
              className="favorite-button btn btn-primary"
              onClick={handleFavoriteClick}
            >
              {isFavorite ? 'Quitar de favoritos' : 'Favoritos'}
            </button>
            <button
              className="watch-later-button btn btn-primary"
              onClick={handleWatchLaterClick}
            >
              {isWatchLater ? 'Quitar de ver más tarde' : 'Ver más tarde'}
            </button>
            <label className="watched-button btn btn-primary">
            <input
              type="checkbox"
              checked={isWatched}
              onChange={handleWatchedClick}
             />Visto
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;