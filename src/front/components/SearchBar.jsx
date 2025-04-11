import React, { useState } from "react";
import '/workspaces/spain-fs-pt-95-g1/src/css/SearchBar.css';


export const SearchBar = ({ setResult }) => {
    const [input, setInput] = useState("")

    const fetchData = (value) => {
        fetch('https://special-cod-qww9jggw4vv29jq5-3001.app.github.dev/api/anime').then((response) => response.json()).then((json) => {
            const result = json.filter((anime) => {
                return value && anime && anime.title && anime.title.toLowerCase().includes(value.toLowerCase());
            });
            setResult(result);
        });

    }

    const handleChanges = (value) => {
        setInput(value)
        fetchData(value)

    }

    return (
        <div className="input-wrapper">
            <input placeholder="Search your anime" value={input} onChange={(e) => handleChanges(e.target.value)} />
        </div>
    )
}