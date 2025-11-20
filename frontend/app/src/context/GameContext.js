// src/context/GameContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

const GameContext = createContext(null);

const initialMissions = [
  {
    id: "mission-1",
    title: "Say hi to someone new",
    description: "Introduce yourself to a new person at this event.",
    xpReward: 50,
    coinReward: 20,
    completed: false,
    type: "social",
  },
  {
    id: "mission-2",
    title: "Join a group chat",
    description: "Join any group or channel in the app.",
    xpReward: 40,
    coinReward: 15,
    completed: false,
    type: "online",
  },
  {
    id: "mission-3",
    title: "Team selfie quest (QR)",
    description: "Scan the event QR code with your teammates.",
    xpReward: 80,
    coinReward: 40,
    completed: false,
    type: "qr",
    qrCode: "JOIN_EVENT_1", // value that QR will contain
  },
];

const initialBadges = [
  {
    id: "badge-newbie",
    name: "Newcomer",
    description: "Created your account",
    condition: (user) => user.xp >= 0,
  },
  {
    id: "badge-explorer",
    name: "Explorer",
    description: "Reached 100 XP",
    condition: (user) => user.xp >= 100,
  },
  {
    id: "badge-connector",
    name: "Connector",
    description: "Reached 300 XP",
    condition: (user) => user.xp >= 300,
  },
];

const initialLeaderboard = [
  { id: "u1", name: "Alex", level: 5, xp: 520 },
  { id: "u2", name: "Mia", level: 4, xp: 380 },
  { id: "u3", name: "Leo", level: 3, xp: 250 },
];

function getLevelFromXP(xp) {
  // Simple formula: every 100 XP = 1 level
  return Math.floor(xp / 100) + 1;
}

export function GameProvider({ children }) {
  const [user, setUser] = useState({
    id: "me",
    name: "You",
    xp: 0,
    coins: 0,
    level: 1,
    badgeIds: ["badge-newbie"],
  });

  const [missions, setMissions] = useState(initialMissions);
  const [badges] = useState(initialBadges);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);

  function awardXPAndCoins(xpAmount, coinAmount) {
    setUser((prev) => {
      const newXP = prev.xp + xpAmount;
      const newLevel = getLevelFromXP(newXP);
      const newCoins = prev.coins + coinAmount;

      return {
        ...prev,
        xp: newXP,
        coins: newCoins,
        level: newLevel,
      };
    });

    // also update leaderboard entry for "You" if exists
    setLeaderboard((prev) => {
      const exists = prev.find((p) => p.id === "me");
      if (!exists) {
        return [
          ...prev,
          {
            id: "me",
            name: "You",
            level: getLevelFromXP(user.xp + xpAmount),
            xp: user.xp + xpAmount,
          },
        ];
      }
      return prev.map((p) =>
        p.id === "me"
          ? {
              ...p,
              xp: user.xp + xpAmount,
              level: getLevelFromXP(user.xp + xpAmount),
            }
          : p
      );
    });

    // unlock badges after XP update (slightly delayed to use new user state)
    setTimeout(() => {
      setUser((currentUser) => {
        const unlocked = badges
          .filter((b) => b.condition(currentUser))
          .map((b) => b.id);
        const unique = Array.from(new Set([...currentUser.badgeIds, ...unlocked]));
        return { ...currentUser, badgeIds: unique };
      });
    }, 0);
  }

  function completeMission(id) {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, completed: true } : m
      )
    );

    const mission = missions.find((m) => m.id === id);
    if (mission && !mission.completed) {
      awardXPAndCoins(mission.xpReward, mission.coinReward);
    }
  }

  function completeMissionByQRCode(qrValue) {
    const mission = missions.find((m) => m.qrCode === qrValue);
    if (!mission) return { success: false, message: "No mission linked to this QR" };
    if (mission.completed) return { success: false, message: "Mission already completed" };

    completeMission(mission.id);
    return { success: true, message: `Mission "${mission.title}" completed!` };
  }

  const value = useMemo(
    () => ({
      user,
      missions,
      badges,
      leaderboard,
      completeMission,
      completeMissionByQRCode,
    }),
    [user, missions, badges, leaderboard]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}