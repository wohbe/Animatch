import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/SearchBar.css';

export const SearchResult = ({ result }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/anime/${result.id}`);
    };

    return (
        <div className="search-result" onClick={handleClick}>
            {result.title}
        </div>
    );
};
