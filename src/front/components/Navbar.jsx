
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import IdentityModal from "./IdentityModal";
import UserModal from "./UserModal";
import { UserContext } from '../context/UserContext';
import SearchContainer from "./SearchContainer";

const NavBar = () => {
	const [showModal, setShowModal] = useState(false);
	const { isLogged } = useContext(UserContext);

	const handleShow = () => setShowModal(true);
	const handleClose = () => setShowModal(false);

	return (
		<section>
			<div className="NavBar">
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<Link className="navbar-brand order-lg-0" to="#">
							<img src="/src/front/assets/img/animatch.png" width="40" height="40" className="d-inline-block align-top" alt="" />
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
								<SearchContainer />
							</div>
						</div>
					</div>
					<div className="d-flex align-items-center order-lg-3 ms-auto">
						<Link
							className="user-menu rounded me-3" title={isLogged ? "User options" : "Login/register"}
							to="#"
							aria-label={isLogged ? "User options" : "Register/Login"}
							onClick={handleShow}
						>
							<img src={isLogged ? "src/front/assets/img/loged-picture.png" : "src/front/assets/img/profile-picture.png"} alt="User profile" className="profile-icon" width="40" height="40" />
						</Link>
					</div>
				</nav>
			</div>
			{showModal && (isLogged ? <UserModal closeModal={handleClose} /> : <IdentityModal closeModal={handleClose} />)}
		</section>
	);
};

export default NavBar;
