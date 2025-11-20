# app/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

# Association table: many-to-many between users and events
event_attendees = Table(
    "event_attendees",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("event_id", Integer, ForeignKey("events.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, index=True, unique=False)

    created_events = relationship("Event", back_populates="creator")
    attending_events = relationship(
        "Event",
        secondary=event_attendees,
        back_populates="attendees",
    )


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)

    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)

    time_start = Column(DateTime)
    time_end = Column(DateTime, nullable=True)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    creator = relationship("User", back_populates="created_events")
    attendees = relationship(
        "User",
        secondary=event_attendees,
        back_populates="attending_events",
    )


# Optional future entities – just stubs for now
class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
