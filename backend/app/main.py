from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routers.locations import router as locations_router
from app.api.routers.cities import router as cities_router
from app.api.routers.location_details import router as location_details_router
from app.core.config import CORS_ORIGINS

app = FastAPI(title="Locations and Cities API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthcheck():
    return {"status": "ok"}

app.include_router(locations_router)
app.include_router(cities_router)
app.include_router(location_details_router, prefix="/api/locations", tags=["location-details"])
app.mount("/static", StaticFiles(directory="app/static"), name="static")
