from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.location_details import LocationDetails
from app.schemas.location_details import (
    LocationDetailsResponse, 
    LocationDetailsCreate, 
    LocationDetailsUpdate
)

router = APIRouter()

def construct_file_urls(details: LocationDetails) -> dict:
    """Helper function to construct file paths"""
    folder_path = f"static/audio-files/{details.city_id}/{details.object_name}"
    return {
        "audio_url": f"/{folder_path}/audio.mp3",
        "image_url": f"/{folder_path}/image.jpg",
        "description_url": f"/{folder_path}/description.txt"
    }

@router.post("/details", response_model=LocationDetailsResponse, status_code=status.HTTP_201_CREATED)
def create_location_details(
    details_data: LocationDetailsCreate, 
    db: Session = Depends(get_db)
):
    """Create new location details"""
    # Check if location exists
    from app.models.location import Location
    location = db.query(Location).filter(Location.id == details_data.location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Check if details already exist for this location
    existing_details = db.query(LocationDetails).filter(
        LocationDetails.location_id == details_data.location_id
    ).first()
    if existing_details:
        raise HTTPException(
            status_code=400, 
            detail="Details already exist for this location"
        )
    
    # Create new details
    db_details = LocationDetails(**details_data.model_dump())
    db.add(db_details)
    db.commit()
    db.refresh(db_details)
    
    # Construct response with file URLs
    file_urls = construct_file_urls(db_details)
    
    return LocationDetailsResponse(
        **db_details.__dict__,
        **file_urls
    )

@router.get("/{location_id}/details", response_model=LocationDetailsResponse)
def get_location_details(location_id: int, db: Session = Depends(get_db)):
    """Get location details by location ID"""
    details = db.query(LocationDetails).filter(
        LocationDetails.location_id == location_id
    ).first()
    
    if not details:
        raise HTTPException(status_code=404, detail="Location details not found")
    
    # Construct file URLs
    file_urls = construct_file_urls(details)
    
    return LocationDetailsResponse(
        **details.__dict__,
        **file_urls
    )

@router.get("/details", response_model=List[LocationDetailsResponse])
def get_all_location_details(db: Session = Depends(get_db)):
    """Get all location details"""
    details_list = db.query(LocationDetails).all()
    
    result = []
    for details in details_list:
        file_urls = construct_file_urls(details)
        result.append(LocationDetailsResponse(
            **details.__dict__,
            **file_urls
        ))
    
    return result

@router.put("/{location_id}/details", response_model=LocationDetailsResponse)
def update_location_details(
    location_id: int,
    details_data: LocationDetailsUpdate,
    db: Session = Depends(get_db)
):
    """Update location details"""
    details = db.query(LocationDetails).filter(
        LocationDetails.location_id == location_id
    ).first()
    
    if not details:
        raise HTTPException(status_code=404, detail="Location details not found")
    
    # Update fields
    update_data = details_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(details, field, value)
    
    db.commit()
    db.refresh(details)
    
    # Construct response with file URLs
    file_urls = construct_file_urls(details)
    
    return LocationDetailsResponse(
        **details.__dict__,
        **file_urls
    )

@router.delete("/{location_id}/details", status_code=status.HTTP_204_NO_CONTENT)
def delete_location_details(location_id: int, db: Session = Depends(get_db)):
    """Delete location details"""
    details = db.query(LocationDetails).filter(
        LocationDetails.location_id == location_id
    ).first()
    
    if not details:
        raise HTTPException(status_code=404, detail="Location details not found")
    
    db.delete(details)
    db.commit()
    
    return None

@router.delete("/details/{details_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location_details_by_id(details_id: int, db: Session = Depends(get_db)):
    """Delete location details by details ID"""
    details = db.query(LocationDetails).filter(LocationDetails.id == details_id).first()
    
    if not details:
        raise HTTPException(status_code=404, detail="Location details not found")
    
    db.delete(details)
    db.commit()
    
    return None