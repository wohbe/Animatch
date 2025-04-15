import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch("https://miniature-space-telegram-x5vqjw9w7v643vxqj-3001.app.github.dev/api/anime"); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnimes(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []); 

  if (loading) {
    return <div>Cargando animes...</div>;
  }

  if (error) {
    return <div>Error al cargar los animes: {error.message}</div>;
  }

  return (
    <div className="anime-grid-container">
      {animes.map((anime) => (
        <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="anime-link"> 
          <div className="anime-card">
            <img src={anime.image_url} alt={anime.title} className="anime-image" />
            <h3 className="anime-title">{anime.title}</h3>
            {anime.score && <p className="anime-score">Puntuación: {anime.score}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;