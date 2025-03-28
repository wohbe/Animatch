import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<section>
			<div className="NavBar">
				<nav className="navbar navbar-expand-lg">
					<a className="navbar-brand" href="#">
						<img src="/src/front/assets/img/logo.jpg" width="30" height="30" className="d-inline-block align-top" alt="" />
					</a>
					<div className="container-fluid">
						<a className="navbar-brand Home" href="/">Animatch</a>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
							aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
							<div className="navbar-nav">
								<Link className="nav-link active News" aria-current="page" href="#">New</Link>
								<Link className="nav-link active Popular" aria-current="page" href="#">Popular</Link>
								<Link className="nav-link active Categories" aria-current="page" href="#">Categories</Link>
								<Link className="nav-link active Match" href="#">Match <i className="fa-regular fa-heart"></i></Link>
								<Link className="nav-link active Profile" href="#">Profile</Link>
							</div>
						</div>
					</div>
					<form className="form-inline  my-lg-0 d-flex">
						<input className="form-control mr-sm-3 "type="search" placeholder="Search" aria-label="Search" />
						<button className="btn btn-outline-success  my-sm-0 m-2" type="submit">Search</button>
					</form>
				</nav>
			</div>
		</section>

	);
};

export default Navbar;