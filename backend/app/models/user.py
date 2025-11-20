from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from . import event_attendees  # imported from models/__init__.py


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)

    # Global XP + level
    total_xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)

    # Relationship to events created by this user
    created_events = relationship("Event", back_populates="creator")

    # Events the user is attending
    attending_events = relationship(
        "Event",
        secondary=event_attendees,
        back_populates="attendees",
    )

    # Photos belonging to this user
    photos = relationship(
        "UserPhoto",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # Category leveling system (e.g., chess, fitness)
    category_stats = relationship(
        "UserCategoryStat",
        back_populates="user",
        cascade="all, delete-orphan"
    )
