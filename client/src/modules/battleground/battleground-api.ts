import { Card, createCards } from "./batteground";

export interface BattlegroundApi {
  getShop(): Promise<Shop>;
}

interface Shop {
  cards: Card[];
}

export class FakeBattlegroundApi implements BattlegroundApi {
  async getShop(): Promise<Shop> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cards: Card[] = createCards(5);

    return {
      cards,
    };
  }
}
