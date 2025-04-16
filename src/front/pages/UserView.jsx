import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import UserInfo from "../components/UserInfo";
import MediaScroller from "../components/MediaScroller";
import ImageList from "../components/ImageList";

const Userview = () => {
    const [animeStates, setAnimeStates] = useState({});
    const [animes, setAnimes] = useState([]);

    useEffect(() => {

        const savedStates = localStorage.getItem('animeStates');
        if (savedStates) setAnimeStates(JSON.parse(savedStates));

        const savedAnimes = localStorage.getItem('allAnimes');
        if (savedAnimes) setAnimes(JSON.parse(savedAnimes));
    }, []);

    // Filter by State
    const favorites = Object.values(animeStates)
        .filter(state => state.isFavorite)
        .map(state => state.animeData);

    const watching = Object.values(animeStates)
        .filter(state => state.status === 'watching')
        .map(state => state.animeData);

    return (
        <div className="user-view-container">
            <NavBar />
            <UserInfo />

            <div className="user-lists">
                {/* Favorites */}
                <div className="list-section">
                    <ImageList title={`FAVORITES`} />
                    {favorites.length > 0 ? (
                        <MediaScroller animes={favorites} />
                    ) : (
                        <p className="empty-list-message">No tienes animes en favoritos</p>
                    )}
                </div>

                {/* Watching */}
                <div className="list-section">
                    <ImageList title={`WATCHING`} />
                    {watching.length > 0 ? (
                        <MediaScroller animes={watching} />
                    ) : (
                        <p className="empty-list-message">No estás viendo ningún anime actualmente</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Userview;
