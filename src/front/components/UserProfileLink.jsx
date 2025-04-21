import React from 'react';
import { Link } from 'react-router-dom';

const UserProfileLink = ({ isLoggedIn }) => {
  return (
    <Link
      className="user-menu rounded "
      title={isLoggedIn ? "Ir al perfil" : "Login/register"}
      to="/profile"
      aria-label={isLoggedIn ? "Ir al perfil" : "Ir a la página de login/registro"}
    >
      {isLoggedIn ? (
        <i className="fa-solid fa-user-plus "></i> /* Icono para usuario logueado */
      ) : (
        <i className="fa-solid fa-user-circle"></i> /* Icono para login/registro */
      )}
    </Link>
  );
};

export default UserProfileLink;