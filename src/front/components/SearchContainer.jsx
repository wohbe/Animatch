import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchResultList } from "./SearchResultList";
import '/workspaces/spain-fs-pt-95-g1/src/front/css/SearchBar.css';

const SearchContainer = () => {
    const [result, setResult] = useState([]);
    const clearResults = () => {
        setResult([]);
    };
    return (
        <div className="search-wrapper">
            <SearchBar setResult={setResult} searchResultsList={result} />
            {result.length > 0 && <SearchResultList result={result} clearResults={clearResults} />}
        </div>
    )
}

export default SearchContainer;