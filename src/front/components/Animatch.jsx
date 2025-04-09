import { useEffect, useState } from "react";
import React from "react";
import ButtonAnimatch from "./AniMatchButton";
import ImageList from "./ImageList";

const Animatch = ({ userId }) => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animeList, setAnimeList] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [generating, setGenerating] = useState(false);

    const questions = [
        {
            pregunta: "¿Qué género te interesa más?",
            opciones: ["Acción", "Romance", "Comedia", "Drama", "Fantasía"],
            clave: "genre",
        },
        {
            pregunta: "¿Prefieres un anime corto o largo?",
            opciones: ["Corto", "Largo"],
            clave: "duration",
        },
        {
            pregunta: "¿Te gustan más las historias reales o fantásticas?",
            opciones: ["real", "fantasy"],
            clave: "theme",
        },
        {
            pregunta: "¿Prefieres protagonistas jóvenes o adultos?",
            opciones: ["Young", "Adult"],
            clave: "character",
        },
        {
            pregunta: "¿Buscas algo divertido o emotivo?",
            opciones: ["Funny", "Emotional"],
            clave: "tone",
        },
    ];

    useEffect(() => {
        const apiCall = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://special-cod-qww9jggw4vv29jq5-3001.app.github.dev/api/anime");
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
                            "Acción": ["Action", "Adventure"],
                            "Romance": ["Romance"],
                            "Comedia": ["Comedy"],
                            "Drama": ["Drama"],
                            "Fantasía": ["Fantasy", "Supernatural", "Sci-Fi"]
                        };
                        const genreToSelect = map[answer.respuesta] || [];
                        return genreNames.some((g) => genreToSelect.includes(g));
                    }
                    case "duration":
                        return answer.respuesta === "Corto"
                            ? anime.episodes && anime.episodes <= 24
                            : anime.episodes && (anime.episodes > 24 || anime.episodes === null);
                    case "theme":
                        return answer.respuesta === "real"
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
                title: "We couldn't find a perfect anime for you",
                synopsis: "But maybe you'll like some of our latest additions."
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

    return (
        <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h2 className="abtMe">🎌 Animatch</h2>
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
                    <p>
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                </div>
            )}

            {!loading && !generating && recommendation && (
                <div style={{ marginTop: "40px" }}>
                    <h3>{recommendation.title}</h3>
                    <img
                        src={recommendation.image_url}
                        alt={recommendation.title}
                        style={{ maxWidth: "100%", borderRadius: "12px", margin: "20px 0" }}
                    />
                    <p>{recommendation.synopsis}</p>
                    <button onClick={restartTest} style={{ marginTop: "20px" }}>
                        Start Over
                    </button>
                </div>
            )}
        </div>
    );
};

export default Animatch;