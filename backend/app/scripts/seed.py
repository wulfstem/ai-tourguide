from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import SessionLocal
from app.models.location import Location

SAMPLE = [
    {"title": "Blue Bottle Coffee", "category": "cafe", "latitude": 37.7764, "longitude": -122.4231},
    {"title": "Mama's Pizza", "category": "restaurant", "latitude": 37.7810, "longitude": -122.4110},
    {"title": "City Library", "category": "library", "latitude": 37.7792, "longitude": -122.4155},
]

def main():
    db: Session = SessionLocal()
    try:
        count = db.execute(select(Location)).scalars().count()
    except Exception:
        count = 0
    if not count:
        for row in SAMPLE:
            db.add(Location(**row))
        db.commit()
        print(f"Inserted {len(SAMPLE)} rows.")
    else:
        print("DB already has data; skipping.")
    db.close()

if __name__ == "__main__":
    main()
