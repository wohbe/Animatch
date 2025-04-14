import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const IdentityModal = ({ closeModal }) => {

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (!registerData.email || !registerData.password) {
      alert('Please fill in all fields')
      return
    }

    if (registerData.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    
    const response = await fetch('https://congenial-doodle-wrgj95gr6756fg4jj-3001.app.github.dev/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })

    const data = await response.json()
    if (!response.ok) {
      alert('Something went wrong')
    }

    if (response.ok) {
      setUser(data.user)
      setIsLogged(true)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      closeModal()
    }

    setRegisterData({
      email: '',
      password: ''
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      alert('Please fill in all fields')
      return
    }
    
    const response = await fetch('https://congenial-doodle-wrgj95gr6756fg4jj-3001.app.github.dev/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    const data = await response.json()
    if (!response.ok) {
      alert('Something went wrong')
    }

    if (response.ok) {
      setUser(data.user)
      setIsLogged(true)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      closeModal()
    }
    
    setLoginData({
      email: '',
      password: ''
    })
  }

  return (
    <div className="modal-container position-fixed d-flex justify-content-center align-items-center">
      <div className="container position-relative">
        <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={closeModal}></button>
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">Register</h5>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label htmlFor="InputEmailRegister" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="InputEmailRegister" value={registerData.email} onChange={handleRegisterChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPasswordRegister" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="InputPasswordRegister" value={registerData.password} placeholder='Password must be at least 8 characters long.' onChange={handleRegisterChange} />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
          <div className="col-md-6">
          <h5 className="mb-3">Login</h5>
          <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label htmlFor="InputEmailLogin" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="InputEmailLogin" value={loginData.email} onChange={handleLoginChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPasswordLogin" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="InputPasswordLogin" value={loginData.password} onChange={handleLoginChange} />
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