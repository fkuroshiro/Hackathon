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


class User(Base): #create users table, define columns and relationships
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, index=True, unique=False)
    avatar_url = Column(String, nullable=True)              #avatar picture url

    created_events = relationship("Event", back_populates="creator")
    attending_events = relationship(
        "Event",
        secondary=event_attendees,
        back_populates="attendees",
    )

    photos = relationship("UserPhoto", back_populates="user", cascade="all, delete-orphan") # user photos relationship


class UserPhoto(Base):              #create user photos table
    __tablename__ = "user_photos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_url = Column(String, nullable=False)  # e.g. "/media/profile_pics/uuid.jpg"

    user = relationship("User", back_populates="photos")


class Event(Base): #create events table, define columns and relationships
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True) #unique event identifier
    title = Column(String, index=True)
    description = Column(String, nullable=True)

    # Geolocation
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
