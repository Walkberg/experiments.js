import { getBaseChip } from "../balatro";
import { PokerCard } from "../cards/poker-cards";
import {
  BalatroEngine,
  PlayedCardManagerPlugin,
  Plugin,
} from "../balatro-engine";
import { evaluatePokerHand } from "../hand-evaluator";
import {
  BuffonsManagerPlugin,
  getHandManagerPlugin,
  getHandScorePlugin,
  HandManagerPlugin,
  HandScoreManagerPlugin,
} from ".";

interface Score {
  chip: number;
  multiplier: number;
}

export interface ScoreManagerPlugin extends Plugin {
  getScore: () => Score;
  getRoundScore: () => number;
  calculateScore: () => void;
  resetScore: () => void;
  addChip: (chip: number) => void;
  addMultiplier: (multiplier: number) => void;
  multiplyMultiplier: (count: number) => void;
}

export function createScorePlugin(): ScoreManagerPlugin {
  let _engine: BalatroEngine;
  let _handManager: HandManagerPlugin;
  let _buffonsManager: BuffonsManagerPlugin;
  let _handScoreManager: HandScoreManagerPlugin;

  const baseChip = 0;
  const baseMultiplier = 0;

  let roundScore = 0;

  let currentChip = 0;
  let currentMultiplier = 0;

  function init(engine: BalatroEngine) {
    _engine = engine;
    _handManager = getHandManagerPlugin(engine);
    const buffonsManager =
      engine.getPlugin<BuffonsManagerPlugin>("buffon-manager");

    _handScoreManager = getHandScorePlugin(engine);

    if (buffonsManager) {
      {
        _buffonsManager = buffonsManager;
      }
    }
  }

  function calculateScore() {
    const handType = evaluatePokerHand(_handManager.getSelectedCards());
    const handBaseScore = _handScoreManager.getHandScore(handType);

    currentChip = handBaseScore.chip;
    currentMultiplier = handBaseScore.multiplier;

    for (const card of _handManager.getHand()) {
      if (!isCardScore(card)) {
        continue;
      }
      currentChip += getBaseChip(card);

      for (const buffon of _buffonsManager.getBuffons()) {
        _buffonsManager.applyBuffonEffectCardPlay(buffon, card);
      }

      _engine.emitEvent("score-card-calculated", card);
    }

    roundScore += currentChip * currentMultiplier;

    _engine.emitEvent("score-calculated", {
      total: currentChip * currentMultiplier,
      score: {
        chip: currentChip,
        multiplier: currentMultiplier,
      },
    });
  }

  function isCardScore(card: PokerCard) {
    return true;
  }

  function addChip(chip: number) {
    currentChip += chip;
  }

  function addMultiplier(multiplier: number) {
    currentMultiplier += multiplier;
  }

  function multiplyMultiplier(count: number) {
    currentMultiplier *= count;
  }

  function resetScore() {
    currentChip = baseChip;
    currentMultiplier = baseMultiplier;
    roundScore = 0;

    _engine.emitEvent("score-reset", {});
  }

  return {
    name: "score",
    init,
    getRoundScore: () => roundScore,
    getScore: () => ({ chip: currentChip, multiplier: currentMultiplier }),
    calculateScore,
    resetScore,
    addChip,
    addMultiplier,
    multiplyMultiplier,
  };
}

export function getScoreManagerPlugin(
  engine: BalatroEngine
): ScoreManagerPlugin {
  const plugin = engine.getPlugin<ScoreManagerPlugin>("score");

  if (!plugin) {
    throw new Error("Score plugin not found");
  }

  return plugin;
}
