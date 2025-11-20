# app/routers/events.py
from math import radians, cos, sin, asin, sqrt
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/events",
    tags=["events"],
)


def haversine_km(lat1, lon1, lat2, lon2) -> float:
    """
    Calculate the great-circle distance between two points
    on the Earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    R = 6371.0  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))

    return R * c


@router.post("/", response_model=schemas.EventOut)
def create_event(
    event_in: schemas.EventCreate,
    db: Session = Depends(get_db),
):
    # Ensure creator exists
    creator = db.query(models.User).filter(models.User.id == event_in.created_by_id).first()
    if creator is None:
        raise HTTPException(status_code=400, detail="Creator user does not exist")

    event = models.Event(
        title=event_in.title,
        description=event_in.description,
        latitude=event_in.latitude,
        longitude=event_in.longitude,
        time_start=event_in.time_start,
        time_end=event_in.time_end,
        created_by_id=event_in.created_by_id,
    )

    event.attendees.append(creator)  # creator auto-joins
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/nearby", response_model=List[schemas.EventOut])
def get_nearby_events(
    lat: float,
    lng: float,
    radius_km: float = 5.0,
    db: Session = Depends(get_db),
):
    """
    Very simple implementation:
    - load all events
    - filter in Python by Haversine distance
    This is fine for a hackathon-scale app.
    """
    events = db.query(models.Event).all()
    nearby = []

    for ev in events:
        dist = haversine_km(lat, lng, ev.latitude, ev.longitude)
        if dist <= radius_km:
            nearby.append(ev)

    return nearby


@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/{event_id}/join", response_model=schemas.EventOut)
def join_event(
    event_id: int,
    body: schemas.EventJoinRequest,
    db: Session = Depends(get_db),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    user = db.query(models.User).filter(models.User.id == body.user_id).first()
    if user is None:
        raise HTTPException(status_code=400, detail="User does not exist")

    if user not in event.attendees:
        event.attendees.append(user)
        db.commit()
        db.refresh(event)

    return event
