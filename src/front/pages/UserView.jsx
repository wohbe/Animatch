import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";
import UserInfo from "../components/UserInfo";
import MediaScroller from "../components/MediaScroller";
import ImageList from "../components/ImageList";

const Userview = () => {
    const { user, token } = useContext(UserContext);
    const navigate = useNavigate();
    const [animeStatus, setAnimeStatus] = useState({});
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!user || !token) {
            navigate('/categories');
            return;
        }

        const fetchData = async () => {
            try {
                // Obtener todos los animes
                const animeResponse = await fetch(`${baseURL}/api/anime`);
                const animeData = await animeResponse.json();
                setAnimes(animeData);

                // Obtener estados de anime
                const statusResponse = await fetch(`${baseURL}/api/anime/status/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAnimeStatus(await statusResponse.json());

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token, navigate, baseURL]);

    const handleStatusUpdate = async () => {
        if (!user || !token) return;
        const res = await fetch(`${baseURL}/api/anime/status/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setAnimeStatus(await res.json());
    };

    if (loading) {
        return <div className="loading-screen">Cargando...</div>;
    }

    // Filtrar animes basados en el estado
    const favorites = animes.filter(anime => animeStatus[anime.id]?.isFavorite);
    const watching = animes.filter(anime => animeStatus[anime.id]?.isWatching);

    return (
        <div className="user-view-container">
            <UserInfo />

            <div className="user-lists">
                {/* Favorites */}
                <div className="list-section">
                    <ImageList title={`FAVORITES`} />
                    {favorites.length > 0 ? (
                        <MediaScroller
                            animes={favorites}
                            animeStatus={animeStatus}
                            onUpdate={handleStatusUpdate}
                        />
                    ) : (
                        <p className="empty-list-message">No tienes animes en favoritos</p>
                    )}
                </div>

                {/* Watching */}
                <div className="list-section">
                    <ImageList title={`WATCHING`} />
                    {watching.length > 0 ? (
                        <MediaScroller
                            animes={watching}
                            animeStatus={animeStatus}
                            onUpdate={handleStatusUpdate}
                        />
                    ) : (
                        <p className="empty-list-message">No estás viendo ningún anime actualmente</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Userview;