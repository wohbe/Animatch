import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
	return (
		<section>
			<div className="NavBar">
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<Link className="navbar-brand order-lg-0" to="#">
							<img src="/src/front/assets/img/logo.jpg" width="30" height="30" className="d-inline-block align-top" alt="" />
						</Link>
						<Link className="navbar-brand Home order-lg-0" to="/">Animatch</Link>
						<button
							className="navbar-toggler order-lg-2"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarNavAltMarkup"
							aria-controls="navbarNavAltMarkup"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse order-lg-1" id="navbarNavAltMarkup">
							<div className="navbar-nav me-auto">
								<Link className="nav-link active News" aria-current="page" to="#">New</Link>
								<Link className="nav-link active Popular" aria-current="page" to="#">Popular</Link>
								<Link className="nav-link active Categories" aria-current="page" to="#">Categories</Link>
								<Link className="nav-link active Match" to="#">Match <i className="fa-regular fa-heart"></i></Link>
								<Link className="nav-link active Profile" to="#">Profile</Link>
							</div>
							<SearchBar/>
						</div>
					</div>
					<div className="d-flex align-items-center order-lg-3 ms-2">
						<Link
							className="user-menu rounded " title="Login/register"
							to="/profile"
							aria-label="Ir al perfil"
						>
							<i className="fa fa-user-circle"></i>
						</Link>
					</div>
				</nav>
			</div>
		</section>
	);
};

export default Navbar;


/* import React, { useState, useRef } from 'react';
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

export default SearchResults; */