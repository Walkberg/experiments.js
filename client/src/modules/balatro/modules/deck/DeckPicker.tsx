import { ReactNode, useState } from "react";
import { DeckUI } from "./Deck";
import { Button } from "@/components/ui/button";
import { useDecks } from "./useDecks";
import { getDeckConfig } from "../../decks/decks";

export const DeckPicker = () => {
  const [currentDeck, setCurrentDeck] = useState<string | null>(null);
  const { decks } = useDecks();

  const selectedDeck =
    decks.find((deck) => deck.name === currentDeck) ?? decks[0];

  if (selectedDeck == null) {
    return null;
  }

  const deckConfig = getDeckConfig(selectedDeck.configId);

  const handleNextDeck = () => {
    const currentIndex = decks.findIndex((deck) => deck.name === currentDeck);
    const nextIndex = (currentIndex + 1) % decks.length;
    setCurrentDeck(decks[nextIndex].name);
  };

  const handlePreviousDeck = () => {
    const currentIndex = decks.findIndex((deck) => deck.name === currentDeck);
    const previousIndex = (currentIndex - 1) % decks.length;
    setCurrentDeck(decks[previousIndex].name);
  };

  return (
    <>
      <ContainerBis>
        <ArrowButton onClick={handlePreviousDeck}>{"<"}</ArrowButton>
        <Container>
          <div className="m-2">
            <DeckUI configId={selectedDeck.configId} />
          </div>
          <div className="flex flex-col bg-gray-400 p-2 rounded-2xl items-center">
            <div className="text-white">{deckConfig.name}</div>
            <div className="bg-white p-2 rounded-2xl">
              {deckConfig.description}
            </div>
          </div>
          <div className="flex flex-col">*</div>
        </Container>
        <ArrowButton onClick={handleNextDeck}>{">"}</ArrowButton>
      </ContainerBis>
      <ContainerBis>
        <ArrowButton onClick={() => {}}>{"<"}</ArrowButton>
        <Container>
          <div className="flex flex-col bg-gray-400 p-2 rounded-2xl items-center">
            <div className="text-white">Jeu rouge</div>
            <div className="bg-white p-2 rounded-2xl">
              +1 défause <br /> à chaque manche
            </div>
          </div>
        </Container>
        <ArrowButton onClick={() => {}}>{">"}</ArrowButton>
      </ContainerBis>
    </>
  );
};

interface ContainerBisProps {
  children: ReactNode;
}

const ContainerBis = ({ children }: ContainerBisProps) => {
  return <div className="flex flex-row gap-4">{children}</div>;
};

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="flex flex-row bg-gray-800 m-4 p-8 rounded-2xl g-4">
      {children}
    </div>
  );
};

interface ArrowButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const ArrowButton = ({ children, onClick }: ArrowButtonProps) => {
  return (
    <Button className="bg-red-500 h-full hover:bg-red-900 " onClick={onClick}>
      {children}
    </Button>
  );
};
