import { useState, useEffect } from 'react';

function AnimeNews() {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const response = await fetch('https://api.jikan.moe/v4/seasons/now');
                const data = await response.json();
                setAnimes(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching anime:', error);
                setLoading(false);
            }
        };

        fetchAnimes();
    }, []);

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Novedades de Anime</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {animes.map((anime) => (
                    <div key={anime.mal_id} className="col">
                        <div className="card h-100">
                            <img
                                src={anime.images.jpg.image_url}
                                className="card-img-top"
                                alt={anime.title}
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{anime.title}</h5>
                                <p className="card-text text-truncate">
                                    {anime.synopsis}
                                </p>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">
                                        Episodios: {anime.episodes || 'En emisión'}
                                    </small>
                                    <small className="text-muted">
                                        ⭐ {anime.score || 'N/A'}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnimeNews;
