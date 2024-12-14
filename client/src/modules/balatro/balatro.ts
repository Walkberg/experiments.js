import { evaluatePokerHand, getCardValue } from "./hand-evaluator";
import { PokerCard, Edition, CardSuit, CardRank } from "./cards/poker-cards";

export type Chip = number;

export type Multiplier = number;

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

export type Score = { chip: Chip; multiplier: Multiplier };

export type Rarety = "common" | "uncommon" | "rare" | "legendary";

export type HandScore = {
  handType: PokerHandType;
  chip: Chip;
  multiplier: Multiplier;
  score: Score;
};

export type PlayerConfig = {
  maxHandSize: number;
  maxItemCount: number;
  maxBuffonCount: number;
};

export interface Player {
  id: string;
  deck: Deck;
  hand: Hand;
  buffons: BuffonsSlot;
  handScore: HandScore;
  baseScoreList: BaseScoreList;
  config: PlayerConfig;
}

export interface Shop {
  cards: BuyableItem<PokerCard>[];
  packs: BuyableItem<CardPack>[];
}

export type Pack<T> = T[];

export type PlayedHand = PokerCard[];

export type Hand = PokerCard[];

export type Deck = PokerCard[];

export type CardPack = Pack<PokerCard>;

export type Price = number;

export type BuffonId = string;

export type TarorType =
  | "theFool"
  | "theMagician"
  | "theHighPriestess"
  | "theEmpress"
  | "theEmperor"
  | "theHierophant"
  | "theLovers"
  | "theChariot"
  | "justice"
  | "theHermit"
  | "wheelOfFortune"
  | "strength"
  | "theHangedMan"
  | "death"
  | "temperance"
  | "theDevil"
  | "theTower"
  | "theStar"
  | "theMoon"
  | "theSun"
  | "judgment"
  | "theWorld";

export type PlanetType =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type Buffon = {
  id: BuffonId;
  rarety: Rarety;
} & Edition;

export type PlanetCard = { id: string };

export type TarotCard = { id: string };

export type SpectralCard = { id: string };

export type ItemCard = PlanetCard | TarotCard;

export type BuffonPack = Pack<Buffon>;

export type BuffonsSlot = SellableItem<Buffon>[];

export type BuyableItem<T> = { buyPrice: Price } & T;

export type SellableItem<T> = { sellPrice: Price } & T;

export type BaseScore = {
  chip: Chip;
  multiplier: Multiplier;
  level: number;
  playedCount: number;
};

export type BaseScoreList = Record<PlanetType, BaseScore>;

export type BaseScoreListAddition = Record<PlanetType, Score>;

export const addition: BaseScoreListAddition = {
  pluto: { chip: 10, multiplier: 1 },
  mercury: { chip: 15, multiplier: 1 },
  uranus: { chip: 20, multiplier: 1 },
  venus: { chip: 20, multiplier: 2 },
  saturn: { chip: 30, multiplier: 3 },
  jupiter: { chip: 15, multiplier: 2 },
  earth: { chip: 25, multiplier: 2 },
  mars: { chip: 30, multiplier: 3 },
  neptune: { chip: 40, multiplier: 4 },
};

export const baseScoreList: BaseScoreList = {
  pluto: { chip: 5, multiplier: 1, level: 1, playedCount: 0 },
  mercury: { chip: 10, multiplier: 2, level: 1, playedCount: 0 },
  uranus: { chip: 20, multiplier: 2, level: 1, playedCount: 0 },
  venus: { chip: 30, multiplier: 3, level: 1, playedCount: 0 },
  saturn: { chip: 30, multiplier: 4, level: 1, playedCount: 0 },
  jupiter: { chip: 35, multiplier: 4, level: 1, playedCount: 0 },
  earth: { chip: 40, multiplier: 4, level: 1, playedCount: 0 },
  mars: { chip: 60, multiplier: 7, level: 1, playedCount: 0 },
  neptune: { chip: 100, multiplier: 8, level: 1, playedCount: 0 },
};

export function improveBaseScoreList(
  baseScoreList: BaseScoreList,
  type: PlanetType
): BaseScoreList {
  const baseScore = baseScoreList[type];

  const additionScore = addition[type];

  return {
    ...baseScoreList,
    [type]: {
      ...baseScore,
      chip: baseScore.chip + additionScore.chip,
      multiplier: baseScore.multiplier + additionScore.multiplier,
      level: baseScore.level + 1,
    },
  };
}

export function getHandBaseScore(hand: Hand): Score {
  const handType = evaluatePokerHand(hand);
  return baseScoreList[convertHandTypeToPlanetType(handType)];
}

export function getBuyPrice<T>(item: BuyableItem<T>): Price {
  return item.buyPrice;
}

export function getSellPrice<T>(item: BuyableItem<T>): Price {
  return item.buyPrice;
}

export function generateShop(): Shop {
  return {
    cards: generateBuyableItems(generateCards(2)),
    packs: generateBuyableItems(generatePackCards(2)),
  };
}

