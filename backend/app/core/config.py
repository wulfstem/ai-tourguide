import os
from typing import List

def get_env(name: str, default: str | None = None) -> str | None:
    val = os.getenv(name, default)
    return val

DATABASE_URL: str = get_env("DATABASE_URL", "postgresql+psycopg2://app:app@db:5432/app")  # noqa

# CORS
cors_origins_raw = get_env("CORS_ORIGINS", "*")
if cors_origins_raw == "*" or not cors_origins_raw:
    CORS_ORIGINS: List[str] = ["*"]
else:
    CORS_ORIGINS = [o.strip() for o in cors_origins_raw.split(",")]
