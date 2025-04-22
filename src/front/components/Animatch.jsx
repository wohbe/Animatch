import { useEffect, useState, useContext } from "react";
import React from "react";
import ButtonAnimatch from "./AniMatchButton";
import AnimatchCard from "./AnimatchCard";
import '/workspaces/spain-fs-pt-95-g1/src/css/Animatch.css';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Animatch = ({ userId }) => {
    const [result, setResult] = useState([]);
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animeList, setAnimeList] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [generating, setGenerating] = useState(false);
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const { isLogged } = useContext(UserContext);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const questions = [
        {
            pregunta: "What genre interests you the most?",
            opciones: ["Action", "Romance", "Comedy", "Drama", "Fantasy"],
            clave: "genre",
        },
        {
            pregunta: "Do you prefer a short or long anime?",
            opciones: ["Short", "Long"],
            clave: "duration",
        },
        {
            pregunta: "Do you prefer realistic or fantastical stories?",
            opciones: ["Realistic", "Fantasy"],
            clave: "theme",
        },
        {
            pregunta: "Do you prefer young or adult protagonists?",
            opciones: ["Young", "Adult"],
            clave: "character",
        },
        {
            pregunta: "Are you looking for something funny or emotional?",
            opciones: ["Funny", "Emotional"],
            clave: "tone",
        },
    ];

    useEffect(() => {
        const apiCall = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/anime`);
                if (!response.ok) throw new Error("Failed to load anime list");
                const anime = await response.json();
                setAnimeList(anime);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        apiCall();
    }, []);

    useEffect(() => {
        if (answers.length === questions.length) {
            setGenerating(true);
            setTimeout(() => {
                getRecommendation(answers);
                setGenerating(false);
            }, 300);
        }

        if (answers.length === 1) {
            handleShow();
        }
    }, [answers]);

    const getRecommendation = (finalAnswers = answers) => {
        if (animeList.length === 0) return;

        let filteredAnime = [...animeList];

        finalAnswers.forEach((answer) => {
            const question = questions[answer.preguntaId];

            filteredAnime = filteredAnime.filter((anime) => {
                const genreNames = anime.genres.map(g => g.name);

                switch (question.clave) {
                    case "genre": {
                        const map = {
                            "Action": ["Action", "Adventure"],
                            "Romance": ["Romance"],
                            "Comedy": ["Comedy"],
                            "Drama": ["Drama"],
                            "Fantasy": ["Fantasy", "Supernatural", "Sci-Fi"]
                        };
                        const genreToSelect = map[answer.respuesta] || [];
                        return genreNames.some((g) => genreToSelect.includes(g));
                    }
                    case "duration":
                        return answer.respuesta === "Short"
                            ? anime.episodes && anime.episodes <= 24
                            : anime.episodes && (anime.episodes > 24 || anime.episodes === null);
                    case "theme":
                        return answer.respuesta === "Realistic"
                            ? genreNames.some((g) => ["Drama", "Slice of Life", "Sports", "Music"].includes(g))
                            : genreNames.some((g) => ["Supernatural", "Sci-Fi", "Magic"].includes(g));
                    case "character": {
                        if (!anime.synopsis) return true;
                        const s = anime.synopsis.toLowerCase();
                        return answer.respuesta === "Young"
                            ? s.includes("student") || s.includes("school") || s.includes("young")
                            : s.includes("adult") || s.includes("man") || s.includes("woman");
                    }
                    case "tone":
                        return answer.respuesta === "Funny"
                            ? genreNames.includes("Comedy")
                            : genreNames.some((g) => ["Drama", "Romance"].includes(g));
                    default:
                        return true;
                }
            });
        });

        if (filteredAnime.length > 0) {
            const recIndex = Math.floor(Math.random() * filteredAnime.length);
            setRecommendation(filteredAnime[recIndex]);
            if (userId) saveUserPreferences(userId);
        } else {
            setRecommendation({
                title: "No perfect anime match found",
                synopsis: "But maybe you'll enjoy one of our latest additions."
            });
        }
    };

    const manageReply = (option) => {
        setAnswers((prev) => {
            const filtered = prev.filter((r) => r.preguntaId !== currentQuestion);
            return [
                ...filtered,
                {
                    preguntaId: currentQuestion,
                    respuesta: option,
                    timestamp: new Date(),
                },
            ];
        });

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const restartTest = () => {
        setAnswers([]);
        setRecommendation(null);
        setCurrentQuestion(0);
        setGenerating(false);
        setShowModal(false);
    };

    const saveUserPreferences = async (userId) => {
        try {
            const preferences = {};
            answers.forEach(resp => {
                const question = questions[resp.preguntaId];
                preferences[question.clave] = resp.respuesta;
            });

            const response = await fetch('/api/user/preferences', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id: userId, ...preferences })
            });

            if (!response.ok) {
                throw new Error("Error saving preferences");
            }

            console.log("Preferences saved successfully");
        } catch (error) {
            console.error("Error saving preferences", error);
        }
    };

    if (!isLogged) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>🔒 Access restricted</h2>
                <p>Please log in to use AniMatch.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h2>
                <div className="split-text-container">
                    <span className="text-part left">🎌 Ani</span>
                    <span className="text-part right">Match</span>
                </div>
            </h2>
            <p>Find your perfect anime match in 5 steps</p>

            {!recommendation && <img src="public/animatch-logo.png" className="image-logo-animatch" />}
            {loading && <p>Loading anime list...</p>}

            {!loading && generating && (
                <p>🔍 Calculating your recommendation...</p>
            )}

            {!loading && !generating && recommendation === null && currentQuestion < questions.length && (
                <div>
                    <h3>{questions[currentQuestion].pregunta}</h3>
                    {questions[currentQuestion].opciones.map((option, index) => (
                        <ButtonAnimatch
                            key={index}
                            text={option}
                            onClick={() => manageReply(option)}
                        />
                    ))}
                    <div className="progress-dragonballs">
                        {questions.map((_, index) => (
                            <img
                                key={index}
                                src="public/dragonball1star.png"
                                alt={`Dragon Ball ${index + 1}`}
                                className={`dragonball-icon ${index < currentQuestion
                                    ? "db-completed"
                                    : index === currentQuestion
                                        ? "db-current"
                                        : "db-pending"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!loading && !generating && recommendation && (
                <AnimatchCard
                    title={recommendation.title}
                    synopsis={recommendation.synopsis}
                    image={recommendation.image_url}
                    url={`anime/${recommendation.id}`} />
            )}

            <button onClick={restartTest} className="button-anime" style={{ marginTop: "20px" }}>
                Start Over
            </button>

            {showModal && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal">
                        <h2>✨ Great choice!</h2>
                        <p>Let's continue to refine your recommendation.</p>
                        <button onClick={handleClose} className="button-anime">Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Animatch;
