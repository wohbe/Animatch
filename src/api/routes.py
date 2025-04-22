from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func
from api.models import db, User, Anime, Favorites, On_Air, Genre, Watching
from api.utils import generate_sitemap, APIException
import requests
import time
import json
import bcrypt

api = Blueprint('api', __name__)
CHARACTER_ENCODING = 'utf-8'
# Permite todas las origenes en desarrollo
# La configuración de CORS se realizará en app.py
# Rate limiting for Jikan API (60 requests per minute)

def wait_for_rate_limit():
    time.sleep(1)  # Wait 1 second between requests

# endpoint para almacenar datos de api externa
# anime
@api.route('/anime', methods=['GET'])
def get_animes():
    animes = Anime.query.all()
    return jsonify([anime.serialize() for anime in animes]), 200


@api.route('/anime/status/<int:anime_id>', methods=['GET'])
@jwt_required()
def get_anime_status(anime_id):
    current_user_id = get_jwt_identity()

    is_favorite = db.session.query(
        exists().where(
            (Favorites.user_id == current_user_id) &
            (Favorites.anime_id == anime_id)
        )).scalar()

    is_watching = db.session.query(
        exists().where(
            (Watching.user_id == current_user_id) &
            (Watching.anime_id == anime_id)
        )).scalar()

    return jsonify({
        'isFavorite': is_favorite,
        'isWatching': is_watching
    }), 200


@api.route('/anime/status/all', methods=['GET'])
@jwt_required()
def get_all_anime_status():
    current_user_id = get_jwt_identity()

    favorites = Favorites.query.filter_by(user_id=current_user_id).all()
    favorites_dict = {fav.anime_id: True for fav in favorites}

    watching = Watching.query.filter_by(user_id=current_user_id).all()
    watching_dict = {watch.anime_id: True for watch in watching}

    all_animes = Anime.query.with_entities(Anime.id).all()

    status_dict = {}
    for anime_id in [anime.id for anime in all_animes]:
        status_dict[str(anime_id)] = {
            'isFavorite': favorites_dict.get(anime_id, False),
            'isWatching': watching_dict.get(anime_id, False)
        }

    return jsonify(status_dict), 200


