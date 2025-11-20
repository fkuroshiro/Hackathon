# app/routers/leaderboard.py
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/leaderboard",
    tags=["leaderboard"],
)


# ---------- SCHEMAS FOR RESPONSES ----------

class CategoryLeaderboardEntry(BaseModel):
    """
    One row in a category-specific leaderboard:
    - user: full profile (UserOut)
    - category: e.g. "chess"
    - xp / level: in *that* category
    """
    user: schemas.UserOut
    category: str
    xp: int
    level: int

    # Allow Pydantic v2 to build from ORM objects (UserCategoryStat with .user)
    model_config = ConfigDict(from_attributes=True)


# ---------- ENDPOINTS ----------

@router.get("/global", response_model=List[schemas.UserOut])
def global_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """
    Global leaderboard: top users by total XP.
    Returns full UserOut objects (with avatar, stats, etc.).
    """
    users = (
        db.query(models.User)
        .order_by(models.User.total_xp.desc())
        .limit(limit)
        .all()
    )
    return users


@router.get("/category/{category}", response_model=List[CategoryLeaderboardEntry])
def category_leaderboard(
    category: str,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """
    Category leaderboard: top users for a given category (e.g. 'chess').

    We rank by UserCategoryStat.xp and also return the embedded user profile.
    """
    stats = (
        db.query(models.UserCategoryStat)
        .filter(models.UserCategoryStat.category == category)
        .order_by(models.UserCategoryStat.xp.desc())
        .limit(limit)
        .all()
    )

    # Each 'stat' has: stat.category, stat.xp, stat.level, stat.user
    # Pydantic's from_attributes=True + CategoryLeaderboardEntry will handle mapping.
    return stats
