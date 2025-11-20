# app/routers/dev.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, engine
from app import models

router = APIRouter(
    prefix="/dev",
    tags=["dev"],
)


@router.post("/reset-db")
def reset_database(
    secret: str,
    db: Session = Depends(get_db),  # not strictly needed, but keeps pattern consistent
):
    """
    Danger zone ⚠️
    Drops all tables and recreates them.
    This wipes ALL data and resets autoincrementing IDs.

    Add a simple 'secret' check so random people can't hit it accidentally.
    """

    # Super simple guard – change this string to whatever you want
    if secret != "let_me_reset":
        raise HTTPException(status_code=403, detail="Invalid secret")

    # Drop all tables
    models.Base.metadata.drop_all(bind=engine)
    # Recreate all tables
    models.Base.metadata.create_all(bind=engine)

    return {"status": "ok", "message": "Database wiped and schema recreated"}