export function generateBuyableItems<T>(items: T[]): BuyableItem<T>[] {
  return items.map((item) => ({
    sellPrice: 10,
    buyPrice: 5,
    ...item,
  }));
}

export function generateCards(cardCount: number): PokerCard[] {
  const cards: PokerCard[] = [];
  for (let i = 0; i < cardCount; i++) {
    cards.push(generateCard());
  }
  return cards;
}

export function generateCard(): PokerCard {
  let deck = generateDeck();
  deck = shuffle(deck);
  const [card, _] = drawCard(deck);
  return card;
}

export function generatePackCards(packCount: number): CardPack[] {
  const packs: CardPack[] = [];
  for (let i = 0; i < packCount; i++) {
    packs.push(generatePackCard(5));
  }
  return packs;
}

export function generatePackCard(cardCount: number): CardPack {
  let deck = generateDeck();
  deck = shuffle(deck);
  const [pack, _] = drawCards(deck, cardCount);
  return pack;
}

export function generateDeck(): Deck {
  const suits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];
  const ranks: CardRank[] = [
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

  let deck: Deck = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: `${suit}-${rank}`,
        enhancement: "none",
        edition: "base",
        seal: "none",
      });
    });
  });

  return shuffle(deck);
}

export function shuffle(deck: Deck): Deck {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const drawCard = (deck: Deck): [PokerCard, Deck] => {
  const card = deck[deck.length - 1];
  const newDeck = deck.slice(0, deck.length - 1);
  return [card, newDeck];
};

export const drawCards = (
  deck: Deck,
  cardCount: number
): [PokerCard[], Deck] => {
  const cards = deck.slice(-cardCount);
  const newDeck = deck.slice(0, -cardCount);
  return [cards, newDeck];
};

export const baseChipCard: Record<CardRank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11,
};

export function getBaseChip(card: PokerCard): number {
  return baseChipCard[card.rank];
}

export function getCardChips(value: CardRank): Chip {
  if (value === "A") return 14;
  if (value === "K") return 13;
  if (value === "Q") return 12;
  if (value === "J") return 11;
  return parseInt(value, 10);
}

export function getNextCardRank(value: CardRank): CardRank {
  const ranks: CardRank[] = [
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
  const currentIndex = ranks.indexOf(value);

  if (currentIndex === -1) {
    throw new Error(`Invalid CardRank: ${value}`);
  }

  const nextIndex = (currentIndex + 1) % ranks.length;
  return ranks[nextIndex];
}

export function getDeckSize(deck: Deck): number {
  return deck.length;
}

export function sortBySuit(hand: Hand): Hand {
  return hand.sort((a, b) => {
    const valueA = getCardChips(a.rank);
    const valueB = getCardChips(b.rank);

    if (a.suit === b.suit) {
      return valueA > valueB ? 1 : -1;
    }
    return a.suit > b.suit ? 1 : -1;
  });
}

export function sortByRank(hand: Hand): Hand {
  return hand.sort((a, b) => {
    const valueA = getCardValue(a.rank);
    const valueB = getCardValue(b.rank);

    if (valueA === valueB) {
      return a.suit > b.suit ? 1 : -1;
    }
    return valueA > valueB ? 1 : -1;
  });
}

export function getCardLabel(card: PokerCard): string {
  return `${card.rank} of ${getCardSuit(card.suit)}`;
}

export function getCardSuit(card: CardSuit): string {
  switch (card) {
    case "hearts":
      return "${heartsc}";
    case "diamonds":
      return "${diamondsc}";
    case "clubs":
      return "${clubsc}";
    case "spades":
      return "${spadesc}";
  }
}

export function computePlayerHand(player: Player): Score {
  let baseScore = getHandBaseScore(player.hand);

  for (let i = 0; i < player.hand.length; i++) {
    const card = player.hand[i];

    const chip = getCardChips(card.rank);
    baseScore = addChipToScore(baseScore, chip);
  }

  for (let i = 0; i < player.buffons.length; i++) {
    const buffon = player.buffons[i];
  }

  return baseScore;
}

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

export function addChipToScore(score: Score, chip: Chip): Score {
  return {
    ...score,
    chip: score.chip + chip,
  };
}

export function addMultiplierToScore(
  score: Score,
  multiplier: Multiplier
): Score {
  return {
    ...score,
    multiplier: score.multiplier + multiplier,
  };
}

export function multiplyMultiplierToScore(
  score: Score,
  multiplier: Multiplier
): Score {
  return {
    ...score,
    multiplier: score.multiplier * multiplier,
  };
}

export const fakePlayer: Player = {
  id: "player1",
  deck: generateDeck(),
  buffons: [],
  hand: [],
  handScore: {
    handType: "RoyalFlush",
    chip: 100,
    multiplier: 10,
    score: {
      chip: 100,
      multiplier: 10,
    },
  },
  baseScoreList: baseScoreList,
  config: {
    maxBuffonCount: 6,
    maxHandSize: 6,
    maxItemCount: 3,
  },
};
