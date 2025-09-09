
# FastAPI + PostgreSQL (Locations) — Starter

This is a minimal, production-friendly starter for an Expo/React Native app backend.

## What you get
- FastAPI with CORS ready
- PostgreSQL with SQLAlchemy ORM
- Alembic migrations
- Dockerized dev environment
- Locations CRUD with pagination and filtering

## Quick start
```bash
# 1) Start services
docker compose up --build -d

# 2) Create DB tables via Alembic
docker compose exec api alembic revision --autogenerate -m "init"
docker compose exec api alembic upgrade head

# 3) (Optional) Seed sample data
docker compose exec api python -m app.scripts.seed

# 4) Hit the API
curl http://localhost:8000/healthz
curl "http://localhost:8000/locations?limit=5"
```

API docs: http://localhost:8000/docs
