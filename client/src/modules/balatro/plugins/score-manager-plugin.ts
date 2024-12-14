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
  getHandScorePlugin,
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
  let _playedCard: PlayedCardManagerPlugin;
  let _buffonsManager: BuffonsManagerPlugin;
  let _handScoreManager: HandScoreManagerPlugin;

  const baseChip = 0;
  const baseMultiplier = 0;

  let roundScore = 0;

  let currentChip = 0;
  let currentMultiplier = 0;

  function init(engine: BalatroEngine) {
    _engine = engine;
    const playedCard = engine.getPlugin<PlayedCardManagerPlugin>("played-card");
    const buffonsManager =
      engine.getPlugin<BuffonsManagerPlugin>("buffon-manager");

    _handScoreManager = getHandScorePlugin(engine);

    if (playedCard && buffonsManager) {
      {
        _playedCard = playedCard;
        _buffonsManager = buffonsManager;
      }
    }
  }

  function calculateScore() {
    const handType = evaluatePokerHand(_playedCard.getHand());
    const handBaseScore = _handScoreManager.getHandScore(handType);

    currentChip = handBaseScore.chip;
    currentMultiplier = handBaseScore.multiplier;

    console.log("card", _playedCard.getHand());

    for (const card of _playedCard.getHand()) {
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
      chip: currentChip,
      multiplier: currentMultiplier,
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
