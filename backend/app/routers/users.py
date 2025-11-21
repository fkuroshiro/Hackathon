# app/routers/users.py
from typing import List
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import schemas
from app.database import get_db
from app import models

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/", response_model=schemas.UserOut)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    user = models.User(display_name=user_in.display_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

UPLOAD_DIR = Path("media/profile_pics")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_upload_to_disk(upload_file: UploadFile) -> str:
    """
    Save uploaded file to media/profile_pics and return the URL path, e.g.:
    /media/profile_pics/<uuid>.<ext>
    """
    # basic content-type check (optional)
    if not upload_file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Extract extension (e.g. ".jpg")
    original_name = upload_file.filename or ""
    ext = ""
    if "." in original_name:
        ext = "." + original_name.split(".")[-1]

    # Generate unique filename
    filename = f"{uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / filename

    # Save file
    with file_path.open("wb") as buffer:
        buffer.write(upload_file.file.read())

    # URL that frontend can use
    return f"/media/profile_pics/{filename}"


@router.post("/{user_id}/avatar", response_model=schemas.UserOut)
async def upload_avatar(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    image_url = save_upload_to_disk(file)
    user.avatar_url = image_url
    db.commit()
    db.refresh(user)
    return user


@router.post("/{user_id}/photos", response_model=schemas.UserOut)
async def upload_user_photo(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    image_url = save_upload_to_disk(file)

    photo = models.UserPhoto(
        user_id=user.id,
        image_url=image_url,
    )
    db.add(photo)
    db.commit()
    db.refresh(user)  # refresh to include new photos
    return user

@router.post("/{user_id}/reputation/set", response_model=schemas.UserOut)
def set_user_reputation(
    user_id: int,
    value: int,
    db: Session = Depends(get_db),
):
    """
    DEV ONLY: Directly set a user's reputation_score (0-100).
    In production you'd derive this from reviews instead.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # clamp between 0 and 100 just to be safe
    user.reputation_score = max(0, min(100, value))

    db.commit()
    db.refresh(user)
    return user


@router.post("/{user_id}/reputation/change", response_model=schemas.UserOut)
def change_user_reputation(
    user_id: int,
    delta: int,
    db: Session = Depends(get_db),
):
    """
    DEV ONLY: Increment or decrement reputation_score by delta.
    Example: delta=+10, delta=-5, etc.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    new_value = user.reputation_score + delta
    user.reputation_score = max(0, min(100, new_value))

    db.commit()
    db.refresh(user)
    return user