@api.route('/anime/sync/top', methods=['POST'])
def sync_anime():
    anime_api = 'https://api.jikan.moe/v4/anime'
    try:
        page = 1
        max_page = 15
        while page <= max_page:
            print(f"Sincronizando página {page}...")
            response = requests.get(anime_api, params={'page': page})
            if response.status_code != 200:
                print(
                    f"Error al obtener la página {page}: {response.status_code}")
                break

            anime_list = response.json().get('data', [])
            print(f"Número de animes en la página {page}: {len(anime_list)}")
            for anime in anime_list:
                if anime.get('score') and anime['score'] >= 7:
                    exists = Anime.query.filter_by(
                        mal_id=anime['mal_id']).first()
                    trailer_data = anime.get('trailer')
                    trailer_url = trailer_data.get(
                        'url') if trailer_data else None
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

            db.session.commit()  # Revisar en fix

            page += 1
            time.sleep(1)

            print(f"{page}")

        return jsonify({"message": "animes sincronizados"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error durante la sincronización: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api.route('/anime/<int:anime_id>/recommendations/genres', methods=['GET'])
def get_genre_recommendations_by_anime_id(anime_id):
    anime = Anime.query.get(anime_id)
    if not anime:
        return jsonify({"message": "Anime not found"}), 404

    genres = anime.genres  # Obtener los géneros del anime actual
    if not genres:
        return jsonify({"recommendations": []}), 200

    genre_ids = [genre.id for genre in genres]

    # Buscar animes que compartan al menos un género y no sean el anime actual
    recommended_animes = (
        db.session.query(Anime)
        .join(Anime.genres)
        .filter(Genre.id.in_(genre_ids), Anime.id != anime_id)
        .group_by(Anime.id)
        .order_by(func.count(Anime.id).desc())
        .limit(5)
        .all()
    )

    serialized_recommendations = [rec.serialize()
                                  for rec in recommended_animes]
    return jsonify({"recommendations": serialized_recommendations}), 200


# Get anime by id - for individual page and searchbar

@api.route('/anime/<int:id>', methods=['GET'])
def get_animeId(id):
    anime = Anime.query.get(id)
    if not anime:
        return jsonify({"error": "Anime no disponible"}), 404
    return jsonify(anime.serialize()), 200


@api.route('/anime/on-air', methods=['POST'])
def create_on_air_anime():
    try:
        api_url = 'https://api.jikan.moe/v4/seasons/now'
        response = requests.get(api_url)
        season_now = response.json()

        for data in season_now['data']:
            check_exist = On_Air.query.filter_by(mal_id=data['mal_id']).first()
            if not check_exist:
                genre_names = [genre['name']
                               for genre in data.get('genres', [])]

                genre_objs = []
                for name in genre_names:
                    genre = Genre.query.filter_by(name=name).first()
                    if not genre:
                        genre = Genre(name=name)
                        db.session.add(genre)
                    genre_objs.append(genre)

                new_on_air = On_Air(
                    mal_id=data['mal_id'],
                    title=data['title'],
                    synopsis=data.get('synopsis'),
                    image_url=data['images']['jpg']['image_url'],
                    score=data.get('score'),
                    airing=data.get('airing', False),
                    genres=genre_objs
                )
                db.session.add(new_on_air)

        db.session.commit()
        return jsonify({"message": "perfecto"}), 200

    except Exception as er:
        db.session.rollback()
        return jsonify({'error': f'ha habido un error: {str(er)}'}), 500


@api.route('/anime/on-air/list', methods=['GET'])
def get_on_air_list():
    on_air_animes = On_Air.query.all()
    return jsonify([anime.serialize() for anime in on_air_animes]), 200

# Favorites


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_all_favorites():
    current_user_id = get_jwt_identity()

    favorites = db.session.query(Favorites, Anime).join(
        Anime, Favorites.anime_id == Anime.id
    ).filter(
        Favorites.user_id == current_user_id
    ).all()

    favorites_list = [{
        "id": item.Favorites.id,
        "anime": item.Anime.serialize(),
        "user_id": item.Favorites.user_id
    } for item in favorites]

    return jsonify(favorites_list), 200


@api.route('/favorites/<int:anime_id>', methods=['POST', 'DELETE'])
@jwt_required()
def handle_favorites(anime_id):
    current_user_id = get_jwt_identity()

    if request.method == 'POST':
        existing = Favorites.query.filter_by(
            user_id=current_user_id,
            anime_id=anime_id
        ).first()

        if existing:
            return jsonify({"message": "Already in favorites"}), 200

        new_fav = Favorites(
            user_id=current_user_id,
            anime_id=anime_id
        )
        db.session.add(new_fav)
        db.session.commit()

        anime = Anime.query.get(anime_id)
        return jsonify({
            "id": new_fav.id,
            "anime": anime.serialize(),
            "user_id": new_fav.user_id
        }), 201

    elif request.method == 'DELETE':
        favorite = Favorites.query.filter_by(
            user_id=current_user_id,
            anime_id=anime_id
        ).first()

        if not favorite:
            return jsonify({"message": "Not found in favorites"}), 404

        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Removed from favorites"}), 200

# Watching


@api.route('/watching', methods=['GET'])
@jwt_required()
def get_all_watching():
    current_user_id = get_jwt_identity()

    watching_items = db.session.query(Watching, Anime).join(
        Anime, Watching.anime_id == Anime.id
    ).filter(
        Watching.user_id == current_user_id
    ).all()

    watching_list = [{
        "id": item.Watching.id,
        "anime": item.Anime.serialize(),
        "user_id": item.Watching.user_id
    } for item in watching_items]

    return jsonify(watching_list), 200


@api.route('/watching/<int:anime_id>', methods=['POST', 'DELETE'])
@jwt_required()
def handle_watching(anime_id):
    current_user_id = get_jwt_identity()

    if request.method == 'POST':
        existing = Watching.query.filter_by(
            user_id=current_user_id,
            anime_id=anime_id
        ).first()

        if existing:
            return jsonify({"message": "Already in watching list"}), 200

        new_watching = Watching(
            user_id=current_user_id,
            anime_id=anime_id
        )
        db.session.add(new_watching)
        db.session.commit()

        anime = Anime.query.get(anime_id)
        return jsonify({
            "id": new_watching.id,
            "anime": anime.serialize(),
            "user_id": new_watching.user_id
        }), 201

    elif request.method == 'DELETE':
        watching = Watching.query.filter_by(
            user_id=current_user_id,
            anime_id=anime_id
        ).first()

        if not watching:
            return jsonify({"message": "Not found in watching list"}), 404

        db.session.delete(watching)
        db.session.commit()
        return jsonify({"message": "Removed from watching list"}), 200

# Authentication


@api.route('/signup', methods=['POST'])
def register_user():
    data = request.get_json()
    if data is None:
        return jsonify({"message": "Email and password are required"}), 400
    email = data['email']
    password = data['password']
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Convertimos la contraseña en un array de bytes.
    bytes = password.encode(CHARACTER_ENCODING)
    salt = bcrypt.gensalt()  # Generamos la sal
    # Sacamos la contraseña ya hasheada.
    hashed_password = bcrypt.hashpw(bytes, salt)
    # Creamos al nuevo usuario con su email y la contraseña hasheada.
    new_user = User()
    email = email,
    # Era esto o guardarlo en el modelo como bytes, pero así es mas fácil de leer.
    password = hashed_password.decode(CHARACTER_ENCODING),
    is_active = True

    hashed_password = bcrypt.hashpw(
        data['password'].encode(CHARACTER_ENCODING),
        bcrypt.gensalt()
    ).decode(CHARACTER_ENCODING)

    new_user = User(
        email=data['email'],
        password=hashed_password,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "message": "User created successfully",
        "access_token": access_token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
        }}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Email and password are required"}), 400
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()

    # Esto compara la contraseña introducida con la del usuario
    if not user or not bcrypt.checkpw(password.encode(CHARACTER_ENCODING), user.password.encode(CHARACTER_ENCODING)):

        return jsonify({"message": "Invalid user or password"}), 401
    # Aquí se crea el token.
    access_token = create_access_token(identity=user.id)

    user = User.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.checkpw(
        data['password'].encode(CHARACTER_ENCODING),
        user.password.encode(CHARACTER_ENCODING)
    ):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
        }
    }), 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active
        }), 200

    except Exception as e:
        print(f"Error en /protected: {str(e)}")
        return jsonify({"error": "Token inválido o expirado"}), 401

# Users


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200


@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()

    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid user ID in token"}), 401

    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized: You can only delete your own account"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    if current_user_id != user_id:
        return jsonify({"message": "You can only delete your own account"}), 403
    db.session.delete(user_to_delete)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# endpoint para userpreferences Animatch


@api.route('/user/preferences', methods=['POST'])
@jwt_required()
def save_user_preferences():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    required_fields = ['genre', 'duration', 'theme', 'tone']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    try:
        # Crear nueva preferencia
        new_pref = UserPreference(
            user_id=current_user_id,
            genre=data['genre'],
            duration=data['duration'],
            theme=data['theme'],
            tone=data['tone']
        )

        db.session.add(new_pref)
        db.session.commit()

        return jsonify({
            "message": "Preferencias guardadas con éxito",
            "preference": new_pref.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al guardar preferencias: {str(e)}"}), 500
