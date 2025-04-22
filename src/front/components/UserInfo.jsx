import React, { useState } from "react";

const UserInfo = () => {
    const [editProfile, setEditProfile] = useState(false);
    const [editAboutMe, setEditAboutMe] = useState(false);
    const [username, setUsername] = useState("example@gmail.com");
    const [gender, setGender] = useState("Name");
    const [imageUrl, setImageUrl] = useState("https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png");
    const [aboutMe, setAboutMe] = useState(``);

    // Temp values
    const [tempUsername, setTempUsername] = useState(username);
    const [tempGender, setTempGender] = useState(gender);
    const [tempAboutMe, setTempAboutMe] = useState(aboutMe);

    const handleSaveProfile = () => {
        setUsername(tempUsername);
        setGender(tempGender);
        setEditProfile(false);
    };

    const handleCancelProfile = () => {
        setTempUsername(username);
        setTempGender(gender);
        setEditProfile(false);
    };

    return (
        <section className="userInfo container-fluid">
            <div className="todo">
                <div className="row">
                    {/* First Card (perfil) */}
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
                                {editProfile ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            value={tempUsername}
                                            onChange={(e) => setTempUsername(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            value={tempGender}
                                            onChange={(e) => setTempGender(e.target.value)}
                                        />
                                        <button className="btn btn-primary me-2" onClick={handleSaveProfile}>Save</button>
                                        <button className="btn btn-secondary" onClick={handleCancelProfile}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <h5 className="card-title">{username}</h5>
                                        <h5 className="Gender">{gender}</h5>
                                        <div className="editEraseLogOut">
                                            <button className="btn btn-primary edit" onClick={() => setEditProfile(true)}>
                                                Edit Profile
                                            </button>
                                            <button className="btn btn-danger logOut">
                                                Log Out
                                            </button>
                                            <button className="btn btn-warning delete">
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Second Card (hidden because is not part of the mvp and we don't know if we gonna have time) */}
                    {/* 
                    <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-5 col-sm-12">
                        <div className="card abtMe">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h2>About me</h2>
                                {!editAboutMe && (
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditAboutMe(true)}>
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="card-body">
                                {!editAboutMe ? (
                                    <h6 style={{ whiteSpace: "pre-line" }}>{aboutMe}</h6>
                                ) : (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            rows="4"
                                            value={tempAboutMe}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 875) {
                                                    setTempAboutMe(e.target.value);
                                                }
                                            }}
                                        />
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success" onClick={() => {
                                                setAboutMe(tempAboutMe);
                                                setEditAboutMe(false);
                                            }}>
                                                Guardar
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => {
                                                setTempAboutMe(aboutMe);
                                                setEditAboutMe(false);
                                            }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div> 
                    */}

                    {/*Trophies 
                    <div className="card archieve-container col-xxl-2 col-xl-3 col-lg-12 col-md-12 col-sm-12">
                        <h2 className="card-header">Achievements</h2>
                        <ul className="archieve-list">
                            {[...Array(10)].map((_, index) => (
                                <li key={index}>
                                    <img className="archieveIcons" src="https://cdn-icons-png.flaticon.com/512/4319/4319081.png"
                                        alt={`Achievement ${index + 1}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    */}
                </div>
            </div>
        </section>
    );
};

export default UserInfo;
