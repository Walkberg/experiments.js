import { PokerCard as IPokerCard } from "../../cards/poker-cards";
import { PokerCard } from "./PokerCard";

interface PlayCardsProps {
  pokerCards: IPokerCard[];
  onSelectCard?: (card: IPokerCard) => void;
  selectedCards?: string[];
  bottomComponent?: React.ReactNode;
  scaleFactor?: number;
}

export const PlayCards = ({
  pokerCards,
  onSelectCard,
  selectedCards,
  bottomComponent,
  scaleFactor,
}: PlayCardsProps) => {
  return (
    <div className="relative flex justify-between shrink h-full w-full mr-40">
      {pokerCards.map((card, index) => (
        <div className="relative" key={card.id}>
          <div className={`absolute hover:z-40`}>
            <PokerCard
              card={card}
              onSelectCard={() => onSelectCard?.(card)}
              selected={selectedCards?.includes(card.id)}
              bottomComponent={bottomComponent}
              scaleFactor={scaleFactor}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
