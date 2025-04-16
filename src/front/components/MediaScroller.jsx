import React, { useState, useRef, useEffect } from 'react';
import ActionButtons from './ActionButtons';

const MediaScroller = ({ animes }) => {
    const [sliderIndex, setSliderIndex] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const sliderRef = useRef(null);
    const [animeStates, setAnimeStates] = useState(() => {
        const saved = localStorage.getItem('animeStates');
        return saved ? JSON.parse(saved) : {};
    });

    // Save states when they change
    useEffect(() => {
        localStorage.setItem('animeStates', JSON.stringify(animeStates));
    }, [animeStates]);

    // Unified handler to change states
    const handleWatching = (anime) => {
        setAnimeStates(prev => {
            const isWatching = prev[anime.id]?.status === 'watching';
            const newState = { ...prev };

            if (isWatching) {
                if (prev[anime.id]?.isFavorite) {
                    newState[anime.id] = {
                        isFavorite: true,
                        animeData: {
                            id: anime.id,
                            title: anime.title,
                            image_url: anime.image_url
                        }
                    };
                } else {
                    delete newState[anime.id];
                }
            } else {
                newState[anime.id] = {
                    ...prev[anime.id],
                    status: 'watching',
                    animeData: {
                        id: anime.id,
                        title: anime.title,
                        image_url: anime.image_url
                    }
                };
            }

            return newState;
        });
    };

    // Favorites
    const handleFavorite = (anime) => {
        setAnimeStates(prev => {
            const isFav = !(prev[anime.id]?.isFavorite || false);
            const newState = { ...prev };

            if (isFav) {
                newState[anime.id] = {
                    ...prev[anime.id],
                    isFavorite: true,
                    animeData: {
                        id: anime.id,
                        title: anime.title,
                        image_url: anime.image_url
                    }
                };
            } else {
                if (prev[anime.id]?.status) {
                    newState[anime.id] = {
                        status: prev[anime.id].status,
                        animeData: {
                            id: anime.id,
                            title: anime.title,
                            image_url: anime.image_url
                        }
                    };
                } else {
                    delete newState[anime.id];
                }
            }

            return newState;
        });
    };

    const getAnimeState = (anime) => {
        return animeStates[anime.id]?.status || null;
    };

    const isFavorite = (anime) => {
        return animeStates[anime.id]?.isFavorite || false;
    };

    // Slider Logic
    const handleArrowClick = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
        const totalItems = slider.children.length;
        const maxIndex = Math.ceil(totalItems / itemsPerScreen) - 1;

        let newIndex;
        if (direction === 'left') {
            newIndex = Math.max(0, sliderIndex - 1);
        } else {
            newIndex = Math.min(maxIndex, sliderIndex + 1);
        }

        setSliderIndex(newIndex);
        slider.style.setProperty('--slider-index', newIndex);

        setShowLeftArrow(newIndex > 0);
        setShowRightArrow(newIndex < maxIndex);
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
        const totalItems = slider.children.length;
        const maxIndex = Math.ceil(totalItems / itemsPerScreen) - 1;

        setShowLeftArrow(sliderIndex > 0);
        setShowRightArrow(sliderIndex < maxIndex);
    }, [sliderIndex, animes]);

    return (
        <div className="scroller-container">
            <div className="slider-container">
                {showLeftArrow && (
                    <div
                        className="arrow left-arrow"
                        onClick={() => handleArrowClick('left')}
                    >
                        <svg><use href="#previous"></use></svg>
                    </div>
                )}

                <div className="slider" ref={sliderRef}>
                    {animes.map((anime) => (
                        <div key={anime.id} className="slide-item">
                            <div className="image-container">
                                <a href={`https://www.youtube.com/results?search_query=${anime.title}`}>
                                    <img
                                        src={anime.image_url}
                                        alt={anime.title}
                                        className="slide-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400?text=Imagen+no+disponible';
                                        }}
                                    />
                                </a>
                                <ActionButtons
                                    anime={anime}
                                    isFavorite={isFavorite}
                                    getAnimeState={getAnimeState}
                                    handleFavorite={handleFavorite}
                                    handleWatching={handleWatching}
                                />
                                <a className="titleLink" href={`https://www.youtube.com/results?search_query=${anime.title}`} >
                                    <p className="anime-title" >{anime.title}</p>
                                </a>
                            </div>

                        </div>
                    ))}
                </div>

                {showRightArrow && (
                    <div
                        className="arrow right-arrow"
                        onClick={() => handleArrowClick('right')}
                    >
                        <svg><use href="#next"></use></svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaScroller;
