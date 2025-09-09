from pydantic import BaseModel, Field
from typing import Optional

class CityBase(BaseModel):
    id: str = Field(..., max_length=10)
    title: str = Field(..., max_length=100)
    country: str = Field(..., max_length=100)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    population: Optional[int] = None

class CityCreate(CityBase):
    pass  # Inherits all fields

class CityUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    population: Optional[int] = None

class CityOut(CityBase):
    class Config:
        from_attributes = True
