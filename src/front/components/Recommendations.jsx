import React, { useState, useEffect } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

const Recommendations = ({ genres }) => {
  const [recommendedAnimes, setRecommendedAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGenreRecommendations = async () => {
      if (!genres || genres.length === 0) {
        setLoading(false);
        return;
      }

      const genreNames = genres.map(genre => genre.name);

      try {
        const response = await fetch(`https://miniature-space-telegram-x5vqjw9w7v643vxqj-3001.app.github.dev/api/anime/recommendations/genres`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ genres: genreNames }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendedAnimes(data.recommendations);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGenreRecommendations();
  }, [genres, navigate]);

  const goToAnimeDetails = (animeId) =>{
    navigate(`/anime/${animeId}`)
  };

  if (loading) {
    return <div className="recommendations-container justify-content-center mt-5">Cargando recomendaciones por género...</div>;
  }

  if (error) {
    return <div className="recommendations-container justify-content-center mt-5 text-danger">Error al cargar recomendaciones: {error}</div>;
  }

  return (
    <div className="recommendations-container justify-content-center ">
      <h2 className='recomendations-title d-flex justify-content-center '>Recommendations Based on Genres</h2>
      <div className="recommendations-list d-flex justify-content-center ">
        {recommendedAnimes.map((anime) => (
          <div key={anime.mal_id} className="recommendation-card" onClick={() => goToAnimeDetails(anime.mal_id)}
          style={{cursor: 'pointer'}}>
            <img className='rounded' src={anime.image_url} alt={anime.title} />
            <h3 className="title-anime">{anime.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;