# app/main.py
from fastapi import FastAPI

from app import models 
from app.database import Base, engine
from app.routers import events, places, quests, users, dev, leaderboard
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Create all tables (would use migration for actual app)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hackathon Gamified IRL Meetups API",
    version="0.1.0",
)

# Serve static files (profile pics only so far, could be extended)
app.mount("/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Expo app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(events.router)
app.include_router(places.router)
app.include_router(quests.router)
app.include_router(dev.router) 
app.include_router(leaderboard.router)


@app.get("/")
def read_root():
    return {"message": "Hackathon backend is up"}

@app.get("/ping")
def ping():
    return "ok"
