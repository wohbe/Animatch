import React from "react";

const NavBar = () => {
    return (
        <section>
            <div className="NavBar">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <a className="navbar-brand Home" href="#">Animatch</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <a className="nav-link active News" aria-current="page" href="#">New</a>
                                <a className="nav-link active Popular" aria-current="page" href="#">Popular</a>
                                <a className="nav-link active Categories" aria-current="page" href="#">Categories</a>
                                <a className="nav-link active Match" href="#">Match <i className="fa-regular fa-heart"></i></a>
                                <a className="nav-link active Profile" href="#">Profile</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
};

export default NavBar;