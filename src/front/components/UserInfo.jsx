import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserInfo = () => {
    const { user, token } = useContext(UserContext);
    const navigate = useNavigate();
    const [imageUrl] = useState("https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png");
    const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("¿Are you sure that you want to delete this account? This action can't be reversed.");
        if (!confirmed) return;
    
        try {
            const response = await fetch(`${baseURL}/api/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error erasing account");
            }
    
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            window.location.href = window.location.origin;
    
        } catch (error) {
            console.error("Error:", error);
            alert(`Error erasing account: ${error.message}`);
        }
    };

    return (
        <section className="userInfo container-fluid">
            <div className="todo">
                <div className="row">
                    <div className="offset-xxl-4 offset-xl-4 offset-lg-3 offset-md-2 offset-sm-1 col-xxl-4 col-xl-4 col-lg-6 col-md-8 col-sm-10 col-12 custom-wide-fix">
                        <div className="card profile-card">
                            <div className="position-relative">
                                <img
                                    src={imageUrl}
                                    alt="profile"
                                    className="card-img-top"
                                    style={{ objectFit: "cover", height: "auto" }}
                                />
                            </div>
                            <div className="user-card-body">
                                <h5 className="card-title">{user?.email || "User not identified"}</h5>
                                <div className="editEraseLogOut">
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