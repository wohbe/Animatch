import React from "react";
import { Link } from "react-router-dom";
import { SearchContainer } from "./SearchContainer";
const Navbar = () => {
	return (
		<section>
			<div className="NavBar">
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<Link className="navbar-brand order-lg-0" to="#">
							<img src="/src/front/assets/img/logo.jpg" width="30" height="30" className="d-inline-block align-top" alt="" />
						</Link>
						<Link className="navbar-brand Home order-lg-0" to="/">Animatch</Link>
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
								<Link className="nav-link active News" aria-current="page" to="#">New</Link>
								<Link className="nav-link active Popular" aria-current="page" to="#">Popular</Link>
								<Link className="nav-link active Categories" aria-current="page" to="#">Categories</Link>
								<Link className="nav-link active Match" to="#">Match <i className="fa-regular fa-heart"></i></Link>
								<Link className="nav-link active Profile" to="#">Profile</Link>
							</div>
							<SearchContainer />
						</div>
					</div>
					<div className="d-flex align-items-center order-lg-3 ms-2">
						<Link
							className="user-menu rounded " title="Login/register"
							to="/profile"
							aria-label="Ir al perfil" 
						>
							{/* {isLoggedIn ? (
								<i className="fa-solid fa-user-plus "></i> icono para cuando está logueado 
							) : (
								<i className="fa-solid fa-user-circle"></i> icono antes del login 
							)} */}
						</Link>
					</div>
				</nav>
			</div>
		</section>
	);
};

export default Navbar;


