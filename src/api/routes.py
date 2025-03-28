"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Anime, Favorites, Category, On_Air
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import time
import json

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


@api.route('/anime/sync/top', methods=['POST'])
def sync_anime():
    try:
        response = requests.get('https://api.jikan.moe/v4/top/anime?limit=150')
        data = response.json()

        anime_data = data['data'][:150]

        for anime_item in anime_data:
            existing_anime = Anime.query.filter_by(
                mal_id=anime_item['mal_id']).first()

            if not existing_anime:
                genres = [genre['name']
                          for genre in anime_item.get('genres', [])]

                new_anime = Anime(
                    mal_id=anime_item['mal_id'],
                    title=anime_item['title'],
                    synopsis=anime_item['synopsis'],
                    image_url=anime_item['images']['jpg']['image_url'],
                    episodes=anime_item['episodes'],
                    score=anime_item['score'],
                    airing=anime_item['airing'],
                    genres=json.dumps(genres)

                )

                db.session.add(new_anime)

                db.session.commit()

                return jsonify({"message": "Anime syncronized"})

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
