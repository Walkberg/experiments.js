import { Hand, PokerCard } from "../balatro";
import { Plugin } from "../balatro-engine";
import { BalatroEngine } from "../balatro-engine";
import { evaluatePokerHand } from "../hand-evaluator";

export interface HandScoreManagerPlugin extends Plugin {
  improveHandScore: (planet: PokerHandType) => void;
  improveHandPlayedCount: (planet: PokerHandType) => void;
  getHandScores: () => BaseScore[];
  getHandScore: (handType: PokerHandType) => BaseScore;
}

export type Chip = number;

export type Multiplier = number;

export type PlanetType =
  | "pluto"
  | "mercury"
  | "uranus"
  | "venus"
  | "saturn"
  | "jupiter"
  | "earth"
  | "mars"
  | "neptune";

export type PokerHandType =
  | "HighCard"
  | "OnePair"
  | "TwoPair"
  | "ThreeOfAKind"
  | "Straight"
  | "Flush"
  | "FullHouse"
  | "FourOfAKind"
  | "StraightFlush"
  | "RoyalFlush";

export function convertHandTypeToPlanetType(
  handType: PokerHandType
): PlanetType {
  const record: Record<PokerHandType, PlanetType> = {
    HighCard: "pluto",
    OnePair: "mercury",
    TwoPair: "uranus",
    ThreeOfAKind: "venus",
    Straight: "saturn",
    Flush: "jupiter",
    FullHouse: "earth",
    FourOfAKind: "mars",
    StraightFlush: "neptune",
    RoyalFlush: "neptune",
  };
  return record[handType];
}

export function convertPlanetTypeToHandType(
  planetType: PlanetType
): PokerHandType {
  const record: Record<PlanetType, PokerHandType> = {
    pluto: "HighCard",
    mercury: "OnePair",
    uranus: "TwoPair",
    venus: "ThreeOfAKind",
    saturn: "Straight",
    jupiter: "Flush",
    earth: "FullHouse",
    mars: "FourOfAKind",
    neptune: "StraightFlush",
  };
  return record[planetType];
}

export type BaseScore = {
  type: PokerHandType;
  chip: Chip;
  multiplier: Multiplier;
  level: number;
  playedCount: number;
};

export type Score = { chip: Chip; multiplier: Multiplier };

export type BaseScoreListAddition = Record<PokerHandType, Score>;

export const addition: BaseScoreListAddition = {
  HighCard: { chip: 10, multiplier: 1 },
  OnePair: { chip: 15, multiplier: 1 },
  TwoPair: { chip: 20, multiplier: 1 },
  ThreeOfAKind: { chip: 20, multiplier: 2 },
  Straight: { chip: 30, multiplier: 3 },
  Flush: { chip: 15, multiplier: 2 },
  FullHouse: { chip: 25, multiplier: 2 },
  FourOfAKind: { chip: 30, multiplier: 3 },
  StraightFlush: { chip: 40, multiplier: 4 },
  RoyalFlush: { chip: 50, multiplier: 5 },
};

export function createHandScoreManagerPlugin(): HandScoreManagerPlugin {
  let _engine: BalatroEngine;

  let baseScoreList: Record<PokerHandType, BaseScore> = {
    HighCard: {
      type: "HighCard",
      chip: 5,
      multiplier: 1,
      level: 1,
      playedCount: 0,
    },
    OnePair: {
      type: "OnePair",
      chip: 10,
      multiplier: 2,
      level: 1,
      playedCount: 0,
    },
    TwoPair: {
      type: "TwoPair",
      chip: 20,
      multiplier: 2,
      level: 1,
      playedCount: 0,
    },
    ThreeOfAKind: {
      type: "ThreeOfAKind",
      chip: 30,
      multiplier: 3,
      level: 1,
      playedCount: 0,
    },
    Straight: {
      type: "Straight",
      chip: 30,
      multiplier: 4,
      level: 1,
      playedCount: 0,
    },
    Flush: { type: "Flush", chip: 35, multiplier: 4, level: 1, playedCount: 0 },
    FullHouse: {
      type: "FullHouse",
      chip: 40,
      multiplier: 4,
      level: 1,
      playedCount: 0,
    },
    FourOfAKind: {
      type: "FourOfAKind",
      chip: 60,
      multiplier: 7,
      level: 1,
      playedCount: 0,
    },
    StraightFlush: {
      type: "StraightFlush",
      chip: 100,
      multiplier: 8,
      level: 1,
      playedCount: 0,
    },
    RoyalFlush: {
      type: "RoyalFlush",
      chip: 120,
      multiplier: 9,
      level: 1,
      playedCount: 0,
    },
  };

  function init(engine: BalatroEngine) {
    _engine = engine;

    engine.onEvent("hand-played", (hand: Hand) => {
      const handType = evaluatePokerHand(hand);

      improveHandPlayedCount(handType);
    });
  }

  function improveHandScore(handType: PokerHandType) {
    const baseScore = baseScoreList[handType];

    const additionScore = addition[handType];

    if (baseScore) {
      baseScore.chip += additionScore.chip;
      baseScore.multiplier += additionScore.multiplier;
      baseScore.level += 1;
    }

    _engine.emitEvent("hand-score-improved", {});
  }

  function improveHandPlayedCount(handType: PokerHandType) {
    const baseScore = baseScoreList[handType];

    if (baseScore) {
      baseScore.playedCount += 1;
    }

    _engine.emitEvent("hand-score-improved", {});
  }

  function getHandScore(handType: PokerHandType): BaseScore {
    return baseScoreList[handType];
  }

  return {
    name: "hand-score-manager",
    init,
    improveHandPlayedCount,
    improveHandScore,
    getHandScore,
    getHandScores: () => Object.values(baseScoreList),
  };
}

export function getHandScorePlugin(
  engine: BalatroEngine
): HandScoreManagerPlugin {
  const handScoreManager =
    engine.getPlugin<HandScoreManagerPlugin>("hand-score-manager");

  if (!handScoreManager) {
    throw new Error("HandScoreManagerPlugin not found");
  }

  return handScoreManager;
}
