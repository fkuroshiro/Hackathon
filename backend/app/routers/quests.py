# app/routers/quests.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

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
