import { Plugin, BalatroEngine } from "../balatro-engine";
import { PokerHandType } from "./hand-score-manager-plugin";

export interface StatManagerPlugin extends Plugin {
  resetStats: () => void;
  getStats: () => GameStats;
}

export interface GameStats {
  bestHandScore: number;
  mostPlayedHand: PokerHandType | null;
  playedHandCount: number;
  totalCardsPlayed: number;
  totalCardsDiscarded: number;
  totalCardsBought: number;
  totalCardsDiscovered: number;
  shopRerolls: number;
  seed: string | null;
  ante: number;
  levelsCompleted: number;
}

export function createStatManagerPlugin(): StatManagerPlugin {
  let _engine: BalatroEngine;
  let _stats: GameStats = {
    bestHandScore: 0,
    mostPlayedHand: null,
    playedHandCount: 0,
    totalCardsPlayed: 0,
    totalCardsDiscarded: 0,
    totalCardsBought: 0,
    totalCardsDiscovered: 0,
    shopRerolls: 0,
    seed: null,
    ante: 0,
    levelsCompleted: 0,
  };

  function resetStats() {
    _stats = {
      bestHandScore: 0,
      mostPlayedHand: null,
      playedHandCount: 0,
      totalCardsPlayed: 0,
      totalCardsDiscarded: 0,
      totalCardsBought: 0,
      totalCardsDiscovered: 0,
      shopRerolls: 0,
      seed: null,
      ante: 0,
      levelsCompleted: 0,
    };
  }

  function getStats(): GameStats {
    return _stats;
  }

  function trackCardAction(
    action: "played" | "discarded" | "bought" | "discovered"
  ) {
    switch (action) {
      case "played":
        _stats.totalCardsPlayed++;
        break;
      case "discarded":
        _stats.totalCardsDiscarded++;
        break;
      case "bought":
        _stats.totalCardsBought++;
        break;
      case "discovered":
        _stats.totalCardsDiscovered++;
        break;
    }
    _engine.emitEvent("stats-updated", { stats: _stats });
  }

  function trackShopReroll() {
    _stats.shopRerolls++;
    _engine.emitEvent("stats-updated", { stats: _stats });
  }

  function trackNewLevel() {
    _stats.levelsCompleted++;
    _engine.emitEvent("stats-updated", { stats: _stats });
  }

  function setSeed(seed: string) {
    _stats.seed = seed;
    _engine.emitEvent("stats-updated", { stats: _stats });
  }

  function setAnte(ante: number) {
    _stats.ante = ante;
    _engine.emitEvent("stats-updated", { stats: _stats });
  }

  function init(engine: BalatroEngine) {
    _engine = engine;
    engine.onEvent("card-played", (event) => trackCardAction("played"));

    engine.onEvent("card-discarded", (event) => trackCardAction("discarded"));

    engine.onEvent("shop-item-bought", (event) => trackCardAction("bought"));

    engine.onEvent("shop-rerolled", () => trackShopReroll());

    engine.onEvent("score-calculated", (event) => {
      if (event.total > _stats.bestHandScore) {
        _stats.bestHandScore = event.total;
      }
      _engine.emitEvent("stats-updated", { stats: _stats });
    });

    // engine.onEvent("new-level", () => {
    //   trackNewLevel();
    // });

    engine.onEvent("seed-set", (event) => setSeed(event.seed));

    // engine.onEvent("ante-set", (event) => {
    //   setAnte(event.ante);
    // });
  }

  return {
    name: "stat-manager",
    init,
    resetStats,
    getStats,
  };
}

export function getStatManagerPlugin(engine: BalatroEngine): StatManagerPlugin {
  const plugin = engine.getPlugin<StatManagerPlugin>("stat-manager");

  if (plugin == null) {
    throw new Error("StatManagerPlugin not found");
  }
  return plugin;
}
