import { Card } from "@/components/ui/card";
import {
  Deck as IDeck,
  Hand as IHand,
  PokerCard as ICard,
  Shop as IShop,
  Buffon as IBuffon,
  Score as IScore,
  getDeckSize,
  generateDeck,
  drawCards,
  CardSuit,
  sortByRank,
  sortBySuit,
  getHandBaseScore,
  getCardLabel,
  getBaseChip,
  generateShop,
  generateCards,
  generateBuyableItems,
  BuyableItem,
  evaluateHand,
  Player,
  BaseScoreList,
  BaseScore,
  PlanetType,
  fakePlayer,
  improveBaseScoreList,
} from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const BalatroPage = () => {
  const [deck, setDeck] = useState<IDeck>(generateDeck());
  const [hand, setHand] = useState<IHand>([]);

  const [buffons, setBuffons] = useState<IBuffon[]>([]);

  const [isShopOpened, setIsShopOpened] = useState(false);

  const [selectedCard, setSelectCard] = useState<IHand>([]);

  const [player, setPlayer] = useState<Player>(fakePlayer);

  const [sortBy, setSortBy] = useState<"rank" | "suit">("rank");

  useEffect(() => {
    drawCard(6);
  }, []);

  const handleDiscard = () => {
    if (selectedCard.length !== 0) {
      drawCard(selectedCard.length);
    }
  };

  const handlePlayHand = () => {};

  const handleSelectCard = (card: ICard) => {
    setSelectCard((prev) =>
      prev.find((c) => c.id === card.id)
        ? prev.filter((a) => a.id === card.id)
        : [...prev, card]
    );
  };

  function drawCard(cardCount: number) {
    const [drawedCards, newDeck] = drawCards(deck, cardCount);

    setHand((prev) => [
      ...prev.filter((card) => !selectedCard.includes(card)),
      ...drawedCards,
    ]);
    setDeck(newDeck);
    setSelectCard([]);
  }

  const handleImproveHand = () => {
    setPlayer((prev) => ({
      ...prev,
      baseScoreList: improveBaseScoreList(prev.baseScoreList, "earth"),
    }));
  };

  const sortedHand = sortBy === "rank" ? sortByRank(hand) : sortBySuit(hand);

  return (
    <div className="flex flex-row">
      <div>
        <Dialog>
          <DialogTrigger>
            <Button>Detail</Button>
          </DialogTrigger>
          <DialogContent>
            <BaseScoreDetail baseScoreList={player.baseScoreList} />
          </DialogContent>
        </Dialog>
        <Button onClick={handleImproveHand}>Improve Hand</Button>
        {player && <Score hand={hand} score={getHandBaseScore(player)} />}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row gap-4 justify-between">
          <CardContainer>
            <Buffons buffons={buffons} />
          </CardContainer>
          <CardContainer>{"item container"}</CardContainer>
        </div>
        {isShopOpened ? (
          <Shop />
        ) : (
          <div>
            <PlayHand />
            <div className="flex flex-row">
              <div className="flex flex-col">
                <CardContainer>
                  <Hand onSelectCard={handleSelectCard} hand={sortedHand} />
                </CardContainer>
                <div className="flex flex-row items-center gap-4">
                  <Button onClick={handlePlayHand}>Play Hand</Button>
                  <HandSort
                    onSortByRank={() => setSortBy("rank")}
                    onSortBySuit={() => setSortBy("suit")}
                  />
                  <Button
                    disabled={selectedCard.length > deck.length}
                    onClick={handleDiscard}
                  >
                    Discard
                  </Button>
                </div>
              </div>
              <CardContainer>
                <Deck deck={deck} />
              </CardContainer>
            </div>
          </div>
        )}
        <div>
          <Button onClick={() => setIsShopOpened((prev) => !prev)}>Shop</Button>
        </div>
      </div>
    </div>
  );
};

interface ShopProps {}

