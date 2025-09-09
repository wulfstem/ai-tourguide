FROM python:3.11-slim

# System deps (psycopg2 needs build tools and libpq)
RUN apt-get update && apt-get install -y --no-install-recommends     build-essential libpq-dev curl bash     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy project
COPY app /app/app
COPY alembic /app/alembic
COPY alembic.ini /app/alembic.ini
COPY .env /app/.env

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
