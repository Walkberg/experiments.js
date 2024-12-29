import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import { DeckImpl } from "../../decks/decks";
import { getDecksPlugin } from "../../plugins/decks-manager-plugin";

export const useDecks = () => {
  const { balatro } = useCurrentGame();

  const [decks, setDecks] = useState<DeckImpl[]>([]);

  useEffect(() => {
    console.log("deckPlugin sqdsqdsq", balatro);
    if (balatro == null) return;

    console.log("deckPlugin", "deckPlugin");

    const deckPlugin = getDecksPlugin(balatro);

    setDecks(deckPlugin.getDecks());
  }, [balatro]);

  return {
    decks,
  };
};
