import React, { useContext, useEffect, useRef } from 'react'; 
import { UserContext } from '../context/UserContext';
import { Link } from "react-router-dom";

const UserModal = ({ closeModal }) => {
  const { user, setUser, isLogged, setIsLogged, token, setToken } = useContext(UserContext);
  const modalRef = useRef(null); 

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLogged(false);
    setToken(null);
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal(); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]); 

  return (
    <div
      ref={modalRef}
      className="dropdown-menu dropdown-menu-end show"
      style={{ position: 'absolute', top: '60px', right: '20px', zIndex: 1000, boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)' }}
    >
      <Link to="/userview" className="dropdown-item" onClick={closeModal}>
        Profile
      </Link>
      <div className="dropdown-divider"></div>
      <button className="dropdown-item text-danger" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};

export default UserModal;
