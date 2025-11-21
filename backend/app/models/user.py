from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
<<<<<<< HEAD
from . import event_attendees  # from __init__.py
=======
from . import event_attendees  # imported from models/__init__.py
>>>>>>> 40c7d6b10c1c5a5e48091b763b5dad74c58895a9


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)

<<<<<<< HEAD
    total_xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)

    created_events = relationship("Event", back_populates="creator")
=======
    # Global XP + level
    total_xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)

    # Relationship to events created by this user
    created_events = relationship("Event", back_populates="creator")

    # Events the user is attending
>>>>>>> 40c7d6b10c1c5a5e48091b763b5dad74c58895a9
    attending_events = relationship(
        "Event",
        secondary=event_attendees,
        back_populates="attendees",
    )

<<<<<<< HEAD
    photos = relationship("UserPhoto", back_populates="user", cascade="all, delete-orphan")
    category_stats = relationship(
        "UserCategoryStat",
        back_populates="user",
        cascade="all, delete-orphan",
=======
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
>>>>>>> 40c7d6b10c1c5a5e48091b763b5dad74c58895a9
    )
