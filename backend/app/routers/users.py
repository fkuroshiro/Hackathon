# app/routers/users.py
from typing import List
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

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