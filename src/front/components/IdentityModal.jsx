import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import '../css/IdentityModal.css'; 

const IdentityModal = ({ closeModal }) => {
  const { user, setUser, isLogged, setIsLogged, token, setToken } = useContext(UserContext);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [registerData, setRegisterData] = useState({
    email: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  }

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  }

  const handleRegisterSubmit = async (e) => {
    const minpasswordLength = 8
    e.preventDefault();

    if (!registerData.email || !registerData.password) {
      alert('Please fill in all fields');
      return
    }

    if (registerData.password.length < minpasswordLength) {
      alert('Password must be at least 8 characters long');
      return
    }

    const response = await fetch(`${baseURL}api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();
    if (!response.ok) {
      alert('Something went wrong');
    }

    if (response.ok) {
      setUser(data.user);
      setIsLogged(true);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      closeModal();
    }

    setRegisterData({
      email: '',
      password: ''
    });
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert('Please fill in all fields');
      return
    }

    const response = await fetch(`${baseURL}api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json()
    if (!response.ok) {
      alert('Something went wrong');
    }

    if (response.ok) {
      setUser(data.user);
      setIsLogged(true);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      closeModal();
    }

    setLoginData({
      email: '',
      password: ''
    });
  }

  return (
    <div className="modal-container position-fixed d-flex justify-content-center align-items-center">
      <div className="modal-dialog modal-dialog-centered identity-modal-size">
        <div className="modal-content identity-modal">
          <div className="modal-header identity-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-center flex-grow-1">WELCOME TO ANIMATCH</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row">
              <div className="col-md-6">
                <h5 className="mb-3">Register</h5>
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label htmlFor="InputEmailRegister" className="form-label">Email address</label>
                    <input type="email" className="form-control identity-input" name="email" id="InputEmailRegister" value={registerData.email} onChange={handleRegisterChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="InputPasswordRegister" className="form-label">Password</label>
                    <input type="password" className="form-control identity-input" name="password" id="InputPasswordRegister" value={registerData.password} placeholder='Password must be at least 8 characters long.' onChange={handleRegisterChange} />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary identity-btn">REGISTER</button>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <h5 className="mb-3">Login</h5>
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label htmlFor="InputEmailLogin" className="form-label">Email address</label>
                    <input type="email" className="form-control identity-input" name="email" id="InputEmailLogin" value={loginData.email} onChange={handleLoginChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="InputPasswordLogin" className="form-label">Password</label>
                    <input type="password" className="form-control identity-input" name="password" id="InputPasswordLogin" value={loginData.password} onChange={handleLoginChange} />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary identity-btn">LOGIN</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;