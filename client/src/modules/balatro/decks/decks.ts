import { v4 as uuid } from "uuid";
import { Deck } from "../balatro";
import {
  CardRank,
  CardSuit,
  EnhancementType,
  PokerCard,
} from "../cards/poker-cards";
import { getSeedManagerPlugin } from "../plugins/seed-manager-plugin";
import { BalatroEngine } from "../balatro-engine";
import { getPlayerManagerPlugin } from "../plugins/player-manager-plugin";
import { getEconomyManagerPlugin } from "../plugins/economy-manager-plugin";

const allEnhancements: EnhancementType[] = [
  "none",
  "bonus",
  "mult",
  "wildcard",
  "glass",
  "steel",
  "stone",
  "gold",
  "lucky",
];

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

export function createBaseCard(
  rank: CardRank,
  suit: CardSuit,
  enhancement?: EnhancementType
): PokerCard {
  return {
    suit: suit,
    rank: rank,
    id: uuid(),
    enhancement: enhancement ?? "none",
    edition: "base",
    seal: "none",
  };
}

export function createRandomCard(randomStrategy: RandomStrategy): PokerCard {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = allRanks;

  return createBaseCard(
    ranks[Math.floor(randomStrategy.random() * ranks.length)],
    suits[Math.floor(randomStrategy.random() * suits.length)],
    allEnhancements[
      Math.floor(randomStrategy.random() * allEnhancements.length)
    ]
  );
}

function generateDeck(): Deck {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = allRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(createBaseCard(rank, suit));
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
      deck.push(createBaseCard(rank, suit));
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
      deck.push(createBaseCard(rank, suit));
    });
  });

  return deck;
}

interface RandomStrategy {
  random(): number;
}

function generateRandomDeck(randomStrategy: RandomStrategy): Deck {
  const suits: CardSuit[] = allSuits;
  const ranks: CardRank[] = allRanks;

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(createRandomCard(randomStrategy));
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
  d_abandonned_deck: {
    id: "d_abandonned_deck",
    name: "Deck abandone",
    description: "le deck abandone",
    position: {
      x: 3,
      y: 3,
    },
  },
  d_eratic_deck: {
    id: "d_eratic_deck",
    name: "Deck eratic",
    description: "le deck eratic",
    position: {
      x: 2,
      y: 3,
    },
  },
  d_checked_pattern_deck: {
    id: "d_checked_pattern_deck",
    name: "Deck damier",
    description: "le deck damier",
    position: {
      x: 1,
      y: 3,
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
  enable: (ctx: BalatroEngine) => void;
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
    enable: (ctx: BalatroEngine) => {
      getPlayerManagerPlugin(ctx).addMaxDiscardCount(1);
    },
  };
}

function createBlueDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_blue_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enable: (ctx: BalatroEngine) => {},
  };
}

function createYellowDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_yellow_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enable: (ctx: BalatroEngine) => getEconomyManagerPlugin(ctx).addMoney(10),
  };
}

function createGreenDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_green_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => basicDeckStrategy,
    enable: (ctx: BalatroEngine) => {},
  };
}

function createAbandonedDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_abandonned_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => noFaceStrategy,
    enable: (ctx: BalatroEngine) => {},
  };
}

function createEraticDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_eratic_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => {
      const seedManager = getSeedManagerPlugin(ctx);
      return generateRandomDeck(seedManager);
    },
    enable: (ctx: BalatroEngine) => {},
  };
}

function createCheckedPaternDeck(): DeckImpl {
  const baseDeck = createBaseDeck({
    configId: "d_checked_pattern_deck",
  });
  return {
    ...baseDeck,
    deckStrategy: (ctx: BalatroEngine) => twoColorStrategy,
    enable: (ctx: BalatroEngine) => {},
  };
}

function createBaseDeck({ configId }: { configId: DeckConfigId }): DeckImpl {
  return {
    ...getDeckConfig(configId),
    configId,
    deckStrategy: () => generateDeck(),
    enable: () => {},
  };
}

export const decks: DeckImpl[] = [
  createRedDeck(),
  createBlueDeck(),
  createYellowDeck(),
  createGreenDeck(),
  createAbandonedDeck(),
  createEraticDeck(),
  createCheckedPaternDeck(),
];
