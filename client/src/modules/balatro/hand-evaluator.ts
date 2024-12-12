import { Hand, PokerHandType, sortByRank } from "./balatro";
import { CardRank, CardSuit } from "./cards/poker-cards";

export function evaluatePokerHand(hand: Hand): PokerHandType {
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

interface PokerHandStrategy {
  getScoringHand(hand: Hand): Hand;
}

const strategies: Record<PokerHandType, PokerHandStrategy> = {
  RoyalFlush: {
    getScoringHand: (hand: Hand) => getRoyalFlush(hand),
  },
  StraightFlush: {
    getScoringHand: (hand: Hand) => getStraightFlush(hand),
  },
  FourOfAKind: {
    getScoringHand: (hand: Hand) => getFourOfAKind(hand),
  },
  FullHouse: {
    getScoringHand: (hand: Hand) => getFullHouse(hand),
  },
  Flush: {
    getScoringHand: (hand: Hand) => getFlush(hand),
  },
  Straight: {
    getScoringHand: (hand: Hand) => getStraight(hand),
  },
  ThreeOfAKind: {
    getScoringHand: (hand: Hand) => getThreeOfAKind(hand),
  },
  TwoPair: {
    getScoringHand: (hand: Hand) => getTwoPair(hand),
  },
  OnePair: {
    getScoringHand: (hand: Hand) => getPair(hand),
  },
  HighCard: {
    getScoringHand: (hand: Hand) => getHighCard(hand),
  },
};

export function getScoringHand(hand: Hand): Hand[] {
  const scoringHands: Hand[] = [];

  for (const type in strategies) {
    const strategy = strategies[type as PokerHandType];
    const currentHand = strategy.getScoringHand(hand);
    if (currentHand.length >= 1) {
      console.log("socring strategy" + type);
      scoringHands.push(currentHand);
    }
  }

  return scoringHands;
}

export function getRoyalFlush(hand: Hand): Hand {
  return getStraightFlush(hand).filter((card) => card.rank === "A");
}

export function getStraightFlush(hand: Hand): Hand {
  const flush = getFlush(hand);
  const straightFlush = getStraight(flush);
  return straightFlush.length >= 5 ? straightFlush : [];
}

export function getFourOfAKind(hand: Hand): Hand {
  const counts = groupByRank(hand);
  const fourOfAKindRank = Object.keys(counts).find(
    (rank) => counts[rank as CardRank] === 4
  ) as CardRank;
  return hand.filter((card) => card.rank === fourOfAKindRank);
}

export function getFullHouse(hand: Hand): Hand {
  const threeOfAKind = getThreeOfAKind(hand);

  if (threeOfAKind.length === 0) {
    return [];
  }
  const remainingCards = hand.filter((card) => !threeOfAKind.includes(card));
  const onePair = getPair(remainingCards);
  return threeOfAKind.concat(onePair);
}

export function getFlush(hand: Hand): Hand {
  const suitCounts = groupBySuit(hand);

  const flushSuit = Object.keys(suitCounts).find(
    (suit) => suitCounts[suit as CardSuit] >= 5
  );

  return flushSuit ? hand.filter((card) => card.suit === flushSuit) : [];
}

export function getStraight(hand: Hand): Hand {
  const values = [...new Set(hand.map((card) => getCardValue(card.rank)))].sort(
    (a, b) => a - b
  );
  for (let i = 0; i <= values.length - 5; i++) {
    const straight = values.slice(i, i + 5);
    if (straight[4] - straight[0] === 4) {
      return hand.filter((card) => straight.includes(getCardValue(card.rank)));
    }
  }
  return [];
}

export function getThreeOfAKind(hand: Hand): Hand {
  const counts = groupByRank(hand);
  const threeOfAKindRank = Object.keys(counts).find(
    (rank) => counts[rank as CardRank] === 3
  ) as CardRank;
  return hand.filter((card) => card.rank === threeOfAKindRank);
}

export function getTwoPair(hand: Hand): Hand {
  const pairs = groupByRank(hand);
  const pairRanks = Object.keys(pairs).filter(
    (rank) => pairs[rank as CardRank] === 2
  ) as CardRank[];
  return hand.filter((card) => pairRanks.includes(card.rank));
}

export function getPair(hand: Hand): Hand {
  return hasNOfAKind(hand, 2)
    ? hand.filter(
        (card) => hand.filter((c) => c.rank === card.rank).length === 2
      )
    : [];
}

export function getHighCard(hand: Hand): Hand {
  return hand
    .sort((a, b) => getCardValue(b.rank) - getCardValue(a.rank))
    .slice(0, 1);
}

function groupByRank(hand: Hand): Record<CardRank, number> {
  const groupByRank = hand.reduce((acc, card) => {
    acc[card.rank] = (acc[card.rank] || 0) + 1;
    return acc;
  }, {} as Record<CardRank, number>);

  return groupByRank;
}

function groupBySuit(hand: Hand): Record<CardSuit, number> {
  const groupBySuit = hand.reduce((acc, card) => {
    acc[card.suit] = (acc[card.suit] || 0) + 1;
    return acc;
  }, {} as Record<CardSuit, number>);

  return groupBySuit;
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
  if (hand.length < 5) {
    return false;
  }
  const suit = hand[0].suit;
  return hand.every((card) => card.suit === suit);
}

export function isStraight(hand: Hand): boolean {
  const values = hand
    .map((card) => getCardValue(card.rank))
    .sort((a, b) => a - b);

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] + 1 !== values[i + 1]) {
      return false;
    }
  }
  return values.length > 4;
}

export function isThreeOfAKind(hand: Hand): boolean {
  return hasNOfAKind(hand, 3);
}

export function isTwoPair(hand: Hand): boolean {
  const pairs = groupByRank(hand);
  return Object.values(pairs).filter((count) => count === 2).length === 2;
}

export function isOnePair(hand: Hand): boolean {
  return hasNOfAKind(hand, 2);
}

export function hasNOfAKind(hand: Hand, n: number): boolean {
  const counts = groupByRank(hand);
  return Object.values(counts).some((count) => count === n);
}

export function getCardValue(value: CardRank): number {
  if (value === "A") return 14;
  if (value === "K") return 13;
  if (value === "Q") return 12;
  if (value === "J") return 11;
  return parseInt(value, 10);
}
