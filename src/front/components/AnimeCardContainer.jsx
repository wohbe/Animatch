import React, { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import Recommendations from './Recommendations';
import '../index.css';
const AnimeCardContainer = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/recommendations/anime");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnimes(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando animes...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div>
      <AnimeCard />
      <Recommendations animes={animes} />
    </div>
  );
};

export default AnimeCardContainer;