export const Shop = ({}: ShopProps) => {
  const [shop, setShop] = useState<IShop>(generateShop());

  const handleBuyCard = (buyableItem: BuyableItem<ICard>) => {
    setShop((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== buyableItem.id),
    }));
  };

  const handleReroll = () => {
    const cards = generateBuyableItems(generateCards(2));
    setShop((prev) => ({ ...prev, cards }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <Button>Next Round</Button>
          <Button onClick={handleReroll}>Reroll 5$</Button>
        </div>
        <div>
          <CardContainer>
            <div className="flex flex-row gap-2">
              {shop.cards.map((card) => (
                <PlayCard
                  onSelectCard={() => handleBuyCard(card)}
                  key={card.id}
                  card={card}
                />
              ))}
            </div>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <CardContainer>voucher</CardContainer>
        <CardContainer>
          <div className="flex flex-row gap-2">
            {shop.packs.map((pack, index) => (
              <Card key={index}>{"pack"}</Card>
            ))}
          </div>
        </CardContainer>
      </div>
    </div>
  );
};

interface ScoreProps {
  score: IScore;
  hand: IHand;
}

export const Score = ({ score, hand }: ScoreProps) => {
  return (
    <Card className="flex flex-col items-center align-middle p-2 ">
      <div>{evaluateHand(hand)}</div>
      <ScoreDetail score={score} />
    </Card>
  );
};

interface CardContainerProps {
  children: React.ReactNode;
}

export const CardContainer = ({ children }: CardContainerProps) => {
  return <Card className="p-2">{children}</Card>;
};

interface HandProps {
  hand: IHand;
  onSelectCard: (card: ICard) => void;
}

export const Hand = ({ hand, onSelectCard }: HandProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {hand.map((handCard, index) => (
        <PlayCard
          key={handCard.id}
          onSelectCard={() => onSelectCard(handCard)}
          card={handCard}
        />
      ))}
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
        <Button onClick={onSortByRank}>Rank</Button>
        <Button onClick={onSortBySuit}>Suit</Button>
      </div>
    </div>
  );
};

interface DeckProps {
  deck: IDeck;
}

export const Deck = ({ deck }: DeckProps) => {
  return <div>{getDeckSize(deck)}</div>;
};

interface BuffonsProps {
  buffons: IBuffon[];
}

export const Buffons = ({ buffons }: BuffonsProps) => {
  return (
    <div className="flex flex-row gap-2">
      {buffons.map((buffon) => (
        <Card>buffon</Card>
      ))}
    </div>
  );
};

export const PlayHand = () => {
  return <div>{"playHand"}</div>;
};

interface PlayCardProps {
  card: ICard;
  onSelectCard: () => void;
}

export const PlayCard = ({ card, onSelectCard }: PlayCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Card onClick={onSelectCard} className="flex flex-col cursor-pointer">
          <CardRow card={card} />
          {"playHand"}
          <CardRow card={card} />
        </Card>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col items-center gap-4">
          <Card className="p-4">{getCardLabel(card)}</Card>
          <Card className="p-4">+ {getBaseChip(card)} chips</Card>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

interface CardBadgeProps {
  card: ICard;
}

export const CardBadge = ({ card }: CardBadgeProps) => {
  return (
    <div className="flex flex-row">
      {card.rank}
      <CardIcon cardSuit={card.suit} />
    </div>
  );
};

interface CardIconProps {
  cardSuit: CardSuit;
}

export const CardIcon = ({ cardSuit }: CardIconProps) => {
  switch (cardSuit) {
    case "hearts":
      return <div className="text-red-500">♥</div>;
    case "diamonds":
      return <div className="text-red-500">♦</div>;
    case "clubs":
      return <div className="text-black">♣</div>;
    case "spades":
      return <div className="text-black">♠</div>;
  }
};

export const CardRow = ({ card }: CardBadgeProps) => {
  return (
    <div className="flex flex-row items-start">
      <CardBadge card={card} />
      <div />
    </div>
  );
};

interface BaseScoreDetailProps {
  baseScoreList: BaseScoreList;
}

export const BaseScoreDetail = ({ baseScoreList }: BaseScoreDetailProps) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Object.entries(baseScoreList).map(([planeteType, baseScore]) => (
        <BaseScoreRow
          key={planeteType}
          baseScore={{ ...baseScore, type: planeteType as PlanetType }}
        />
      ))}
    </div>
  );
};

interface BaseScoreRowProps {
  baseScore: BaseScore & { type: PlanetType };
}

export const BaseScoreRow = ({ baseScore }: BaseScoreRowProps) => {
  return (
    <Card className="flex flex-row items-center justify-between p-2">
      <div>lvl {baseScore.level}</div>
      <div>{baseScore.type}</div>
      <ScoreDetail score={baseScore} />
      <div># {baseScore.playedCount}</div>
    </Card>
  );
};

interface ScoreDetailProps {
  score: IScore;
}

export const ScoreDetail = ({ score }: ScoreDetailProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <Button className="bg-blue-500">{score.chip}</Button>
      <div>X</div>
      <Button className="bg-red-500">{score.multiplier}</Button>
    </div>
  );
};
