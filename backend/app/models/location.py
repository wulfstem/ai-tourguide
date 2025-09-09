from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, Index, func

from app.core.db import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(1), nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    city_id = Column(String(10), ForeignKey("cities.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_locations_city_id", "city_id"),
    )