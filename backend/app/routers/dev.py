# app/routers/dev.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, engine, Base
from app import models

from datetime import datetime, timezone


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

#hardcoding seed db for testing and showcase purposes

SEED_SECRET = "let_me_seed"  # change if you want


@router.post("/seed-db")
def seed_db(
    secret: str,
    db: Session = Depends(get_db),
):
    """
    DEV ONLY: Reset the DB and insert some sample data
    so frontend has something nice to work with.
    """

    if secret != SEED_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

    # 1) Drop + recreate all tables (same as reset-db)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 2) Create sample users
    u1 = models.User(display_name="Alice", reputation_score=80)
    u2 = models.User(display_name="Bob", reputation_score=60)
    u3 = models.User(display_name="Charlie", reputation_score=40)

    db.add_all([u1, u2, u3])
    db.flush()  # to get IDs

    # 3) Create some events
    from datetime import datetime, timedelta

    now = datetime.now(timezone.utc)

    e1 = models.Event(
        title="Casual Chess at Náměstí Svobody",
        description="Open-air chess tables, everyone welcome!",
        latitude=49.1951,
        longitude=16.6068,
        time_start=now + timedelta(hours=2),
        time_end=now + timedelta(hours=5),
        category="chess",
        is_official=False,
        reward_text=None,
        created_by_id=u1.id,
    )

    e2 = models.Event(
        title="Official Fitness Bootcamp in Lužánky",
        description="Sponsored HIIT session with goodies.",
        latitude=49.2055,
        longitude=16.6128,
        time_start=now + timedelta(days=1),
        time_end=now + timedelta(days=1, hours=2),
        category="fitness",
        is_official=True,
        reward_text="DISCOUNT: FIT-BRNO-2025",
        created_by_id=u2.id,
    )

    e3 = models.Event(
        title="DnD One-Shot near BVV",
        description="Beginner-friendly one-shot campaign.",
        latitude=49.1879,
        longitude=16.5807,
        time_start=now + timedelta(days=2),
        time_end=now + timedelta(days=2, hours=4),
        category="dnd",
        is_official=False,
        reward_text=None,
        created_by_id=u3.id,
    )

    db.add_all([e1, e2, e3])
    db.flush()

    # 4) Use same logic as your app to give XP when joining/creating
    #    so leaderboards/category_stats look real.
    from app.routers.events import award_xp_for_event, EVENT_JOIN_XP, EVENT_CREATE_XP, OFFICIAL_EVENT_BONUS_XP

    # Creator attends their own event
    e1.attendees.append(u1)
    xp1 = EVENT_CREATE_XP
    award_xp_for_event(u1, e1, xp1, db)

    e2.attendees.append(u2)
    xp2 = EVENT_CREATE_XP + OFFICIAL_EVENT_BONUS_XP
    award_xp_for_event(u2, e2, xp2, db)

    e3.attendees.append(u3)
    xp3 = EVENT_CREATE_XP
    award_xp_for_event(u3, e3, xp3, db)

    # Other users join some events
    e1.attendees.append(u2)
    award_xp_for_event(u2, e1, EVENT_JOIN_XP, db)

    e2.attendees.append(u1)
    award_xp_for_event(u1, e2, EVENT_JOIN_XP + OFFICIAL_EVENT_BONUS_XP, db)

    e2.attendees.append(u3)
    award_xp_for_event(u3, e2, EVENT_JOIN_XP + OFFICIAL_EVENT_BONUS_XP, db)

    db.commit()

    return {
        "status": "ok",
        "message": "DB reset and seeded",
        "users": [u1.id, u2.id, u3.id],
        "events": [e1.id, e2.id, e3.id],
    }

