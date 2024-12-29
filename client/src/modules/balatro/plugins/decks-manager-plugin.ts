import { BalatroEngine, PlayerManagerPlugin, Plugin } from "../balatro-engine";
import { DeckImpl } from "../decks/decks";
import { DeckManagerPlugin, getDeckManagerPlugin } from "./deck-manager-plugin";
import { getSeedManagerPlugin, SeedManagerPlugin } from "./seed-manager-plugin";

export interface DecksManagerPlugin extends Plugin {
  addDecks: (decks: DeckImpl[]) => void;
  getDecks: () => DeckImpl[];
  pickDeck: (deckId: string) => void;
}

export function createDecksPlugin(): DecksManagerPlugin {
  let _engine: BalatroEngine;
  let _deckManagerPlugin: DeckManagerPlugin;

  let _deck: DeckImpl[] = [];

  function init(engine: BalatroEngine) {
    _engine = engine;
    _deckManagerPlugin = getDeckManagerPlugin(engine);
  }

  function addDecks(decks: DeckImpl[]) {
    _deck.push(...decks);
    console.log("Adding decks", _deck);
  }

  function addDeck(deck: DeckImpl) {
    _deck.push(deck);
  }

  function pickDeck(deckId: string) {
    console.log("Picking deck", deckId);
    const deck = _deck.find((deck) => deck.id === deckId);
    if (deck == null) {
      throw new Error(`Deck ${deckId} not found`);
    }

    _deckManagerPlugin.setDeck(deck);
  }

  function getDecks(): DeckImpl[] {
    return [..._deck];
  }

  return {
    addDecks,
    name: "decks",
    init,
    getDecks,
    pickDeck,
  };
}

export function getDecksPlugin(engine: BalatroEngine): DecksManagerPlugin {
  const plugin = engine.getPlugin<DecksManagerPlugin>("decks");

  if (plugin == null) {
    throw new Error("Player manager plugin not found");
  }

  return plugin;
}
