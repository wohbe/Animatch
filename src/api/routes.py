"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Anime, Favorites, On_Air, Genre
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import time
import json

api = Blueprint('api', __name__)
# Permite todas las origenes en desarrollo
CORS(api, resources={r"/api/*": {"origins": "*"}})

# Rate limiting for Jikan API (60 requests per minute)


# endpoint para almacenar datos de api esterna

# anime


@api.route('/anime', methods=['GET'])
def get_animes():
    animes = Anime.query.all()
    return jsonify([anime.serialize() for anime in animes]), 200


@api.route('/anime/sync/top', methods=['POST'])
def sync_anime():
    anime_api = 'https://api.jikan.moe/v4/anime'
    try:
        page = 1
        max_page = 100
        while page <= max_page:
            response = requests.get(anime_api, params={'page': page})
            if response.status_code != 200:
                break

            anime_list = response.json().get('data', [])
            for anime in anime_list:
                if anime.get('score') and anime['score'] >= 7:
                    exists = Anime.query.filter_by(
                        mal_id=anime['mal_id']).first()
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
                            genres=genre_objs
                        )
                        db.session.add(new_anime)
            db.session.commit()
            page += 1

        return jsonify({"message": "animes sincronizados"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/anime/on-air', methods=['POST'])
def get_on_air_anime():
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
                    genres=genre_objs  # relación real
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
