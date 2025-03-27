from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    favorites: Mapped[List["Favorites"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "favorites": [fav.anime.serialize() for fav in self.favorites]
            # do not serialize the password, its a security breach
        }


class Anime(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    mal_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    synopsis: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    episodes: Mapped[int] = mapped_column(Integer, nullable=True)
    score: Mapped[float] = mapped_column(nullable=True)
    favorites: Mapped[List["Favorites"]] = relationship(back_populates="anime")
    on_air: Mapped[List["On_Air"]] = relationship(back_populates="anime")

    def serialize(self):
        return {
            "id": self.id,
            "mal_id": self.mal_id,
            "title": self.title,
            "synopsis": self.synopsis,
            "image_url": self.image_url,
            "episodes": self.episodes,
            "score": self.score,
           # "favorited_by": [fav.user_id for fav in self.favorites]
           # Se podría plantear si nos interesa poder acceder para ver la popularidad interna
        }

class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    # Estos datos en la tabla se reciben de otras tablas
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    anime_id: Mapped[int] = mapped_column(ForeignKey('anime.id'), nullable=False)

    # Estas relaciones se realizan de vuelta a las tablas
    user: Mapped["User"] = relationship(back_populates="favorites")
    anime: Mapped["Anime"] = relationship(back_populates="favorites")

    # Devuelve un diccionario para el ENDPOINT de favoritos
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "anime_id": self.anime_id
        }
    
class On_Air(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # Estos dato se reciben de otra tabla y se mandan de vuelta
    anime_id: Mapped[int] = mapped_column(ForeignKey('anime.id'), nullable=False)
    anime: Mapped["Anime"] = relationship(back_populates="on_air")

    # Devuelve un diccionario para el ENDPOINT de animes en emisión (no requiere el user_id)
    def serialize(self):
        return {
            "id": self.id,
            "anime_id": self.anime_id
        }