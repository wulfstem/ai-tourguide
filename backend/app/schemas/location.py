from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class CategoryEnum(str, Enum):
    TOURIST = "T"
    #MUSEUM = "M"
    #ART = "A"
    #FOOD = "F"
    #SPECIAL = "S"

class LocationBase(BaseModel):
    category: CategoryEnum
    title: str = Field(..., min_length=1, max_length=200)
    latitude: float
    longitude: float
    city_id: str = Field(..., max_length=10)

class LocationCreate(LocationBase):
    pass  # Inherits all fields from LocationBase

class LocationUpdate(BaseModel):
    category: Optional[str] = Field(None, min_length=1, max_length=1)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city_id: Optional[str] = Field(None, max_length=10)

class LocationOut(LocationBase):
    id: int
    city_id: str
    created_at: datetime  # Added the missing field from your model

    class Config:
        from_attributes = True