import React from "react";
import '../css/AnimatchCard.css'
import { Link } from 'react-router-dom';

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
                <p className="animatch-meta">Recomended by Animatch</p>

                <p className="animatch-summary-title">SINOPSIS</p>
                <p className="animatch-synopsis">{synopsis.length > 150 ? `${synopsis.slice(0, 150)}...` : synopsis}</p>

                <Link to={`/${url}`} className="button-anime">
                    ▶ SEE MORE
                </Link>
            </div>
        </div>
    );

};

export default AnimatchCard;

