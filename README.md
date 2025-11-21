# Hackathon 2025

Téma -:> # GAMIFIKACE #

# Explora

## Project Overview

This app aims to solve a growing problem in the meetup/event space:  
**existing meetup platforms feel outdated, slow, and unappealing to younger people who want instant, interest-based connections in real life.**

### The Problem

Current meetup apps (Thusday, Badoo, etc.) often:
- Lack spontaneity — events are planned too far in advance.
- Feel corporate or formal instead of fun.
- Don’t engage younger users long-term.
- Provide no rewarding system for attending events.
- Make discovering local people with matching interests harder than it should be.

Younger people want **quick**, **interest-aligned**, **gamified**, and **rewarding** meetups that fit into their day naturally.

### Our Solution

We built a mobile-first platform where:
- Anyone can instantly create or join **interest-based IRL meetups** on a map.
- Users see events around them in real time (e.g. skating, chess, gym session, DnD night…).
- Each event gives **XP**, levels, and progression — encouraging continued engagement.
- Categories (fitness, gaming, music, etc.) level up individually and grant **badges**.
- **Leaderboards** create fun rivalry and increase user retention.
- **Official events** provide rewards such as discounts or partner benefits, giving users real-world value.
- Profiles showcase:
  - XP & levels  
  - Category stats  
  - Photos  
  - Attendance history  

### Why it Works

This approach turns meeting people into a **game-like social experience**:
- Events become “quests”
- Joining earns XP
- Leaderboards show top users in each interest
- Official events introduce reward loops and monetization potential

Our goal is to:
- Make in-person socializing more accessible.
- Build a playful layer on top of real world activities.
- Give users a reason to go outside, meet new people, and get rewarded for it.





### TECH INFO

### Map & Nearby Events

The mobile app shows a map of Brno with interest-based meetups placed as pins.

### How it works

- The **backend** (FastAPI) runs on a Raspberry Pi in the same Wi-Fi network.
- The **frontend** (Expo / React Native) calls the API on the Pi’s local IP, e.g.:
  - `http://<raspberry-ip>:8000`

### Key endpoints

- `GET /events/nearby?lat=<lat>&lng=<lng>&radius_km=<r>`  
  Returns events within a given radius (km) of the user’s location.  
  Used by the map screen to load pins around the current position.

- `POST /events/`  
  Creates a new event at a specific location (lat/lng), with time, category and creator.  
  The creator is automatically added as an attendee and receives XP.

- `GET /events/official`  
  Returns **official events** (e.g. sponsored / partner events) which can be highlighted on the map.  
  These events may include a reward text (discount code, perk, etc.) and give extra XP.

### Dev / demo data

- `POST /dev/seed-db?secret=let_me_seed`  
  Resets the database and seeds sample users and events around **Brno**:
  - Náměstí Svobody (city centre)
  - Lužánky park
  - BVV (exhibition centre)
