import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";

export const Home = () => {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const response = await fetch("https://api.jikan.moe/v4/top/anime");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAnimes(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAnimes();
    }, []);

	if (loading) {
        return <div className="text-center mt-5">Cargando animes...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

	const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        rows: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        prevArrow: <SamplePrevArrow />,
        nextArrow: <SampleNextArrow />,
    };

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "gray", width: "50px", height: "50px", borderRadius: "50%", textAlign: "center", lineHeight: "30px", color: "white", marginRight: "40px" }}
                onClick={onClick}>
                {">"}
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "gray", width: "30px", height: "30px", borderRadius: "50%", textAlign: "center", lineHeight: "30px", color: "white" }}
                onClick={onClick}
            >
                {"<"}
            </div>
        );
    }

    return (
        <div>
           
            <main>
                <Slider {...settings}>
                    {animes.map((anime) => (
                        <div key={anime.mal_id}>
                            <Link to="/AnimeCard" className="anime-card">
                                <img src={anime.images.jpg.image_url} alt={anime.title} />
                                <h3>{anime.title}</h3>
                                </Link>
                        </div>
                    ))}
                </Slider>
            </main>
            <footer>
                {/* Pie de página */}
            </footer>
        </div>
    );
};

export default Home;