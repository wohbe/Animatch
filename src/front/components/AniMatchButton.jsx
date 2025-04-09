import React from "react";

const ButtonAnimatch = ({ text, onClick }) => {
    return (
        <button
            type="button"
            className="btn btn-light button-animatch"
            data-mdb-ripple-init
            data-mdb-ripple-color="dark"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonAnimatch;
