import React from "react";

const AnimatchCard = ({ title, synopsis, url, image }) => {

    return (
        <div className="card text-center" style={{ maxWidth: "450px", margin: "auto" }}>
            <img src={image} className="card-img-top rounded" alt={title} style={{ width: "100%", objectFit: "cover" }}
            />
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p className="card-text text-start fw-light">{synopsis}</p>
                <a href="{url}" className="btn btn-dark">More info</a>
            </div>
        </div>
    );

};

export default AnimatchCard; 
