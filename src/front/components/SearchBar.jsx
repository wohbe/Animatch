import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchInputRef.current?.value;

    if (!query?.trim()) {
      navigate('/search-results?q=', { state: { results: [] } });
      return;
    }

    fetch(`/api/anime/search?q=${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        navigate(`/search-results?q=${query}`, { state: { results: data.results } });
      })
      .catch(error => {
        console.error('Error en la búsqueda:', error);
      });
  };

  return (
    <form className="d-flex ms-lg-auto position-relative" role="search" onSubmit={handleSearch}>
      <input
        className="form-control me-2 rounded-pill ps-5"
        id="buscar"
        type="search"
        placeholder="Buscar..."
        aria-label="Buscar"
        ref={searchInputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="btn btn-outline-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
        title="Buscar"
        type="submit"
        style={{ border: 'none', background: 'none' }}
      >
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
};

export default SearchBar;