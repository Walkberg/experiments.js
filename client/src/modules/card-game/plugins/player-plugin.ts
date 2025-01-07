import { Card } from "../core/cards/card";
import {
  Plugin,
  PlayerStats,
  Side,
  Engine,
  createBoard,
  createHand,
} from "../game";

export interface PlayerPlugin extends Plugin {
  getPlayerStats: () => PlayerStats;
  setPlayerStats: (stats: Partial<PlayerStats>) => void;
  getPlayerSide: () => Side;
}

export function createPlayerPlugin(): PlayerPlugin {
  let _engine: Engine;
  let playerStats: PlayerStats = {
    health: 30,
    money: 0,
  };

  let playerSide: Side;

  function init(engine: Engine): void {
    _engine = engine;

    playerSide = {
      player: playerStats,
      board: createBoard(engine),
      hand: createHand(engine),
    };

    engine.onEvent("card-bought", (card: Card) => {
      playerSide.hand.addCard(card);
    });

    engine.onEvent("cardPlayed", (card: Card) => {
      playerSide.board.addCard(card);
    });
  }

  function getPlayerStats(): PlayerStats {
    return playerStats;
  }

  function setPlayerStats(stats: Partial<PlayerStats>): void {
    playerStats = { ...playerStats, ...stats };
  }

  function getPlayerSide(): Side {
    return playerSide;
  }

  return {
    name: "player",
    init,
    getPlayerStats,
    setPlayerStats,
    getPlayerSide,
  };
}
