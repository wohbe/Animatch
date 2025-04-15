import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import AnimeCard from './AnimeCard';
import Recommendations from './Recommendations';
import '../index.css';

const AnimeCardContainer = () => {
  const { animeId } = useParams(); 
  console.log("AnimeCardContainer tiene animeId:", animeId);
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  if (loading) {
    return <div className="text-center mt-5">Cargando detalles del anime...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  if (!animeDetails) {
    return <div className="text-center mt-5">No se encontraron detalles del anime.</div>;
  }

  return (
    <div className='anime-all-card'>
      <AnimeCard /> 
      {<Recommendations genres={animeDetails.genres} />} {/* Pasa los géneros al Recommendations */}
    </div>
  );
};

export default AnimeCardContainer;