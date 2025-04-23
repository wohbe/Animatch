import React from "react";
import '../css/SearchBar.css';
import { Navigate, useNavigate } from "react-router-dom";
import { SearchResult } from "./SearchResult";


export const SearchResultList = ({ result }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/anime/${result.id}`);
    };

    return (
        <div className="result-list" >
            {result.map((result, id) => {
                return <SearchResult result={result} key={id} onClick={handleClick} />;
            })}
        </div>
    );
};