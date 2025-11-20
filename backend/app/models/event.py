from __future__ import annotations

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base
from . import event_attendees  # from __init__.py


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)

    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)

    time_start = Column(DateTime)
    time_end = Column(DateTime, nullable=True)

    category = Column(String, index=True, nullable=True)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    creator = relationship("User", back_populates="created_events")
    attendees = relationship(
        "User",
        secondary=event_attendees,
        back_populates="attending_events",
    )
