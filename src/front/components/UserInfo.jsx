//pretty straight forward... 
import React from "react";

const UserInfo = () => {
    return (
        <section className="userInfo container-fluid">
            <div className="todo">
                <div className="row">
                    {/* Primera tarjeta (2 columnas) */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-md-5 col-sm-12 col-12">
                        <div className="card profile-card">
                            <img src="https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png"
                                className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">Username</h5>
                                <h5 className="Gender">he/him</h5>
                                <a href="#" className="btn btn-secondary">Edit Profile</a>
                            </div>
                        </div>
                    </div>
                    {/* Segunda tarjeta (6 columnas) */}
                    <div className="col-xxl-8 col-xl-6 col-lg-8 col-md-6 col-sm-12">
                        <div className="card abtMe">
                            <h2 className="card-header">About me</h2>
                            <h6>
                                Soy un apasionado del anime, especialmente de aquellos que exploran los límites de la ciencia
                                ficción. Me encanta sumergirme en mundos futuristas donde se cuestionan las realidades
                                tecnológicas, la inteligencia artificial y los dilemas éticos que surgen en esos contextos.
                                Series como Steins;Gate, Ghost in the Shell o Cowboy Bebop no solo me entretienen, sino que me
                                invitan a reflexionar sobre el futuro de la humanidad y su relación con la tecnología. <br /><br />

                                Soy de los que disfruta de las tramas complejas, los giros inesperados y los personajes
                                multidimensionales. Creo que el anime tiene un poder único para explorar ideas filosóficas
                                profundas, y me gusta debatir y teorizar sobre los aspectos más interesantes de las historias.
                                Prefiero un buen análisis sobre la trama que un comentario superficial, y valoro las
                                conversaciones que me permiten descubrir nuevas perspectivas. <br /><br />

                                No me identifico con los estereotipos exagerados del fandom, sino que disfruto del anime con una
                                mentalidad abierta y respetuosa. Si alguna vez quieres hablar sobre el impacto de la IA en la
                                sociedad o cómo los viajes en el tiempo podrían alterar nuestra percepción de la vida, soy tu
                                persona.
                            </h6>
                        </div>

                    </div>
                    <div className="card archieve-container col-xxl-2 col-xl-3 col-lg-12 col-md-12 col-sm-12">
                        <h2 className="card-header">Archievements</h2>
                        <ul className="archieve-list">
                            {[...Array(10)].map((_, index) => (
                                <li key={index}>
                                    <img className="archieveIcons" src="https://cdn-icons-png.flaticon.com/512/4319/4319081.png"
                                        alt={`Achievement ${index + 1}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserInfo;