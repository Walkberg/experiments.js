import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useEffect, ReactNode } from "react";

export const CardGamePage = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const [cards, setCards] = useState<Card[]>([
    { id: "card-1" },
    { id: "card-2" },
    { id: "card-3" },
    { id: "card-4" },
  ]);

  useEffect(() => {
    const myGame = createMyGame();
    setGame(myGame);

    myGame.onCardPicked((card) =>
      setMessages((prev) => [...prev, `Card ${card.id} picked`])
    );

    myGame.onCardDiscard((card) =>
      setMessages((prev) => [...prev, `Card ${card.id} discarded`])
    );

    myGame.onModActivated((mod) =>
      setMessages((prev) => [...prev, `Mod ${mod.name} activated`])
    );

    myGame.onModDisabled((mod) =>
      setMessages((prev) => [...prev, `Mod ${mod.name} disabled`])
    );

    addMod1(myGame);

    return () => removeMod("mon-mod", myGame);
  }, []);

  const addMod1 = (game: Game) => {
    const mod = createNewMod("mon-mod");

    game.addMod(mod);

    mod.onCardPicked((card) =>
      setMessages((prev) => [
        ...prev,
        `Card ${card.id} picked from mod ${mod.name}`,
      ])
    );
    mod.onCardDiscard((card) =>
      setMessages((prev) => [
        ...prev,
        `Card ${card.id} discarded from mod ${mod.name}`,
      ])
    );
  };

  const addMod2 = (game: Game) => {
    const mod = createNewMod("mon-mod-2");

    game.addMod(mod);

    mod.onCardPicked((card) =>
      setMessages((prev) => [
        ...prev,
        `Card ${card.id} picked from mod ${mod.name}`,
      ])
    );
    mod.onCardDiscard((card) =>
      setMessages((prev) => [
        ...prev,
        `Card ${card.id} discarded from mod ${mod.name}`,
      ])
    );
  };

  const handleChange = (value: boolean) => {
    if (game == null) {
      return;
    }
    if (value) {
      addMod1(game);
    } else {
      game.removeMod("mon-mod");
    }
  };

  const handleChange2 = (value: boolean) => {
    if (game == null) {
      return;
    }
    if (value) {
      addMod2(game);
    } else {
      game.removeMod("mon-mod-2");
    }
  };

  const handlePickCard = (card: Card) => {
    if (game == null) {
      return;
    }
    game.pickCard(card);
  };

  const handleDiscardCard = (card: Card) => {
    if (game == null) {
      return;
    }
    game.discardCard(card);
  };

  if (game == null) {
    return <div>loading</div>;
  }

  return (
    <div>
      game: {game.mods.length} activé
      <div>
        Activer mon mod{" "}
        <Checkbox
          checked={game.hasMod("mon-mod")}
          onClick={() => handleChange(!game.hasMod("mon-mod"))}
        />
        Activer mon mod{" "}
        <Checkbox
          checked={game.hasMod("mon-mod-2")}
          onClick={() => handleChange2(!game.hasMod("mon-mod-2"))}
        />
      </div>
      <CardList cards={game.shop} actions={<div>actions</div>} />
      <CardList cards={game.board} actions={<div>actions</div>} />
      <CardList cards={game.hand} actions={<div>actions</div>} />
      <div>
        {messages.map((message, key) => (
          <div key={key}>{message}</div>
        ))}
      </div>
    </div>
  );
};

const CardList = ({
  cards,
  actions,
}: {
  cards: Card[];
  actions: ReactNode;
}) => {
  return (
    <div
      className="flex flex-row 
    "
    >
      {cards.map((card) => (
        <Card key={card.id}>
          {card.id} {actions}
        </Card>
      ))}
    </div>
  );
};

interface Card {
  id: string;
}

type CardCallBack = (card: Card) => Promise<void> | void;

type ModCallBack = (mod: Mod) => Promise<void> | void;

interface Game {
  discardCard: (card: Card) => void;
  pickCard: (card: Card) => void;
  hasMod: (modName: string) => boolean;
  addMod: (mod: Mod) => void;
  removeMod: (modName: string) => void;
  onCardPicked: (callback: CardCallBack) => void;
  onCardDiscard: (callback: CardCallBack) => void;
  onModActivated: (callback: ModCallBack) => void;
  onModDisabled: (callback: ModCallBack) => void;
  shop: Card[];
  board: Card[];
  hand: Card[];
  mods: Mod[];
}

interface Mod {
  name: string;
  onCardPicked: (callback: CardCallBack) => void;
  onCardDiscard: (callback: CardCallBack) => void;

  cardPickCallbacks: Array<CardCallBack>;
  cardDiscardCallbacks: Array<CardCallBack>;
}

function createMyGame(): Game {
  const mods: Record<string, Mod> = {};

  let cardPickedCallbacks: Array<CardCallBack> = [];
  let cardDiscardedCallbacks: Array<CardCallBack> = [];

  let modActivateCallbacks: Array<ModCallBack> = [];
  let modDisableCallbacks: Array<ModCallBack> = [];

  let shop: Array<Card> = [{ id: "card-1" }, { id: "card-2" }];
  let hand: Array<Card> = [{ id: "card-1" }, { id: "card-2" }];
  let board: Array<Card> = [{ id: "card-1" }, { id: "card-2" }];

  function hasMod(modName: string) {
    return modName in mods;
  }

  function pickCard(card: Card) {
    cardPickedCallbacks.forEach((callback) => callback(card));

    Object.values(mods).forEach((mod) =>
      mod.cardPickCallbacks.forEach((callback) => callback(card))
    );
  }
  function discardCard(card: Card) {
    cardDiscardedCallbacks.forEach((callback) => callback(card));

    Object.values(mods).forEach((mod) =>
      mod.cardDiscardCallbacks.forEach((callback) => callback(card))
    );
  }

  function addMod(mod: Mod) {
    if (!hasMod(mod.name)) {
      mods[mod.name] = mod;
      modActivateCallbacks.forEach((callback) => callback(mod));
    }
  }

  function removeMod(modName: string) {
    if (hasMod(modName)) {
      const mod = mods[modName];
      modDisableCallbacks.forEach((callback) => callback(mod));
      delete mods[modName];
    }
  }

  return {
    board,
    hand,
    shop,
    pickCard: pickCard,
    discardCard: discardCard,
    hasMod: hasMod,
    addMod,
    removeMod,
    onCardPicked(callback: CardCallBack) {
      cardPickedCallbacks.push(callback);
    },
    onCardDiscard(callback: CardCallBack) {
      cardDiscardedCallbacks.push(callback);
    },
    onModActivated(callback: ModCallBack) {
      modActivateCallbacks.push(callback);
    },
    onModDisabled(callback: ModCallBack) {
      modDisableCallbacks.push(callback);
    },
    mods: Object.values(mods),
  };
}

function removeMod(modName: string, game: Game): void {
  game.removeMod(modName);
}

function createNewMod(name: string): Mod {
  let cardPickCallbacks: Array<CardCallBack> = [];
  let cardDiscardCallbacks: Array<CardCallBack> = [];

  return {
    name,
    cardPickCallbacks,
    cardDiscardCallbacks,
    onCardPicked(callback: CardCallBack) {
      cardPickCallbacks.push(callback);
    },
    onCardDiscard(callback: CardCallBack) {
      cardDiscardCallbacks.push(callback);
    },
  };
}
