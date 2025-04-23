import React from "react";


const ImageList = ({ title, images }) => {
    return (
        <div className="row g-0 componente">
            {/* Columna de "Mis Listas" */}
            <div className="offset-1 col-10">
                <div className="card list-card">
                    <p className="list-text">{title}</p>
                </div>
            </div>
        </div>
    );
};

export default ImageList;
