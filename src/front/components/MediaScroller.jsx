import React, { useState, useRef, useEffect } from 'react';

const MediaScroller = ({ images }) => {
    const [sliderIndex, setSliderIndex] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const sliderRef = useRef(null);

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
    }, [sliderIndex]);

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
                    {images.map((imgSrc, index) => (
                        <div key={index} className="slide-item">
                            <div className="image-container">
                                <img
                                    src={imgSrc}
                                    alt={`Slide ${index}`}
                                    className="slide-image"
                                />
                                <div className="button-overlay">
                                    <button className="boton" id="favoritos" aria-label="Añadir a favoritos">
                                        <svg className="icono" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                    <button className="boton" id="ver-mas-tarde" aria-label="Ver más tarde">
                                        <svg className="icono" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                    </button>
                                    <button className="boton" id="viendo" aria-label="Actualmente viendo">
                                        <svg className="icono" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                        </svg>
                                    </button>
                                    <button className="boton" id="terminado" aria-label="Marcar como terminado">
                                        <svg className="icono" viewBox="0 0 24 24" fill="white">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </button>
                                </div>
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

            <svg style={{ display: "none" }}>
                <symbol id="next" viewBox="0 0 256 512">
                    <path fill="white" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                </symbol>
                <symbol id="previous" viewBox="0 0 256 512">
                    <path fill="white" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
                </symbol>
            </svg>
        </div>
    );
};

export default MediaScroller;
