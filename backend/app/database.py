from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

# =============================
# MODELS
# =============================

class Faction(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""

class Place(BaseModel):
    id: str
    name: str
    type: str  # shop, restaurant, etc.
    description: Optional[str] = ""
    latitude: float
    longitude: float
    faction_reward: Optional[str] = None
    xp_reward: int = 0

# Mock database
places_db = {}

# =============================
# ENDPOINTS
# =============================

# ---------------------------------------------------------
# Get a list of all places (shops, restaurants, points)
# ---------------------------------------------------------
@app.get("/places", response_model=List[Place])
def get_places():
    return list(places_db.values())


# ---------------------------------------------------------
# Create a new place (adds new shop/restaurant/event pin)
# ---------------------------------------------------------
@app.post("/places", response_model=Place)
def create_place(place: Place):
    if place.id in places_db:
        raise HTTPException(status_code=400, detail="Place already exists")

    places_db[place.id] = place
    return place


# ---------------------------------------------------------
# Get a specific place by its ID
# ---------------------------------------------------------
@app.get("/places/{id}", response_model=Place)
def get_place(id: str):
    if id not in places_db:
        raise HTTPException(status_code=404, detail="Place not found")

    return places_db[id]
