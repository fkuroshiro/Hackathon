from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime


# -------------------------
# Faction Model
# -------------------------
class Faction(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None  # optional: path or URL to icon


# -------------------------
# Place Model
# -------------------------
class Place(BaseModel):
    id: Optional[str] = None

    name: str
    type: str  # "shop", "restaurant", "cafe", etc.
    description: Optional[str] = None

    latitude: float
    longitude: float

    reward_xp: int = 0
    faction: Optional[str] = None  # name of faction rewarded

    created_by_user: Optional[str] = None  # user ID


# -------------------------
# Event Model
# -------------------------
class Event(BaseModel):
    id: Optional[str] = None

    name: str
    description: Optional[str] = None

    latitude: float
    longitude: float

    start_time: datetime
    end_time: datetime

    reward_xp: int = 0
    faction: Optional[str] = None  # which faction this event belongs to

    is_quest_related: bool = False


# -------------------------
# Quest Model
# -------------------------
class Quest(BaseModel):
    id: Optional[str] = None

    title: str
    description: Optional[str] = None

    latitude: float
    longitude: float

    reward_xp: int
    reward_faction: Optional[str] = None
    reward_faction_xp: int = 0

    event_id: Optional[str] = None  # if this quest belongs to an event


# -------------------------
# User Model
# -------------------------
class User(BaseModel):
    id: Optional[str] = None

    username: str
    level: int = 1
    xp: int = 0

    factions: Dict[str, int] = Field(default_factory=dict)
    # Example:
    # {
    #     "culture": 20,
    #     "sports": 10,
    #     "local_business": 5
    # }

    completed_quests: List[str] = Field(default_factory=list)  # quest IDs
    created_places: List[str] = Field(default_factory=list)     # place IDs
