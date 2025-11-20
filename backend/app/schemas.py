# app/schemas.py
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ---------- USER SCHEMAS ----------

class UserBase(BaseModel):
    display_name: str


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 (or orm_mode = True for v1)


# ---------- EVENT SCHEMAS ----------

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    time_start: datetime
    time_end: Optional[datetime] = None


class EventCreate(EventBase):
    created_by_id: int = Field(..., description="ID of user creating the event")


class EventOut(EventBase):
    id: int
    created_by_id: int
    attendees: List[UserOut] = []

    class Config:
        from_attributes = True  # Pydantic v2 (or orm_mode = True for v1)


class EventJoinRequest(BaseModel):
    user_id: int


# ---------- PLACE / QUEST (stubs for now) ----------

class PlaceBase(BaseModel):
    name: str
    latitude: float
    longitude: float


class PlaceCreate(PlaceBase):
    pass


class PlaceOut(PlaceBase):
    id: int

    class Config:
        from_attributes = True


class QuestBase(BaseModel):
    name: str
    description: Optional[str] = None


class QuestCreate(QuestBase):
    pass


class QuestOut(QuestBase):
    id: int

    class Config:
        from_attributes = True
