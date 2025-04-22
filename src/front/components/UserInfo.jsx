import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserInfo = () => {
    const { user, token } = useContext(UserContext);
    const navigate = useNavigate();
    const [imageUrl] = useState("https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png");
    const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const handleLogout = () => {
        const confirmed = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
        if (!confirmed) return;

        localStorage.removeItem('token');
        navigate('/categories');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmed) return;

        try {
            const response = await fetch(`${baseURL}/api/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error al eliminar cuenta");
            }

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert("Cuenta eliminada exitosamente");
            navigate("/login");

        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <section className="userInfo container-fluid">
            <div className="todo">
                <div className="row">
                    <div className="offset-xxl-4 offset-xl-3 offset-lg-3 offset-md-1 offset-sm-1 col-xxl-4 col-xl-6 col-lg-6 col-md-10 col-sm-10 col-12 custom-wide-fix">
                        <div className="card profile-card">
                            <div className="position-relative">
                                <img
                                    src={imageUrl}
                                    alt="profile"
                                    className="card-img-top"
                                    style={{ objectFit: "cover", height: "auto" }}
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{user?.email || "Usuario no identificado"}</h5>
                                <div className="editEraseLogOut">
                                    <button className="btn btn-danger logOut" onClick={handleLogout}>
                                        Log Out
                                    </button>
                                    <button className="btn btn-warning delete" onClick={handleDeleteAccount}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserInfo;