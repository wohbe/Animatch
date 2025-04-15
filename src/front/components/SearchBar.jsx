import React, { useEffect, useState } from "react";
import '/workspaces/spain-fs-pt-95-g1/src/css/SearchBar.css';


export const SearchBar = ({ setResult }) => {
    const [input, setInput] = useState("")

    useEffect(() => {
        // esto es un corazon, nada mas.
        if (input.trim == "" || input.length < 3) {
            setResult([]);
            return
        }

        const Timeout = setTimeout(() => {
            fetch('https://special-cod-qww9jggw4vv29jq5-3001.app.github.dev/api/anime')
                .then((response) => response.json())
                .then((json) => {
                    const search = input.toLowerCase().trim()
                    const result = json.filter((anime) =>
                        anime?.title?.toLowerCase().includes(search)
                    );
                    setResult(result);
                });

        }, 500);
        return () => clearTimeout(Timeout);

    }, [input]);

    return (
        <div className="input-wrapper">
            <input placeholder="Search your anime" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
    )
}