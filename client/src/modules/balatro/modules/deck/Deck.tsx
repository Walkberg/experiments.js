import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCurrentGame } from "../../BalatroProvider";
import { DeckManagerPlugin } from "../../plugins";
import { useEffect, useState } from "react";
import { Deck as IDeck } from "../../balatro";
import { CardRank, CardSuit, PokerCard } from "../../cards/poker-cards";
import { PlayCard } from "../cards/Card";
import { PlayCards } from "../cards/PokerCards";

function useDeck() {
  const [fullDeck, setFullDeck] = useState<IDeck | null>(null);
  const [deck, setDeck] = useState<IDeck | null>(null);

  const { balatro } = useCurrentGame();

  useEffect(() => {
    if (balatro == null) {
      return;
    }

    const manager = balatro.getPlugin<DeckManagerPlugin>("deck");

    if (manager == null) {
      return;
    }

    balatro.onEvent("deck-generated", () => setDeck(manager.getCurrentDeck()));
    balatro.onEvent("deck-generated", () => setFullDeck(manager.getFullDeck()));

    balatro.onEvent("deck-generated", () => setFullDeck(manager.getFullDeck()));

    setDeck(manager.getCurrentDeck());
    setFullDeck(manager.getFullDeck());
  }, [balatro]);

  console.log("deck", deck);
  console.log("full", fullDeck);

  return { deck, fullDeck };
}

interface DeckProps {}

export const Deck = ({}: DeckProps) => {
  const { deck, fullDeck } = useDeck();

  console.log("deck", deck);
  console.log("fullDeck", fullDeck);

  if (deck == null || fullDeck == null) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Dialog>
        <DialogTrigger>
          <DeckUI />
        </DialogTrigger>
        <DialogContent className="max-w-screen-2xl">
          <DeckDetail fullDeck={fullDeck} deck={deck} />
        </DialogContent>
      </Dialog>
      <div className="flex justify-items-end">
        <div className=" text-white">
          {deck?.length}/{fullDeck?.length}
        </div>
      </div>
    </div>
  );
};

const DeckShadow = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gray-400  z-10 -translate-x-3 translate-y-3 rounded-2xl border" />
      <div className="absolute inset-0 bg-gray-400  z-10 -translate-x-2 translate-y-2 rounded-2xl border" />
      <div className=" absolute inset-0 bg-gray-400  z-10 -translate-x-1 translate-y-1 rounded-2xl border" />
    </div>
  );
};

export const DeckUI = () => {
  return (
    <div className="flex relative">
      <div
        style={{
          width: "144px",
          height: "190px",
          backgroundSize: "700%",
          backgroundPosition: "top left",
          overflow: "hidden",
          imageRendering: "pixelated",
        }}
        className="z-50 cursor-pointer card-enhancer hover:scale-125"
      />
      <DeckShadow />
    </div>
  );
};

interface DeckDetailProps {
  fullDeck: IDeck;
  deck: IDeck;
}

export const DeckDetail = ({ deck, fullDeck }: DeckDetailProps) => {
  const groupedDeck = groupAndSortDeck(fullDeck, deck);

  return (
    <div className="grid grid-rows-4  gap-2">
      {Object.entries(groupedDeck).map(([suit, cards]) => (
        <DeckRow suit={suit as CardSuit} cards={cards} />
      ))}
    </div>
  );
};

export const DeckRow = ({
  suit,
  cards,
}: {
  suit: CardSuit;
  cards: PokerCard[];
}) => {
  return (
    <div key={suit} className="flex flex-row gap-2 h-40">
      <div className="text-lg font-bold text-black capitalize">{suit}</div>
      <div className="flex flex-row gap-2 w-full">
        <PlayCards pokerCards={cards} />
      </div>
    </div>
  );
};

const rankOrder: CardRank[] = [
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

function groupAndSortDeck(fullDeck: IDeck, deck: IDeck) {
  const suits: Record<CardSuit, PokerCard[]> = {
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: [],
  };

  for (const card of fullDeck) {
    suits[card.suit].push(card);
  }

  for (const suit in suits) {
    suits[suit as CardSuit].sort(
      (a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)
    );
  }

  const remainingCardIds = new Set(deck.map((card) => card.id));
  for (const suit in suits) {
    suits[suit as CardSuit] = suits[suit as CardSuit].map((card) => ({
      ...card,
      isGrayed: !remainingCardIds.has(card.id),
    }));
  }

  return suits;
}
