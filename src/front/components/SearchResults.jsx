import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div>
      <SearchBar/>
      <h2>Resultados de la búsqueda</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((anime) => (
            <li key={anime.id}>{anime.title}</li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default SearchResults;