from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.core.db import get_db
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationOut, LocationUpdate

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("", response_model=List[LocationOut])
def list_locations(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
    city_id: Optional[str] = None,  # <-- new filter
    q: Optional[str] = Query(default=None, description="search in title"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Location)
    if category:
        stmt = stmt.where(Location.category == category)
    if city_id:
        stmt = stmt.where(Location.city_id == city_id)  # <-- filter by city
    if q:
        ilike = f"%{q}%"
        stmt = stmt.where(Location.title.ilike(ilike))
    stmt = stmt.order_by(Location.id).limit(limit).offset(offset)
    rows = db.execute(stmt).scalars().all()
    return rows

@router.get("/{location_id}", response_model=LocationOut)
def get_location(location_id: int, db: Session = Depends(get_db)):
    obj = db.get(Location, location_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Location not found")
    return obj

@router.post("", response_model=LocationOut, status_code=201)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    obj = Location(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/count/all")
def count_locations(db: Session = Depends(get_db)):
    total = db.execute(select(func.count()).select_from(Location)).scalar_one()
    return {"count": total}

@router.put("/{location_id}", response_model=LocationOut)
def update_location(location_id: int, payload: LocationUpdate, db: Session = Depends(get_db)):
    obj = db.get(Location, location_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Location not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{location_id}", status_code=204)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    obj = db.get(Location, location_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(obj)
    db.commit()
    return None
