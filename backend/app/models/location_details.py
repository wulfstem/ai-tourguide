from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship

from app.core.db import Base

class LocationDetails(Base):
    __tablename__ = "location_details"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False, index=True, unique=True)
    city_id = Column(String(10), nullable=False, index=True)  # e.g., "VNO", "NYC", "LON"
    object_name = Column(String(200), nullable=False, index=True)  # e.g., "Gediminas Castle Tower"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    location = relationship("Location", back_populates="details")