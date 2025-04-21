import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ ...data.user, id: String(data.user.id) });
                setToken(data.access_token);
                localStorage.setItem('token', data.access_token);
                navigate('/userview');
            } else {
                alert(`Error: ${data.message || 'Credenciales incorrectas'}`);
            }
        } catch (error) {
            alert('Error de conexión con el servidor');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd' }}>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                />
                <button
                    type="submit"
                    style={{ background: '#ff6f61', color: 'white', padding: '0.5rem 1rem', border: 'none' }}
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default Login;