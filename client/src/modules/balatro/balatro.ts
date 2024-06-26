export type Chip = number;

export type Multiplier = number;

export type CardSuit = "hearts" | "diamonds" | "clubs" | "spades";

export type CardRank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

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

export type EnhancementType =
  | "none"
  | "bonus"
  | "mult"
  | "wildcard"
  | "glass"
  | "steel"
  | "stone"
  | "gold"
  | "lucky";

export type EditionType =
  | "base"
  | "foil"
  | "holographic"
  | "polychrome"
  | "negative";

export type SealType = "none" | "gold" | "red" | "blue" | "purple";

export type Score = { chip: Chip; multiplier: Multiplier };

export type Rarety = "common" | "uncommon" | "rare" | "legendary";

export type HandScore = {
  handType: PokerHandType;
  chip: Chip;
  multiplier: Multiplier;
  score: Score;
};

export type PokerCard = {
  id: string;
  suit: CardSuit;
  rank: CardRank;
} & Edition &
  Enhancement &
  Seal;

export interface Player {
  id: string;
  deck: Deck;
  hand: Hand;
  handScore: HandScore;
  baseScoreList: BaseScoreList;
}

export interface Shop {
  cards: BuyableItem<PokerCard>[];
  packs: BuyableItem<CardPack>[];
}

export type Edition = { edition: EditionType };

export type Enhancement = { enhancement: EnhancementType };

export type Seal = { seal: SealType };

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
  | "justice"
  | "theHangedMan"
  | "death"
  | "temperance"
  | "theDevil"
  | "theTower"
  | "theStar"
  | "theMoon";

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

  return {
    ...baseScoreList,
    [type]: {
      ...baseScore,
      chip: baseScore.chip,
      multiplier: baseScore.multiplier,
      level: baseScore.level + 1,
    },
  };
}

export function getHandBaseScore(player: Player): Score {
  const handType = evaluateHand(player.hand);
  return player.baseScoreList[convertHandTypeToPlanetType(handType)];
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

export function evaluateHand(hand: Hand): PokerHandType {
  if (isRoyalFlush(hand)) return "RoyalFlush";
  if (isStraightFlush(hand)) return "StraightFlush";
  if (isFourOfAKind(hand)) return "FourOfAKind";
  if (isFullHouse(hand)) return "FullHouse";
  if (isFlush(hand)) return "Flush";
  if (isStraight(hand)) return "Straight";
  if (isThreeOfAKind(hand)) return "ThreeOfAKind";
  if (isTwoPair(hand)) return "TwoPair";
  if (isOnePair(hand)) return "OnePair";
  return "HighCard";
}

export function isRoyalFlush(hand: Hand): boolean {
  return isStraightFlush(hand) && hand.some((card) => card.rank === "A");
}

export function isStraightFlush(hand: Hand): boolean {
  return isFlush(hand) && isStraight(hand);
}

export function isFourOfAKind(hand: Hand): boolean {
  return hasNOfAKind(hand, 4);
}

export function isFullHouse(hand: Hand): boolean {
  return isThreeOfAKind(hand) && isOnePair(hand);
}

export function isFlush(hand: Hand): boolean {
  if (hand.length < 5) return false;
  const suit = hand[0].suit;
  return hand.every((card) => card.suit === suit);
}

export function isStraight(hand: Hand): boolean {
  const values = hand.map((card) => cardValue(card.rank)).sort((a, b) => a - b);
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] + 1 !== values[i + 1]) {
      return false;
    }
  }
  return true;
}

export function isThreeOfAKind(hand: Hand): boolean {
  return hasNOfAKind(hand, 3);
}

export function isTwoPair(hand: Hand): boolean {
  const pairs = hand.reduce((acc, card) => {
    acc[card.rank] = (acc[card.rank] || 0) + 1;
    return acc;
  }, {} as Record<CardRank, number>);
  return Object.values(pairs).filter((count) => count === 2).length === 2;
}

export function isOnePair(hand: Hand): boolean {
  return hasNOfAKind(hand, 2);
}

export function hasNOfAKind(hand: Hand, n: number): boolean {
  const counts = hand.reduce((acc, card) => {
    acc[card.rank] = (acc[card.rank] || 0) + 1;
    return acc;
  }, {} as Record<CardRank, number>);
  return Object.values(counts).some((count) => count === n);
}

export function cardValue(value: CardRank): Chip {
  if (value === "A") return 14;
  if (value === "K") return 13;
  if (value === "Q") return 12;
  if (value === "J") return 11;
  return parseInt(value, 10);
}

export function getDeckSize(deck: Deck): number {
  return deck.length;
}

export function sortBySuit(hand: Hand): Hand {
  return hand.sort((a, b) => {
    const valueA = cardValue(a.rank);
    const valueB = cardValue(b.rank);

    if (a.suit === b.suit) {
      return valueA > valueB ? 1 : -1;
    }
    return a.suit > b.suit ? 1 : -1;
  });
}

export function sortByRank(hand: Hand): Hand {
  return hand.sort((a, b) => {
    const valueA = cardValue(a.rank);
    const valueB = cardValue(b.rank);

    if (valueA === valueB) {
      return a.suit > b.suit ? 1 : -1;
    }
    return valueA > valueB ? 1 : -1;
  });
}

export function getCardLabel(card: PokerCard): string {
  return `${card.rank} of ${card.suit}`;
}

export function computePlayerHand(player: Player): Score {
  let baseScore = getHandBaseScore(player);

  for (let i = 0; i < player.hand.length; i++) {
    const card = player.hand[i];

    const value = cardValue(card.rank);
    baseScore = addChipToScore(baseScore, value);
  }

  return baseScore;
}

export function convertHandTypeToPlanetType(
  handType: PokerHandType
): PlanetType {
  switch (handType) {
    case "HighCard":
      return "mercury";
    case "OnePair":
      return "venus";
    case "TwoPair":
      return "earth";
    case "ThreeOfAKind":
      return "mars";
    case "Straight":
      return "jupiter";
    case "Flush":
      return "saturn";
    case "FullHouse":
      return "uranus";
    case "FourOfAKind":
      return "neptune";
    case "StraightFlush":
      return "pluto";
    case "RoyalFlush":
      return "pluto";
  }
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
};
