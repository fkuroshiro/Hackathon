# app/schemas.py
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# ======================
# USER & PHOTOS
# ======================

class UserPhotoOut(BaseModel):
    id: int
    image_url: str

    # Pydantic v2 style config
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    display_name: str


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int
    avatar_url: Optional[str] = None #avatar picture url
    photos: List[UserPhotoOut] = [] #list of user's photos
    total_xp: int  
    level: int  
    category_stats: List[UserCategoryStatOut] = [] #list of user's category stats

    reputation_score: int # rep

    model_config = ConfigDict(from_attributes=True)
    


# ======================
# EVENTS
# ======================

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    latitude: float # event latitude
    longitude: float # event longitude
    time_start: datetime
    time_end: Optional[datetime] = None 
    category: Optional[str] = None # event category

    #official event and reward parameters
    is_official: bool = False
    reward_text: Optional[str] = None


class EventCreate(EventBase):
    created_by_id: int = Field(..., description="ID of user creating the event")


class EventOut(EventBase):
    id: int
    created_by_id: int
    attendees: List[UserOut] = []

    model_config = ConfigDict(from_attributes=True)


class EventJoinRequest(BaseModel):
    user_id: int


# ======================
# PLACES
# ======================

class PlaceBase(BaseModel):
    name: str
    latitude: float
    longitude: float


class PlaceCreate(PlaceBase):
    pass


class PlaceOut(PlaceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ======================
# QUESTS
# ======================

class QuestBase(BaseModel):
    name: str
    description: Optional[str] = None


class QuestCreate(QuestBase):
    pass


class QuestOut(QuestBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ======================
# USER CATEGORY STATS
# ======================
class UserCategoryStatOut(BaseModel):
    category: str
    xp: int
    level: int

    model_config = ConfigDict(from_attributes=True)
