import React, { useState, useEffect, useContext } from 'react';
import MediaScroller from '../components/MediaScroller';
import NavBar from '../components/Navbar';
import ImageList from '../components/ImageList';
import { UserContext } from '../context/UserContext';

const Categories = () => {
    const { user, token } = useContext(UserContext);
    const baseURL = import.meta.env.VITE_BACKEND_URL;
    const [animes, setAnimes] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [moviesAndOvas, setMoviesAndOvas] = useState([]);
    const [genres, setGenres] = useState({});
    const [loading, setLoading] = useState(true);
    const [animeStatus, setAnimeStatus] = useState({});

    // Carga todos los datos necesarios
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const animeResponse = await fetch(`${baseURL}/api/anime`);
                if (!animeResponse.ok) throw new Error('Error al cargar animes');
                const animeData = await animeResponse.json();

                filterAnimes(animeData);

                if (user && token) {
                    const statusResponse = await fetch(`${baseURL}/api/anime/status/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setAnimeStatus(await statusResponse.json());
                }

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user, token, baseURL]);

    const filterAnimes = (animeList) => {
        const top = animeList.filter(anime => anime.score > 8);
        setTopRated(top);

        const movies = animeList.filter(anime => anime.episodes < 5 && !anime.airing);
        setMoviesAndOvas(movies);

        const genresMap = {};
        animeList.forEach(anime => {
            if (!(anime.episodes < 5 && !anime.airing)) {
                anime.genres?.forEach(genre => {
                    genresMap[genre.name] = [...(genresMap[genre.name] || []), anime];
                });
            }
        });
        setGenres(genresMap);
    };

    const handleStatusUpdate = async () => {
        if (!user || !token) return;
        const res = await fetch(`${baseURL}/api/anime/status/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setAnimeStatus(await res.json());
    };

    if (loading) return;

    return (
        <div>
            <NavBar />

            {topRated.length > 0 && (
                <div className="category-section">
                    <ImageList title={"TOP RATED"} />
                    <MediaScroller
                        animes={topRated}
                        animeStatus={animeStatus}
                        onUpdate={handleStatusUpdate}
                    />
                </div>
            )}

            {moviesAndOvas.length > 0 && (
                <div className="category-section">
                    <ImageList title={"MOVIES, OVAs & SPECIALS"} />
                    <MediaScroller
                        animes={moviesAndOvas}
                        animeStatus={animeStatus}
                        onUpdate={handleStatusUpdate}
                    />
                </div>
            )}

            {Object.keys(genres).length > 0 && (
                <div className="genres-section">
                    {Object.entries(genres).map(([genreName, genreAnimes]) => (
                        <div key={genreName} className="category-section">
                            <ImageList title={`${genreName.toUpperCase()}`} />
                            <MediaScroller
                                animes={genreAnimes}
                                animeStatus={animeStatus}
                                onUpdate={handleStatusUpdate}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;