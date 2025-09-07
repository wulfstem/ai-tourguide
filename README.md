# AI Tour Guide

A full-stack location-based mobile application built with modern technologies, featuring a React Native frontend and FastAPI backend with PostgreSQL database, all containerized with Docker.

## 🛠️ Technology Stack

### Frontend

- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript for better code quality
- **Expo Router** - File-based navigation system

### Backend

- **FastAPI** - High-performance Python web framework with automatic API documentation
- **PostgreSQL 15** - Production-grade relational database
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Alembic** - Database migration tool for version control of schema changes
- **Pydantic** - Data validation using Python type annotations

### DevOps & Infrastructure

- **Docker** & **Docker Compose** - Containerization and orchestration
- **uvicorn** - ASGI server for FastAPI
- **psycopg2** - PostgreSQL adapter for Python

## 🏗️ Architecture

This project follows a **monorepo structure** with clear separation of concerns:

```
ai-tourguide/
├── frontend/              # React Native/Expo mobile app
│   ├── app/              # Expo Router pages
│   ├── components/       # Reusable UI components
│   └── assets/           # Images, fonts, etc.
├── backend/              # FastAPI server
│   ├── app/
│   │   ├── api/routers/  # API endpoint definitions
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── schemas/      # Pydantic data validation schemas
│   │   └── core/         # Database and configuration
│   └── alembic/          # Database migrations
├── docker-compose.yml    # Multi-service orchestration
└── README.md
```

## 🚀 Features

- **RESTful API** with automatic OpenAPI documentation
- **Database migrations** with version control
- **Type-safe data validation** on both frontend and backend
- **Containerized development environment** for consistent setup
- **Production-ready architecture** with proper separation of concerns

## 📊 Database Schema

The application uses a PostgreSQL database with the following structure:

**Locations Table:**

- `id` (Primary Key)
- `title` (String, indexed)
- `category` (Single character code, indexed)
- `latitude` (Float, indexed)
- `longitude` (Float, indexed)
- `created_at` (Timestamp with timezone)

**Optimizations:**

- Composite index on `(category, title)` for efficient filtering
- Individual indexes on frequently queried fields

## 🐳 Docker Configuration

The application runs in a multi-container environment:

- **Database Container**: PostgreSQL 15 with persistent volume storage
- **API Container**: FastAPI with hot-reload for development
- **Health checks** ensure proper startup sequence

Key Docker features implemented:

- **Volume persistence** for database data
- **Service dependency management**
- **Environment variable configuration**
- **Port mapping** for local development

## 🔧 Development Setup

### Prerequisites

- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ai-tourguide
   ```

2. **Start the development environment:**

   ```bash
   docker-compose up --build
   ```

3. **Access the services:**
   - **API Documentation**: http://localhost:8000/docs
   - **API Endpoints**: http://localhost:8000
   - **Database**: localhost:5432

### Database Operations

```bash
# Run database migrations
docker exec -it ai-tourguide-api-1 alembic upgrade head

# Create new migration
docker exec -it ai-tourguide-api-1 alembic revision --autogenerate -m "description"

# Connect to database
docker exec -it ai-tourguide-db-1 psql -U app -d app
```

## 📱 API Endpoints

### Locations

- `GET /locations` - Retrieve all locations
- `POST /locations` - Create new location
- `GET /locations/{id}` - Get specific location
- `PUT /locations/{id}` - Update location
- `DELETE /locations/{id}` - Delete location

**Example Request:**

```json
{
  "title": "Vilnius Cathedral",
  "category": "R",
  "latitude": 54.6857,
  "longitude": 25.2879
}
```

## 🔍 Technical Highlights

### Backend Architecture

- **Dependency Injection** pattern for database sessions
- **Schema validation** with Pydantic models
- **Database relationship mapping** with SQLAlchemy
- **Automatic API documentation** generation
- **CORS configuration** for cross-origin requests

### Database Design

- **Migration-based schema management** for production deployments
- **Optimized indexing strategy** for location-based queries
- **Timezone-aware timestamps** for data consistency

### Containerization

- **Multi-stage builds** for optimized production images
- **Environment-specific configurations**
- **Service orchestration** with proper startup dependencies
- **Volume management** for data persistence

## 🚀 Production Considerations

This application is designed with production deployment in mind:

- **Environment variable configuration** for sensitive data
- **Database connection pooling** through SQLAlchemy
- **Structured logging** for monitoring and debugging
- **Health check endpoints** for load balancer integration
- **Docker optimization** for efficient resource usage

## 📝 Development Practices

- **Type safety** throughout the application stack
- **Database schema versioning** with migration files
- **API contract definition** with OpenAPI/Swagger
- **Containerized development** for environment consistency
- **Separation of concerns** with clean architecture patterns

## 🔧 Technologies Demonstrated

This project showcases proficiency in:

- **Full-stack development** with modern Python and TypeScript
- **Container orchestration** with Docker Compose
- **Database design and migration management**
- **RESTful API development** with automatic documentation
- **Mobile app development** with React Native/Expo
- **Production-ready architecture patterns**
- **Development workflow optimization**
