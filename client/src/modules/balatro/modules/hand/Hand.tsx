import { Button } from "@/components/ui/button";
import { CardContainer } from "../../BalatroPage";
import { PlayCard } from "../../Card";
import { useEffect, useState } from "react";
import { sortByRank, sortBySuit } from "../../balatro";
import { PokerCard as ICard } from "../../cards/poker-cards";
import { useCurrentGame } from "../../BalatroProvider";
import { HandManagerPlugin } from "../../plugins";

interface HandProps {}

export const Hand = ({}: HandProps) => {
  const { balatro } = useCurrentGame();

  const handPlugin = balatro?.getPlugin<HandManagerPlugin>("hand");

  const [sortBy, setSortBy] = useState<"rank" | "suit">("rank");
  const [selectedCard, setSelectedCard] = useState<string[]>([]);

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    balatro?.onEvent("phase-changed", () => setRerender((prev) => !prev));
  }, [balatro]);

  useEffect(() => {
    if (balatro == null) {
      return;
    }

    balatro.onEvent("card-selected", (data: { cardId: string }) => {
      setSelectedCard((prev) => [...prev, data.cardId]);
    });
    balatro.onEvent("card-unselected", (data: { cardId: string }) =>
      setSelectedCard((prev) => prev.filter((id) => id !== data.cardId))
    );
    balatro.onEvent("card-upgraded", (data) => setRerender((prev) => !prev));
  }, [balatro]);

  if (handPlugin == null) {
    return null;
  }

  const hand = handPlugin.getHand();

  const sortedHand = sortBy === "rank" ? sortByRank(hand) : sortBySuit(hand);

  function handlePlayHand() {
    if (selectedCard.length === 0 || handPlugin == null) {
      return;
    }
    handPlugin.playHand(selectedCard);

    setSelectedCard([]);
  }

  function onSelectCard(card: ICard) {
    if (handPlugin == null) {
      return;
    }

    if (selectedCard.includes(card.id)) {
      handPlugin.unSelectCard(card.id);
    } else {
      handPlugin.selectCard(card.id);
    }
  }

  function handleDiscard() {
    if (handPlugin == null) {
      return;
    }
    handPlugin.discardHand(selectedCard);

    setSelectedCard([]);
  }

  return (
    <div>
      <CardContainer>
        <div className="flex flex-row items-center gap-2">
          {sortedHand.map((handCard) => (
            <div className="relative">
              <PlayCard
                selected={selectedCard.includes(handCard.id)}
                key={handCard.id}
                onSelectCard={() => onSelectCard(handCard)}
                card={handCard}
              />
            </div>
          ))}
        </div>
      </CardContainer>
      <PlayerActions
        handlePlayHand={handlePlayHand}
        setSortBy={setSortBy}
        handleDiscard={handleDiscard}
        canDiscard={handPlugin.getRemainingDiscards() > 0}
      />
    </div>
  );
};

interface HandSortProps {
  onSortByRank: () => void;
  onSortBySuit: () => void;
}

export const HandSort = ({ onSortByRank, onSortBySuit }: HandSortProps) => {
  return (
    <div className="flex flex-col items-center">
      <div>Sort Hand</div>
      <div className="flex flex-row items-center gap-2">
        <Button className="bg-yellow-600" onClick={onSortByRank}>
          Rank
        </Button>
        <Button className="bg-yellow-600" onClick={onSortBySuit}>
          Suit
        </Button>
      </div>
    </div>
  );
};

type SortBy = "rank" | "suit";

interface PlayerActionsProps {
  handlePlayHand: () => void;
  setSortBy: (sortBy: SortBy) => void;
  handleDiscard: () => void;
  canDiscard: boolean;
}

function PlayerActions({
  handlePlayHand,
  setSortBy,
  handleDiscard,
  canDiscard,
}: PlayerActionsProps) {
  return (
    <div className="flex flex-row items-center gap-4 justify-center">
      <Button className="bg-blue-600" onClick={handlePlayHand}>
        Play Hand
      </Button>
      <HandSort
        onSortByRank={() => setSortBy("rank")}
        onSortBySuit={() => setSortBy("suit")}
      />
      <Button
        className="bg-red-600"
        disabled={!canDiscard}
        onClick={handleDiscard}
      >
        Discard
      </Button>
    </div>
  );
}
