# 🎌 Animatch

<div align="center">
  <img src="https://github.com/4GeeksAcademy/spain-fs-pt-95-g1/blob/main/src/front/assets/img/animatch.png?raw=true" alt="Animatch Logo" width="200"/>
  
  **Tu asistente personal para descubrir el anime perfecto**
  
  [![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
  [![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)](https://flask.palletsprojects.com/)
  [![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
</div>

## 📖 ¿Qué es Animatch?

Animatch es una aplicación web que te ayuda a encontrar tu próximo anime favorito a través de un sistema inteligente de preguntas y respuestas. Con una extensa base de datos de anime de alta calidad, Animatch filtra y recomienda series basándose en tus preferencias personales.

## ✨ Características Principales

- 🎯 **Sistema de Recomendación Inteligente**: Preguntas diseñadas para entender tus gustos
- ⭐ **Solo Calidad Premium**: Únicamente recomendamos animes con puntuaciones altas
- 📊 **Base de Datos Extensa**: Miles de animes catalogados y clasificados
- ❤️ **Lista de Favoritos**: Guarda tus animes preferidos
- ✅ **Seguimiento de Visualización**: Marca los animes que ya has visto

## 🛠️ Stack Tecnológico

### Frontend
- **React.js** - Framework principal
- **React Router** - Navegación SPA
- **Context API/Redux** - Gestión de estado
- **CSS Modules/Styled Components** - Estilos
- **React Query** - Cache y sincronización de datos

### Backend
- **Flask** - Framework web Python
- **Flask-RESTful** - API REST
- **SQLAlchemy** - ORM
- **PostgreSQL** - Base de datos principal
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Gestión de CORS

### APIs Externas
- **MyAnimeList API** / **AniList API** - Datos de anime
- **Jikan API** - Información adicional

## 🚀 Instalación Rápida

### Prerrequisitos

- Python 3.10+
- Node.js 16+
- PostgreSQL 13+
- Git

### Configuración del Proyecto

1. **Clonar el repositorio**:
```bash
git clone https://github.com/wohbe/Animatch.git
cd Animatch
```

2. **Configurar el archivo .env**:
```bash
cp .env.example .env
```

⚠️ **IMPORTANTE**: Edita el archivo `.env` y configura la `JWT_SECRET_KEY`:
```env
JWT_SECRET_KEY=cualquier-clave-secreta-que-quieras
```

3. **Instalar dependencias del Backend**:
```bash
pipenv install
```

4. **Instalar dependencias del Frontend**:
```bash
cd src/front
npm install
cd ..
```

### ▶️ Ejecutar la Aplicación

Necesitarás **dos terminales** activas:

**Terminal 1 - Backend:**
```bash
pipenv run start
```
El backend correrá en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run start
```
La aplicación se abrirá en `http://localhost:3000`

¡Listo! 🎉 La aplicación ya debería estar funcionando.

## 🎮 Cómo Funciona

1. **Registro/Login**: Crea tu cuenta o inicia sesión
2. **Cuestionario Inicial**: Responde preguntas sobre tus preferencias
   - Géneros favoritos
   - Duración preferida
   - Temas que te interesan
3. **Recomendaciones**: Recibe sugerencias personalizadas
4. **Gestión**: 
   - ❤️ Añade a favoritos
   - ✅ Marca como visto
   - 🔄 Obtén nuevas recomendaciones

## 📝 Roadmap

- [ ] Ampliación de la base de datos de anime
- [ ] Sistema de recomendación colaborativo
- [ ] App móvil nativa
- [ ] Recomendaciones de manga
- [ ] Sistema de amigos y compartir listas
- [ ] Notificaciones de nuevos episodios
- [ ] Modo oscuro

## 👨‍💻 Autores

**Roberto Cantalejo** - [@wohbe](https://github.com/wohbe), **Domenico Puzone** - [@domeseo](https://github.com/domeseo), **David Lizarte** [@deividliz](https://github.com/deividliz) y **Juan Pinto** [@BowserZ](https://github.com/BowserZ).

[LinkedIn](https://www.linkedin.com/in/roberto-cantalejo/)

## 🙏 Agradecimientos

- APIs de anime por proporcionar los datos
- Comunidad open source
- [4Geeks Academy](https://4geeksacademy.com/) por el template base
