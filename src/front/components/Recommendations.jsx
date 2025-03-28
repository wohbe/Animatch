import React, { useState, useEffect } from 'react';

const getRandomElementsSimple = (array, n) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    result.push(array[randomIndex]);
  }
  return result;
};

const Recommendations = () => {
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

  const randomAnimes1 = animes.length > 10 ? getRandomElementsSimple(animes, 5) : [];
  const randomAnimes2 = animes.length > 0 ? getRandomElementsSimple(animes, 5) : [];

  return (
    <div className="recommendations-container flex-box">
      <h2>Recommendations</h2>
      <div className="recommendations-list">
        {randomAnimes1.map((anime) => (
          <div key={anime.entry[0].mal_id} className="recommendation-card">
            <img src={anime.entry[0].images.jpg.image_url} alt={anime.entry[0].title} />
            <h3 className="title-anime">{anime.entry[0].title}</h3>
          </div>
        ))}
      </div>
            <div className="recommendations-list">
        {randomAnimes2.map((anime) => (
          <div key={anime.entry[0].mal_id} className="recommendation-card">
            <img src={anime.entry[0].images.jpg.image_url} alt={anime.entry[0].title} />
            <h3 className="title-anime">{anime.entry[0].title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;