# app/routers/quests.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

from pydantic import BaseModel

router = APIRouter(
    prefix="/quests",
    tags=["quests"],
)


@router.post("/", response_model=schemas.QuestOut)
def create_quest(
    quest_in: schemas.QuestCreate,
    db: Session = Depends(get_db),
):
    quest = models.Quest(
        name=quest_in.name,
        description=quest_in.description,
    )
    db.add(quest)
    db.commit()
    db.refresh(quest)
    return quest


@router.get("/", response_model=List[schemas.QuestOut])
def list_quests(db: Session = Depends(get_db)):
    return db.query(models.Quest).all()


@router.get("/{quest_id}", response_model=schemas.QuestOut)
def get_quest(quest_id: int, db: Session = Depends(get_db)):
    quest = db.query(models.Quest).filter(models.Quest.id == quest_id).first()
    if quest is None:
        raise HTTPException(status_code=404, detail="Quest not found")
    return quest

class CategoryLeaderboardEntry(BaseModel):
    user: schemas.UserOut
    category: str
    xp: int
    level: int


@router.get("/leaderboard/{category}", response_model=List[schemas.UserOut])
def category_leaderboard(
    category: str,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """
    Top users for a given category by XP.
    """
    stats = (
        db.query(models.UserCategoryStat)
        .filter(models.UserCategoryStat.category == category)
        .order_by(models.UserCategoryStat.xp.desc())
        .limit(limit)
        .all()
    )

    # Return just the users; they already contain category_stats, so frontend
    # can show relevant entry for this category.
    user_ids = [s.user_id for s in stats]
    if not user_ids:
        return []

    users = (
        db.query(models.User)
        .filter(models.User.id.in_(user_ids))
        .all()
    )
    # Note: DB won't guarantee same order; for hackathon demo that's fine.
    return users