import React, { useRef, useEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import { useNavigate } from 'react-router-dom';

const MediaScroller = ({ animes, animeStatus = {}, onUpdate }) => {
    const [sliderIndex, setSliderIndex] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    const handleArrowClick = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
        const totalItems = slider.children.length;
        const maxIndex = Math.ceil(totalItems / itemsPerScreen) - 1;

        setSliderIndex(prev => {
            const newIndex = direction === 'left' ? Math.max(0, prev - 1) : Math.min(maxIndex, prev + 1);
            slider.style.setProperty('--slider-index', newIndex);
            setShowLeftArrow(newIndex > 0);
            setShowRightArrow(newIndex < maxIndex);
            return newIndex;
        });
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || !animes.length) return;

        const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
        const maxIndex = Math.ceil(animes.length / itemsPerScreen) - 1;
        setShowLeftArrow(sliderIndex > 0);
        setShowRightArrow(sliderIndex < maxIndex);
    }, [sliderIndex, animes]);

    const goToAnimeDetails = (animeId) => {
        navigate(`/anime/${animeId}`);
    };

    return (
        <div className="scroller-container">
            <div className="slider-container">
                {showLeftArrow && (
                    <button className="arrow left-arrow" onClick={() => handleArrowClick('left')}>
                        <svg><use href="#previous"></use></svg>
                    </button>
                )}

                <div className="slider" ref={sliderRef}>
                    {animes.map((anime) => (
                        <div key={anime.id} className="slide-item">
                            <div className="image-container">
                                <div
                                    onClick={() => goToAnimeDetails(anime.id)}
                                >
                                    <img
                                        src={anime.image_url || 'https://via.placeholder.com/300x400?text=Imagen+no+disponible'}
                                        alt={`Portada de ${anime.title}`}
                                        className="slide-image"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400?text=Imagen+no+disponible';
                                        }}
                                    />
                                </div>

                                <ActionButtons
                                    anime={anime}
                                    initialStatus={animeStatus[anime.id] || {}}
                                    onUpdate={onUpdate}
                                />

                                <a
                                    className="titleLink"
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <p className="anime-title">{anime.title}</p>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {showRightArrow && (
                    <button className="arrow right-arrow" onClick={() => handleArrowClick('right')}>
                        <svg><use href="#next"></use></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaScroller;