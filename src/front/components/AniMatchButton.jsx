import React from "react";
import '../css/Animatch.css'

const ButtonAnimatch = ({ text, onClick }) => {
    return (
        <button
            type="button"
            className="button-anime"
            data-mdb-ripple-init
            data-mdb-ripple-color="dark"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonAnimatch;
