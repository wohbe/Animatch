"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Anime
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests

api = Blueprint('api', __name__)
# Permite todas las origenes en desarrollo
CORS(api, resources={r"/api/*": {"origins": "*"}})

# endpoint para almacenar datos de api externa

#anime
@api.route('/anime', methods=['GET'])
def get_animes():
    animes = Anime.query.all()
    return jsonify([anime.serialize() for anime in animes]), 200


@api.route('/anime/sync', methods=['POST'])
def sync_animes():
    try:
        # Fetch desde Jikan API
        response = requests.get('https://api.jikan.moe/v4/seasons/now')
        data = response.json()

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

        db.session.commit()
        return jsonify({"message": "Animes synchronized successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
