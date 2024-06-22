import React, { useState } from "react";
import { createContext, useContext, useRef } from "react";
import { Card, createCards } from "./batteground";
import { BattlegroundApi, FakeBattlegroundApi } from "./battleground-api";

type CardRefs = React.MutableRefObject<Map<string, HTMLDivElement | null>>;

type BattlegroundProviderProps = {
  children: React.ReactNode;
};

type BattlegroundProviderState = {
  id: string;
  cardRefs: CardRefs | null;
};

const initialState: BattlegroundProviderState = {
  id: "1",
  cardRefs: null,
};

const BattleGroundProviderContext =
  createContext<BattlegroundProviderState>(initialState);

export function BattlegroundProvider({ children }: BattlegroundProviderProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const value = { ...initialState, cardRefs };

  return (
    <BattleGroundProviderContext.Provider value={value}>
      {children}
    </BattleGroundProviderContext.Provider>
  );
}

type BattlegroundApiProviderProps = {
  children: React.ReactNode;
};

type BattlegroundApiProviderState = {
  battlegroundApi: BattlegroundApi;
};

const initialStateA: BattlegroundApiProviderState = {
  battlegroundApi: new FakeBattlegroundApi(),
};

const BattleGroundApiProviderContext =
  createContext<BattlegroundApiProviderState>(initialStateA);

export function BattlegroundApiProvider({
  children,
}: BattlegroundApiProviderProps) {
  return (
    <BattleGroundApiProviderContext.Provider value={initialStateA}>
      {children}
    </BattleGroundApiProviderContext.Provider>
  );
}

export const useBattleground = () => {
  const context = useContext(BattleGroundProviderContext);

  if (context === undefined)
    throw new Error(
      "useBattleground must be used within a BattlegroundProvider"
    );

  return context;
};

export const useCardRefs = () => {
  const context = useContext(BattleGroundProviderContext);

  if (context === undefined || context.cardRefs === null)
    throw new Error(
      "useBattleground must be used within a BattlegroundProvider"
    );

  return context.cardRefs;
};

export const useShop = () => {
  const battlegroundApi = useBattlegroundApi();

  const [shopSize, setShopSize] = useState<number>(5);
  const [cards, setCards] = useState<Card[]>(createCards(shopSize));

  const roll = async () => {
    const playerCards = await battlegroundApi.getShop();
    setCards(playerCards.cards);
  };

  return { cards, roll };
};

export const useBattlegroundApi = () => {
  const context = useContext(BattleGroundApiProviderContext);

  if (context == null) {
    throw new Error(
      "useBattlegroundApi must be used within a BattlegroundApiProvider"
    );
  }

  return context.battlegroundApi;
};

const useCardAnimation = () => {
  const cardRefs = useCardRefs();
};

export function usePlayerHand() {
  const [hand, setHand] = useState<Card[]>([]);

  function addCard(card: Card) {
    setHand((prev) => [...prev, card]);
  }

  function removeCard(cardId: string) {
    setHand((prev) => prev.filter((card) => card.id !== cardId));
  }

  return {
    hand,
    removeCard,
    addCard,
    canAddCard: hand.length < 5,
  };
}
