import { Button } from "@/components/ui/button";
import { CardContainer } from "../../BalatroPage";
import { PlayCard } from "../cards/Card";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { sortByRank, sortBySuit } from "../../balatro";
import { PokerCard as ICard } from "../../cards/poker-cards";
import { useCurrentGame } from "../../BalatroProvider";
import { HandManagerPlugin } from "../../plugins";
import { Hand as IHand } from "../../balatro";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { PlayCards } from "../cards/PokerCards";

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
    handPlugin.playHand();

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
    handPlugin.discardHand();

    setSelectedCard([]);
  }

  return (
    <div className=" flex flex-col gap-2">
      <CardContainer>
        <PlayCards
          pokerCards={sortedHand}
          selectedCards={selectedCard}
          onSelectCard={onSelectCard}
        />
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

interface SortableItemsProps {
  children: ReactNode;
  hand: IHand;
}

const SortableItems = ({ children, hand }: SortableItemsProps) => {
  const [items, setItems] = useState(hand.map((card) => card.id.toString()));
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setItems(hand.map((card) => card.id.toString()));
  }, [hand]);

  console.log("items", items);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("drag start", event.active.id);
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over!.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  const activeCard = hand.find((card) => card.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeCard ? <PlayCard card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transition: transition || undefined,
  };

  return (
    <div id={id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
