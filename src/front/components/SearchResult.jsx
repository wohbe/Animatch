import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/SearchBar.css';

export const SearchResult = ({ result, clearResults}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/anime/${result.id}`);
        clearResults();
    };

    return (
        <div className="search-result" onClick={handleClick}>
            {result.title}
        </div>
    );
};
