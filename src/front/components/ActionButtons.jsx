import React from 'react';

const ActionButton = ({
    anime,
    isFavorite,
    getAnimeState,
    handleFavorite,
    handleWatching
}) => {
    return (
        <div className="button-overlay">
            <button
                className="boton"
                id="favoritos"
                onClick={() => handleFavorite(anime)}
            >
                {isFavorite(anime) ? (
                    // Full Heart (favorite)
                    <svg viewBox="0 0 24 24" fill="#ff6f61" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
                                 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                                 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                ) : (
                    // Broken Heart (Not Favorite)
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M12 6.00011L14 8.00011L10 10.0001L13 13.0001M12 6.00011C10.2006 3.90309 7.19377 3.25515 4.93923 5.17539C2.68468 7.09563 2.36727 10.3062 4.13778 12.5772C5.60984 14.4655 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9816C11.9483 20.0063 12.0393 20.0063 12.1225 19.9816C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4655 19.8499 12.5772C21.6204 10.3062 21.3417 7.07543 19.0484 5.17539C16.7551 3.27535 13.7994 3.90309 12 6.00011Z"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                )}
            </button>
            <button
                className="boton"
                id="viendo"
                onClick={() => handleWatching(anime)}
            >
                <svg className="icono" viewBox="0 0 24 24"
                    fill={getAnimeState(anime) === 'watching' ? "#ff6f61" : "white"}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
            </button>
        </div>
    );
};

export default ActionButton;
