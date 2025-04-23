import requests
import time
from sqlalchemy import func
from api.models import db, Anime, Genre

def sync_animes(max_pages=20):
    
    anime_api = 'https://api.jikan.moe/v4/anime'
    try:
        page = 1
        print("Iniciando sincronización de animes...")
        while page <= max_pages:
            print(f"Sincronizando página {page}...")  
            response = requests.get(anime_api, params={'page': page})
            if response.status_code != 200:
                print(f"Error al obtener la página {page}: {response.status_code}")
                break

            anime_list = response.json().get('data', [])
            print(f"Número de animes en la página {page}: {len(anime_list)}")  
            
            for anime in anime_list:
                if anime.get('score') and anime['score'] >= 7:
                    exists = Anime.query.filter_by(
                        mal_id=anime['mal_id']).first()
                    trailer_data = anime.get('trailer')
                    trailer_url = trailer_data.get('url') if trailer_data else None
                    
                    if not exists:
                        genre_names = [g['name']
                                      for g in anime.get('genres', [])]
                        genre_objs = []
                        for name in genre_names:
                            genre = Genre.query.filter_by(name=name).first()
                            if not genre:
                                genre = Genre(name=name)
                                db.session.add(genre)
                            genre_objs.append(genre)

                        new_anime = Anime(
                            mal_id=anime['mal_id'],
                            title=anime['title'],
                            synopsis=anime.get('synopsis'),
                            image_url=anime['images']['jpg']['image_url'],
                            episodes=anime.get('episodes'),
                            score=anime['score'],
                            airing=anime.get('airing', False),
                            genres=genre_objs,
                            trailer_url=trailer_url
                        )
                        db.session.add(new_anime)
            db.session.commit()
            page += 1
            time.sleep(1)
            
        print("Sincronización completada. ¡Animes actualizados correctamente!")
        return True
        
    except Exception as e:
        db.session.rollback()
        print(f"Error durante la sincronización: {str(e)}")
        return False