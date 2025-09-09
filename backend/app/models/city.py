from sqlalchemy import Column, String, Float, Integer
from app.core.db import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(String(10), primary_key=True)
    title = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    population = Column(Integer, nullable=True)