import React, { useState } from "react";
import { Link } from "react-router-dom";
import IdentityModal from "./IdentityModal";

const NavBar = () => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <section>
            <div className="NavBar">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        {/* Logo (opcional) */}
                        <Link className="navbar-brand order-lg-0" to="#">
                            <img
                                src="/src/front/assets/img/logo.jpg"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />
                        </Link>

                        <Link className="navbar-brand Home order-lg-0" to="/">
                            Animatch
                        </Link>

                        <button
                            className="navbar-toggler order-lg-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup"
                            aria-controls="navbarNavAltMarkup"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse order-lg-1" id="navbarNavAltMarkup">
                            <div className="navbar-nav me-auto">
                                <Link className="nav-link active News" aria-current="page" to="#">
                                    New
                                </Link>
                                <Link className="nav-link active Popular" aria-current="page" to="#">
                                    Popular
                                </Link>
                                <Link className="nav-link active Categories" aria-current="page" to="#">
                                    Categories
                                </Link>
                                <Link className="nav-link active Match" to="#">
                                    Match <i className="fa-regular fa-heart"></i>
                                </Link>
                                <Link className="nav-link active Profile" to="#">
                                    Profile
                                </Link>
                            </div>
                        </div>

                        <div className="d-flex align-items-center order-lg-3 ms-2">
                            <Link
                                className="user-menu rounded"
                                title="Login/register"
                                to="#"
                                aria-label="Ir al perfil"
                                onClick={handleShow}
                            >
                                <i className="fa fa-user-circle"></i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {showModal && <IdentityModal closeModal={handleClose} />}
        </section>
    );
};

export default NavBar;
