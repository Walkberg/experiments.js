import { BalatroEngine, Plugin } from "../balatro-engine";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  checkCondition: (state: AchievementState) => boolean;
}

export interface AchievementState {
  cardsPlayed: number;
  moneyEarned: number;
}

export interface AchievementsManagerPlugin extends Plugin {
  getAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  trackEvent: (event: keyof AchievementState, value: number) => void;
}

export function createAchievementsManagerPlugin(): AchievementsManagerPlugin {
  let _engine: BalatroEngine;
  let achievements: Achievement[] = [];

  let state: AchievementState = {
    cardsPlayed: 0,
    moneyEarned: 0,
  };

  function init(engine: BalatroEngine) {
    _engine = engine;
  }

  function getAchievements(): Achievement[] {
    return achievements;
  }

  function unlockAchievement(achievementId: string) {
    const achievement = achievements.find((ach) => ach.id === achievementId);
    if (achievement && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      _engine.emitEvent("achievement-unlocked", achievement);
    }
  }

  function trackEvent(event: keyof AchievementState, value: number) {
    state[event] += value;

    for (const achievement of achievements) {
      if (!achievement.isUnlocked && achievement.checkCondition(state)) {
        unlockAchievement(achievement.id);
      }
    }
  }

  return {
    name: "achievements-manager",
    init,
    getAchievements,
    unlockAchievement,
    trackEvent,
  };
}

export function setupAchievements(plugin: AchievementsManagerPlugin) {
  plugin.getAchievements().push(
    {
      id: "play_100_cards",
      name: "Card Master",
      description: "Jouez 100 cartes.",
      isUnlocked: false,
      checkCondition: (state) => state.cardsPlayed >= 100,
    },
    {
      id: "earn_100_dollars",
      name: "Rich Player",
      description: "Gagnez 100 dollars.",
      isUnlocked: false,
      checkCondition: (state) => state.moneyEarned >= 100,
    }
  );
}
