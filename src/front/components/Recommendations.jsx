import React from 'react';
import '../index.css';

const getRandomElementsSimple = (array, n) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    result.push(array[randomIndex]);
  }
  return result;
};

const Recommendations = ({ animes }) => {
  const randomAnimes2 = animes.length > 0 ? getRandomElementsSimple(animes, 5) : [];

  return (
    <div className="recommendations-container justify-content-center ">
      <h2 className='recomendations-title d-flex justify-content-center mb-5'>Recommendations</h2>
        <div className="recommendations-list d-flex justify-content-center ">
        {randomAnimes2.map((anime) => (
          <div key={anime.entry[0].id} className="recommendation-card">
            <img className='rounded' src={anime.entry[0].images.jpg.image_url} alt={anime.entry[0].title} />
            <h3 className="title-anime">{anime.entry[0].title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;