import { Plugin, BalatroEngine } from "../balatro-engine";
import { PokerCard } from "../cards/poker-cards";

export interface ScoreCommandManagerPlugin extends Plugin {
  getCommands: () => Command[];
  reset: () => void;
}

export function createScoreCommandManagerPlugin(): ScoreCommandManagerPlugin {
  let _engine: BalatroEngine;
  let _commands: Command[] = [];

  function init(engine: BalatroEngine) {
    _engine = engine;

    _engine.onEvent("score-card-calculated", (card: PokerCard) => {
      _commands.push(new PokerCardCalculatedCommand(card));
    });

    _engine.onEvent("score-card-calculated", (card: PokerCard) => {
      _commands.push(new PokerCardCalculatedCommand(card));
    });
  }

  function reset() {
    _commands = [];
  }

  return {
    name: "score-command",
    init,
    getCommands: () => _commands,
    reset,
  };
}

export function getPlayerManagerPlugin(context: BalatroEngine) {
  const manager = context.getPlugin<ScoreCommandManagerPlugin>("score-command");

  if (manager == null) {
    throw new Error("Player manager not found");
  }

  return manager;
}

interface ICommand {
  execute: () => void;
}

class Command implements ICommand {
  constructor() {}

  execute() {}
}

class PokerCardCalculatedCommand extends Command {
  constructor(private card: PokerCard) {
    super();
  }

  execute() {
    console.log("PokerCardCalculatedCommand executed");
  }
}

class BuffonCardCalculatedCommand extends Command {
  constructor(private card: PokerCard) {
    super();
  }

  execute() {
    console.log("BuffonCardCalculatedCommand executed");
  }
}
