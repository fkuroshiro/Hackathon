from __future__ import annotations

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class UserCategoryStat(Base):
    __tablename__ = "user_category_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, index=True, nullable=False)

    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)

    user = relationship("User", back_populates="category_stats")
