"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Anime, Favorites, Category, On_Air
from api.models import db, User, Anime, Favorites, Category, On_Air
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import time

api = Blueprint('api', __name__)
# Permite todas las origenes en desarrollo
CORS(api, resources={r"/api/*": {"origins": "*"}})

# Rate limiting for Jikan API (60 requests per minute)


def wait_for_rate_limit():
    time.sleep(1)  # Wait 1 second between requests

# endpoint para almacenar datos de api esterna

# anime


@api.route('/anime', methods=['GET'])
def get_animes():
    animes = Anime.query.all()
    return jsonify([anime.serialize() for anime in animes]), 200


@api.route('/anime/sync', methods=['POST'])
def sync_animes():
    try:
        genres_response = requests.get('https://api.jikan.moe/v4/genres/anime')
        genres_data = genres_response.json()

        # Guarda las categorias en la base de datos
        for genre in genres_data['data']:
            existing_category = Category.query.filter_by(
                mal_id=genre['mal_id']).first()
            if not existing_category:
                new_category = Category(
                    name=genre['name'],
                    mal_id=genre['mal_id']
                )
                db.session.add(new_category)

        db.session.commit()

        # Obtiene los animes en emision actual
        wait_for_rate_limit()
        on_air_response = requests.get('https://api.jikan.moe/v4/seasons/now')
        on_air_data = on_air_response.json()

        # Elimina las entradas existentes de On_Air
        On_Air.query.delete()

        # Agrega los animes en emision actual a On_Air y almacena sus categorias
        if 'data' in on_air_data:
            for anime_data in on_air_data['data']:
                # Primero asegura que el anime exista en nuestra base de datos
                existing_anime = Anime.query.filter_by(
                    mal_id=anime_data['mal_id']).first()
                if not existing_anime:
                    existing_anime = Anime(
                        mal_id=anime_data['mal_id'],
                        title=anime_data['title'],
                        synopsis=anime_data['synopsis'],
                        image_url=anime_data['images']['jpg']['image_url'],
                        episodes=anime_data['episodes'],
                        score=anime_data['score']
                    )
                    db.session.add(existing_anime)
                    db.session.flush()

                # Agrega a On_Air
                on_air = On_Air(anime_id=existing_anime.id)
                db.session.add(on_air)

                # Agrega las categorias del anime
                if 'genres' in anime_data:
                    for genre in anime_data['genres']:
                        category = Category.query.filter_by(
                            mal_id=genre['mal_id']).first()
                        if category and category not in existing_anime.categories:
                            existing_anime.categories.append(category)

        db.session.commit()

        # Para cada categoria que tiene animes en emision, obtiene mas animes
        for category in Category.query.all():
            if len(category.animes) > 0:  # Solo obtiene para categorias que tienen animes en emision
                wait_for_rate_limit()  # Respetar los limites de la API

                # Obtiene los animes por genero
                response = requests.get(
                    f'https://api.jikan.moe/v4/anime?genres={category.mal_id}&limit=25')
                data = response.json()

                if 'data' in data:
                    for anime_data in data['data']:
                        existing_anime = Anime.query.filter_by(
                            mal_id=anime_data['mal_id']).first()

                        if not existing_anime:
                            new_anime = Anime(
                                mal_id=anime_data['mal_id'],
                                title=anime_data['title'],
                                synopsis=anime_data['synopsis'],
                                image_url=anime_data['images']['jpg']['image_url'],
                                episodes=anime_data['episodes'],
                                score=anime_data['score']
                            )
                            db.session.add(new_anime)
                            db.session.flush()  # Get the ID of the new anime
                            new_anime.categories.append(category)
                        else:
                            # Si el anime existe pero no tiene esta categoria, agrégala
                            if category not in existing_anime.categories:
                                existing_anime.categories.append(category)

                db.session.commit()
                db.session.commit()

        return jsonify({"message": "Animes, categories and on-air status synchronized successfully"}), 200
        return jsonify({"message": "Animes, categories and on-air status synchronized successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# favorites

@api.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorites.query.all()
    return jsonify([favorite.serialize() for favorite in favorites]), 200


@api.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.json
    favorite = Favorites(
        user_id=data['user_id'],
        anime_id=data['anime_id']
    )
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite added successfully"}), 200


@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    favorite = Favorites.query.get(favorite_id)
    if not favorite:
        return jsonify({"message": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite deleted successfully"}), 200


# endpoint para categorias de anime
@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": category.id,
        "name": category.name,
        "mal_id": category.mal_id,
        "anime_count": len(category.animes)
    } for category in categories]), 200


@api.route('/categories/<int:category_id>/anime', methods=['GET'])
def get_anime_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    return jsonify([anime.serialize() for anime in category.animes]), 200


@api.route('/categories/sync', methods=['POST'])
def sync_categories():
    try:
        # Obtiene las categorias de la API
        genres_response = requests.get('https://api.jikan.moe/v4/genres/anime')
        genres_data = genres_response.json()

        # Guarda las categorias en la base de datos
        for genre in genres_data['data']:
            existing_category = Category.query.filter_by(
                mal_id=genre['mal_id']).first()
            if not existing_category:
                new_category = Category(
                    name=genre['name'],
                    mal_id=genre['mal_id']
                )
                db.session.add(new_category)

        db.session.commit()
        return jsonify({"message": "Categories synchronized successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
