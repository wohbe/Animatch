import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchResultList } from "./SearchResultList";
import '/workspaces/spain-fs-pt-95-g1/src/css/SearchBar.css';

export const SearchContainer = () => {
    const [result, setResult] = useState([]);

    return (
        <div className="search-wrapper">
            <SearchBar setResult={setResult} />
            {result.length > 0 && <SearchResultList result={result} />}

        </div>
    )
}