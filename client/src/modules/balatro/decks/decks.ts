import { v4 as uuid } from "uuid";
import { Deck } from "../balatro";
import { CardRank, CardSuit } from "../cards/poker-cards";
import { SeedManagerPlugin } from "../plugins/seed-manager-plugin";
import { BalatroEngine } from "../balatro-engine";

const allSuits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];

const allRanks: CardRank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const noFaceRanks: CardRank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "A",
];

function generateDeck(): Deck {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = allRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: uuid(),
        enhancement: "bonus",
        edition: "base",
        seal: "none",
      });
    });
  });

  return deck;
}

function generateDeckTwoSuit(): Deck {
  const suits: CardSuit[] = ["hearts", "hearts", "clubs", "clubs"];
  const ranks: CardRank[] = allRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: uuid(),
        enhancement: "bonus",
        edition: "base",
        seal: "none",
      });
    });
  });

  return deck;
}

function generateDeckNoFace(): Deck {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = noFaceRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: uuid(),
        enhancement: "bonus",
        edition: "base",
        seal: "none",
      });
    });
  });

  return deck;
}

function generateRandom(seedManager: SeedManagerPlugin): Deck {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = noFaceRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit: suits[seedManager.random() * suits.length],
        rank: ranks[seedManager.random() * ranks.length],
        id: uuid(),
        enhancement: "bonus",
        edition: "base",
        seal: "none",
      });
    });
  });

  return deck;
}

export type DeckConfigId = string;

const deckConfigs: Record<DeckConfigId, DeckConfig> = {
  d_red_deck: {
    id: "d_red_deck",
    name: "Deck rouge",
    description: "le deck rouge",
    position: {
      x: 0,
      y: 0,
    },
  },
  d_blue_deck: {
    id: "d_blue_deck",
    name: "Deck bleu",
    description: "le deck blue",
    position: {
      x: 0,
      y: 2,
    },
  },
  d_yellow_deck: {
    id: "d_yellow_deck",
    name: "Deck jaune",
    description: "le deck jaune",
    position: {
      x: 1,
      y: 2,
    },
  },
  d_green_deck: {
    id: "d_green_deck",
    name: "Deck vert",
    description: "le deck vert",
    position: {
      x: 2,
      y: 2,
    },
  },
};

export function getDeckConfig(configId: DeckConfigId): DeckConfig {
  return deckConfigs[configId];
}

type Position = {
  x: number;
  y: number;
};

type DeckConfig = {
  id: DeckConfigId;
  name: string;
  description: string;
  position: Position;
};

export interface DeckImpl {
  id: string;
  name: string;
  configId: DeckConfigId;
  deckStrategy: (ctx: BalatroEngine) => Deck;
  enabled: (ctx: BalatroEngine) => void;
}

const basicDeckStrategy = generateDeck();
const twoColorStrategy = generateDeckTwoSuit();
const noFaceStrategy = generateDeckNoFace();

function createRedDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_red_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enabled: (ctx: BalatroEngine) => {},
  };
}

function createBlueDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_blue_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enabled: (ctx: BalatroEngine) => {},
  };
}

function createYellowDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_yellow_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enabled: (ctx: BalatroEngine) => {},
  };
}

function createGreenDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_green_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enabled: (ctx: BalatroEngine) => {},
  };
}

function createBaseDeck({ configId }: { configId: DeckConfigId }): DeckImpl {
  return {
    ...getDeckConfig(configId),
    configId,
    deckStrategy: () => generateDeck(),
    enabled: () => {},
  };
}

export const decks: DeckImpl[] = [
  createRedDeck(),
  createBlueDeck(),
  createYellowDeck(),
  createGreenDeck(),
];
