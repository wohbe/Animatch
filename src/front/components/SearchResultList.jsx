import React from "react";
import '/workspaces/spain-fs-pt-95-g1/src/css/SearchBar.css';
import { SearchResult } from "./SearchResults";

export const SearchResultList = ({ result }) => {

    return (
        <div className="result-list">
            {result.map((result, id) => {
                return <SearchResult result={result} key={id} />;
            })}
        </div>
    );

};