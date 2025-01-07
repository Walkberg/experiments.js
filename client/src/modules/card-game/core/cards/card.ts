import { v4 as uuid } from "uuid";

import { Engine } from "../../game";
import { ShopPlugin } from "../../plugins/shop-plugin";

export type CardFamiliy =
  | "beast"
  | "demon"
  | "dragon"
  | "elemental"
  | "mech"
  | "murloc"
  | "pirate"
  | "quillboar"
  | "neutral";

export type CardType = "minion" | "spell";

export type TavernTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Card = {
  id: string;
  name: string;
  description: string;
  image: string;
  cardFamily: CardFamiliy;
  cost: number;
  attack: number;
  health: number;
  tavernTier: TavernTier;
} & BuyableCard &
  CardEffect;

export type CardEffect = {
  hasEffect: (type: CardEffectType) => boolean;
  addEffect: (effect: Effect) => void;
  effects: Effect[];
};

export type CardEffectType = "battlecry" | "deathrattle" | "taunt";

export type Effect = Battlecry | Deathrattle;

export type Battlecry = {
  type: "battlecry";
  triggerBattleCry: (game: Engine) => void;
};

export type Deathrattle = {
  type: "deathrattle";
  triggerDeathrattle: (game: Engine) => void;
};

export type BuyableCard = { price: number };

export function createCards(count: number): Card[] {
  const cards: Card[] = [];

  for (let i = 0; i < count; i++) {
    cards.push(createCard());
  }

  return cards;
}

export function createCard(): Card {
  const effects: Effect[] = [];
  const i = Math.floor(Math.random() * 100);

  let battleCryCallback: (game: Engine) => void;

  function addBattleCry(callback: (game: Engine) => void) {
    console.log("addBattleCry cb", i, callback);
    battleCryCallback = callback;
  }

  function triggerBattleCry(game: Engine) {
    console.log("triggerBattleCry");
    if (hasBattleCry()) {
      battleCryCallback(game);
    }
  }

  function hasBattleCry() {
    return battleCryCallback != null;
  }

  function addEffect(effect: Effect) {
    effects.push(effect);
  }

  function hasEffect(type: CardEffectType) {
    return effects.some((effect) => effect.type === type);
  }

  return {
    id: uuid(),
    cardFamily: "neutral",
    name: "Card " + i,
    description: "Description " + i,
    image: "https://via.placeholder.com/150",
    tavernTier: 1,
    cost: 3,
    attack: i,
    health: i,
    effects: [],
    addEffect,
    hasEffect,
    price: 3,
  };
}

export const maSuperCard = createCard();

export const maSuperCard2 = createCard();
