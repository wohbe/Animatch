import React, { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchResultList } from "../components/SearchResultList";

export const SearchPage = () => {
    const [result, setResult] = useState([]);
    return (
        <div>
            <SearchBar setResult={setResult} />
            <SearchResultList result={result} />
        </div>
    )
}