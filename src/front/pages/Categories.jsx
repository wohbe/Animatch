import React, { useState, useEffect } from 'react';
import MediaScroller from '../components/MediaScroller';
import NavBar from '../components/Navbar';
import ImageList from '../components/ImageList';

const Categories = () => {
    const [animes, setAnimes] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [moviesAndOvas, setMoviesAndOvas] = useState([]);
    const [genres, setGenres] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnimes();
    }, []);

    const fetchAnimes = async () => {
        try {
            const response = await fetch('https://fvlxkfz7-3001.uks1.devtunnels.ms/api/anime');
            const data = await response.json();
            const processedAnimes = data.map(anime => ({
                id: anime._id || anime.id,
                title: anime.title,
                score: anime.score,
                episodes: anime.episodes,
                airing: anime.airing,
                genres: anime.genres || [],
                image_url: anime.image_url
            }));

            setAnimes(processedAnimes);
            filterAnimes(processedAnimes);
        } catch (error) {
            console.error("Error fetching animes:", error);
        } finally {
            setLoading(false);
        }
    };

    //Filter Function 
    const filterAnimes = (animeList) => {
        // Top Rated (score > 8)
        const top = animeList.filter(anime => anime.score > 8);
        setTopRated(top);

        // Movies and OVAs (episodes < 5 and is not on air)
        const movies = animeList.filter(anime =>
            anime.episodes < 5 && !anime.airing
        );
        setMoviesAndOvas(movies);

        // Filters anime by Genre
        const genresMap = {};

        animeList.forEach(anime => {
            const isMovieOrOVA = anime.episodes < 5 && !anime.airing;

            if (!isMovieOrOVA) {
                if (anime.genres.length > 0) {
                    anime.genres.forEach(genre => {
                        if (!genresMap[genre.name]) {
                            genresMap[genre.name] = [];
                        }
                        genresMap[genre.name].push(anime);
                    });
                } else {
                    console.log(`"${anime.title}" doesn't have any genre D:`);
                }
            }
        });

        setGenres(genresMap);
    };

    return (
        <div>
            <NavBar />

            {topRated.length <= 0 && console.log("No hay animes disponibles con buena puntuación")}

            {topRated.length > 0 && (
                <div className="category-section">
                    <ImageList title={"TOP RATED"} />
                    <MediaScroller animes={topRated} />
                </div>
            )}

            {moviesAndOvas.length <= 0 && console.log("No hay Peliculas, OVAs o Especiales... https://www.youtube.com/watch?v=saGYMhApaH8 min 2:06")}

            {moviesAndOvas.length > 0 && (
                <div className="category-section">
                    <ImageList title={"MOVIES, OVAs & SPECIALS"} />
                    <MediaScroller animes={moviesAndOvas} />
                </div>
            )}

            {/* Sections by Genre */}
            {Object.keys(genres).length > 0 && (
                <div className="genres-section">
                    {Object.entries(genres).map(([genreName, genreAnimes]) => (
                        <div key={genreName} className="category-section">
                            <ImageList title={`${genreName.toUpperCase()}`} />
                            <MediaScroller animes={genreAnimes} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;
