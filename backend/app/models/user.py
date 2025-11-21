from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from . import event_attendees  # from __init__.py


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)

    total_xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)

    reputation_score = Column(Integer, default=50, nullable=False) # 0-100 scale reputation score

    created_events = relationship("Event", back_populates="creator")
    attending_events = relationship(
        "Event",
        secondary=event_attendees,
        back_populates="attendees",
    )

    photos = relationship("UserPhoto", back_populates="user", cascade="all, delete-orphan")
    category_stats = relationship(
        "UserCategoryStat",
        back_populates="user",
        cascade="all, delete-orphan",
    )
