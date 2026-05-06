from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LocationDetailsBase(BaseModel):
    city_id: str
    object_name: str

class LocationDetailsCreate(LocationDetailsBase):
    location_id: int

class LocationDetailsUpdate(LocationDetailsBase):
    pass

class LocationDetailsResponse(LocationDetailsBase):
    id: int
    location_id: int
    created_at: datetime
    updated_at: datetime
    
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    description_url: Optional[str] = None

    class Config:
        from_attributes = True