from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.core.db import get_db
from app.models.city import City
from app.schemas.city import CityCreate, CityUpdate, CityOut

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("", response_model=List[CityOut])
def list_cities(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(default=None, description="search in title or country"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(City)
    if q:
        ilike = f"%{q}%"
        stmt = stmt.where((City.title.ilike(ilike)) | (City.country.ilike(ilike)))
    stmt = stmt.order_by(City.id).limit(limit).offset(offset)
    rows = db.execute(stmt).scalars().all()
    return rows


@router.get("/{city_id}", response_model=CityOut)
def get_city(city_id: str, db: Session = Depends(get_db)):
    obj = db.get(City, city_id)
    if not obj:
        raise HTTPException(status_code=404, detail="City not found")
    return obj


@router.post("", response_model=CityOut, status_code=201)
def create_city(payload: CityCreate, db: Session = Depends(get_db)):
    obj = City(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{city_id}", response_model=CityOut)
def update_city(city_id: str, payload: CityUpdate, db: Session = Depends(get_db)):
    obj = db.get(City, city_id)
    if not obj:
        raise HTTPException(status_code=404, detail="City not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{city_id}", status_code=204)
def delete_city(city_id: str, db: Session = Depends(get_db)):
    obj = db.get(City, city_id)
    if not obj:
        raise HTTPException(status_code=404, detail="City not found")
    db.delete(obj)
    db.commit()
    return None


@router.get("/count/all")
def count_cities(db: Session = Depends(get_db)):
    total = db.execute(select(func.count()).select_from(City)).scalar_one()
    return {"count": total}
