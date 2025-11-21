# app/routers/places.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.database import get_db
from app import models 

router = APIRouter(
    prefix="/places",
    tags=["places"],
)


@router.post("/", response_model=schemas.PlaceOut)
def create_place(
    place_in: schemas.PlaceCreate,
    db: Session = Depends(get_db),
):
    place = models.Place(
        name=place_in.name,
        latitude=place_in.latitude,
        longitude=place_in.longitude,
    )
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


@router.get("/", response_model=List[schemas.PlaceOut])
def list_places(db: Session = Depends(get_db)):
    return db.query(models.Place).all()


@router.get("/{place_id}", response_model=schemas.PlaceOut)
def get_place(place_id: int, db: Session = Depends(get_db)):
    place = db.query(models.Place).filter(models.Place.id == place_id).first()
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return place
