import { v4 as uuid } from "uuid";
import { Card } from "../core/cards/card";
import { Plugin, Engine } from "../game";

export interface PoolManagerPlugin extends Plugin {
  addCard: (card: Card) => void;
  initialize: () => void;
  getRandomCard: (count: number) => Card[];
}

export function createPoolManagerPlugin(): PoolManagerPlugin {
  let _engine: Engine;

  let cards: Card[] = [];

  let pool: Card[] = [];

  function init(engine: Engine): void {
    _engine = engine;
    console.log("Pool Plugin initialized.");
  }

  function addCard(card: Card): void {
    cards.push(card);
  }

  function initialize(): void {
    cards.forEach((card) => {
      for (let i = 0; i < 5; i++) {
        pool.push({ ...card, id: uuid() });
      }
    });
  }

  function getRandomCard(count: number): Card[] {
    const randomCards: Card[] = [];

    const availableCards = pool.length;

    for (let i = 0; i < Math.min(count, availableCards); i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const card = pool[randomIndex];

      randomCards.push(card);

      pool.splice(randomIndex, 1);
    }

    return randomCards;
  }

  return {
    name: "pool",
    init,
    addCard,
    initialize,
    getRandomCard,
  };
}
