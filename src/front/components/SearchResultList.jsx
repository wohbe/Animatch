import React from "react";
import '../css/SearchBar.css';
import { Navigate, useNavigate } from "react-router-dom";
import { SearchResult } from "./SearchResult";


export const SearchResultList = ({ result, clearResults }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/anime/${result.id}`);
    };

    return (
        <div className="result-list" >
            {result.map((resItem) => {
                return <SearchResult result={resItem} key={resItem.id || resItem.title} clearResults={clearResults} onClick={handleClick} />;
            })}
        </div>
    );
};