import React from "react";
import '/workspaces/spain-fs-pt-95-g1/src/css/AnimatchCard.css'

const AnimatchCard = ({ title, synopsis, url, image }) => {

    return (
        <div className="animatch-card">
            <div
                className="animatch-image"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="animatch-overlay"></div>
            </div>
            <div className="animatch-content">
                <h1 className="animatch-title">{title}</h1>
                <p className="animatch-meta">Recomendado por Animatch</p>

                <p className="animatch-summary-title">SINOPSIS</p>
                <p className="animatch-synopsis">{synopsis.length > 150 ? `${synopsis.slice(0, 150)}...` : synopsis}</p>

                <a
                    href={url}
                    className="button-anime"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ▶ VER ANIME
                </a>
            </div>
        </div>
    );

};

export default AnimatchCard;

