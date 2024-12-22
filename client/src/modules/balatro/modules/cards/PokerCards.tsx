import { v4 as uuid } from "uuid";
import { Deck } from "../../balatro";
import { CardRank, CardSuit, PokerCard } from "../../cards/poker-cards";
import { PlayCard } from "./Card";

interface PlayCardsProps {
  pokerCards: PokerCard[];
  onSelectCard?: (card: PokerCard) => void;
  selectedCards?: string[];
}

export const PlayCards = ({
  pokerCards,
  onSelectCard,
  selectedCards,
}: PlayCardsProps) => {
  return (
    <div className="relative flex justify-between shrink h-full w-full mr-40">
      {pokerCards.map((card, index) => (
        <div className="relative" key={card.id}>
          <div className={`absolute hover:z-40`}>
            <PlayCard
              card={card}
              onSelectCard={() => onSelectCard?.(card)}
              selected={selectedCards?.includes(card.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PlayCardsTest = () => {
  const pokerCards = generateDeck();
  return <PlayCards pokerCards={pokerCards} />;
};

function generateDeck() {
  const suits: CardSuit[] = ["hearts"];
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
        id: uuid(),
        enhancement: "none",
        edition: "base",
        seal: "none",
      });
    });
  });

  return deck;
}
