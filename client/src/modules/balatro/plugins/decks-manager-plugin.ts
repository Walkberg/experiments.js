import { BalatroEngine, PlayerManagerPlugin, Plugin } from "../balatro-engine";
import { DeckImpl } from "../decks/decks";
import { getSeedManagerPlugin, SeedManagerPlugin } from "./seed-manager-plugin";

export interface DecksManagerPlugin extends Plugin {
  addDecks: (decks: DeckImpl[]) => void;
  getDecks: () => DeckImpl[];
}

export function createDecksPlugin(): DecksManagerPlugin {
  let _engine: BalatroEngine;
  let _seedManagerPlugin: SeedManagerPlugin;

  let _deck: DeckImpl[] = [];

  function init(engine: BalatroEngine) {
    _engine = engine;
    _seedManagerPlugin = getSeedManagerPlugin(engine);
  }

  function addDecks(decks: DeckImpl[]) {
    _deck.push(...decks);
    console.log("Adding decks", _deck);
  }

  function addDeck(deck: DeckImpl) {
    _deck.push(deck);
  }

  function getDecks(): DeckImpl[] {
    console.log("Getting decks", _deck);
    return [..._deck];
  }

  return {
    addDecks,
    name: "decks",
    init,
    getDecks,
  };
}

export function getDecksPlugin(engine: BalatroEngine): DecksManagerPlugin {
  const plugin = engine.getPlugin<DecksManagerPlugin>("decks");

  if (plugin == null) {
    throw new Error("Player manager plugin not found");
  }

  return plugin;
}
