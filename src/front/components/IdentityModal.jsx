import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

const IdentityModal = () => {

  const { user, setUser, isLogged, setIsLogged, token, setToken } = useContext(UserContext);

  const [registerData, setRegisterData] = useState({
    email: '',
    password: ''
  })

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value // Actualizamos el estado con lo que el usuario escribe en el input
    });
  }

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  }


  return (
    <div className="modal-container position-fixed d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">Register</h5>
            <form>
              <div className="mb-3">
                <label htmlFor="InputEmailRegister" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="InputEmailRegister" value={registerData.email} onChange={handleRegisterChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPasswordRegister" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="InputPasswordRegister" value={registerData.password} aria-describedby="passwordHelp" onChange={handleRegisterChange} />
                <div id="passwordHelp" className="form-text">Password must be at least 8 characters long.</div>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
          <div className="col-md-6">
          <form>
              <div className="mb-3">
                <label htmlFor="InputEmailLogin" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="InputEmailLogin" value={loginData.email} onChange={handleLoginChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPasswordLogin" className="form-label">Password</label>
                <input type="password" className="form-control" id="InputPasswordLogin" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;