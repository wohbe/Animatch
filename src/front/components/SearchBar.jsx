import React, { useState } from "react";
import '/workspaces/spain-fs-pt-95-g1/src/css/SearchBar.css';
import { useNavigate } from "react-router-dom";


export const SearchBar = ({ setResult, searchResultsList }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [input, setInput] = useState("")
    const navigate = useNavigate();

    const fetchData = (value) => {
        fetch(`${API_URL}/api/anime`).then((response) => response.json()).then((json) => {
            const result = json.filter((anime) => {
                return value && anime && anime.title && anime.title.toLowerCase().includes(value.toLowerCase());
            });
            setResult(result);
        });

    }

    const handleChanges = (value) => {
        setInput(value);
        fetchData(value);

    }

    const handleSubmit = (value) => {
        value.preventDefault();
        navigate(`/anime/${searchResultsList[0].id}`);
    }

    return (
        <form className="d-flex ms-lg-auto position-relative" role="search" onSubmit={handleSubmit}>
            <input
                className="form-control me-2 rounded-pill ps-5"
                id="buscar"
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar"
                value={input}
                onChange={(e) => handleChanges(e.target.value)}
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


    )
}