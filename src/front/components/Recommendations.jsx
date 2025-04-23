import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaScroller from './MediaScroller';
import ImageList from './ImageList';

const Recommendations = ({ genres, currentAnimeId }) => {
    const [recommendedAnimes, setRecommendedAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenreRecommendations = async () => {
            if (!genres || genres.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/anime/${currentAnimeId}/recommendations/genres`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecommendedAnimes(data.recommendations);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchGenreRecommendations();
    }, [genres, currentAnimeId, navigate]);

    const goToAnimeDetails = (animeId) =>{
        navigate(`/anime/${animeId}`);
    };

    if (loading) {
        return <div className="recommendations-container justify-content-center mt-5">Cargando recomendaciones por género...</div>;
    }

    if (error) {
        return <div className="recommendations-container justify-content-center mt-5 text-danger">Error al cargar recomendaciones: {error}</div>;
    }

    return (
        <div className="">
            <ImageList title={`RECOMENDATIONS BASED ON GENRES`} />
            <MediaScroller 
                animes={recommendedAnimes} 
                animeStatus={{}} 
                onUpdate={() => {}} 
            />
        </div>
    );
};


export default Recommendations;