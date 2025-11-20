from __future__ import annotations

from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database import Base

# Shared association table between users and events
event_attendees = Table(
    "event_attendees",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("event_id", Integer, ForeignKey("events.id"), primary_key=True),
)

# Import model classes so "from app import models" still works
from .user import User
from .photo import UserPhoto
from .category_stat import UserCategoryStat
from .event import Event
from .place import Place
from .quest import Quest

__all__ = [
    "User",
    "UserPhoto",
    "UserCategoryStat",
    "Event",
    "Place",
    "Quest",
    "event_attendees",
]
