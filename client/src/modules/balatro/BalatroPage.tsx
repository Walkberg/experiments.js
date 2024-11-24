import "./balatro.css";
import { Card } from "@/components/ui/card";
import {
  Deck as IDeck,
  Hand as IHand,
  PokerCard as ICard,
  Buffon as IBuffon,
  Score as IScore,
  getDeckSize,
  generateDeck,
  drawCards,
  sortByRank,
  sortBySuit,
  getHandBaseScore,
  Player,
  BaseScoreList,
  BaseScore,
  PlanetType,
  fakePlayer,
  improveBaseScoreList,
} from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Shop } from "./Shop";
import { PlayCard } from "./Card";
import { BalatroProvider } from "./BalatroProvider";
import { BuffonPool as BuffonPool, IBalatro } from "./buffons";
import { evaluatePokerHand, getScoringHand } from "./hand-evaluator";
import { Balatro as BalatroGame } from "./buffons";
import { getCallbackManager } from "./mod";

export const BalatroPage = () => {
  return (
    <BalatroProvider seed={"1223344"}>
      <Balatro />
    </BalatroProvider>
  );
};

export const Balatro = () => {
  const [deck, setDeck] = useState<IDeck>(generateDeck());
  const [hand, setHand] = useState<IHand>([]);

  const [balatro, setBalatro] = useState<IBalatro>(BalatroGame);

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

  const handlePlayHand = () => {
    balatro.pickBuffon();
  };

  const handleSelectCard = (card: ICard) => {
    setSelectCard((prev) =>
      prev.find((c) => c.id === card.id)
        ? prev.filter((a) => a.id === card.id)
        : [...prev, card]
    );
  };

  function drawCard(cardCount: number) {
    const [drawedCards, newDeck] = drawCards(deck, cardCount);

    const test = hand.filter(
      (card) => !selectedCard.find((c) => c.id === card.id)
    );

    setHand((prev) => [...test, ...drawedCards]);
    setDeck(newDeck);
    setSelectCard([]);
  }

  const handleImproveHand = () => {
    setPlayer((prev) => ({
      ...prev,
      baseScoreList: improveBaseScoreList(prev.baseScoreList, "pluto"),
    }));
  };

  const sortedHand = sortBy === "rank" ? sortByRank(hand) : sortBySuit(hand);

  return (
    <div className="flex flex-row bg-green-800  h-screen w-screen background-tv">
      <div className="flex flex-col justify-between">
        <Blind />
        <Score />
        {player && (
          <BaseScoreC hand={selectedCard} score={getHandBaseScore(player)} />
        )}
        <PlayerInfo />
        <div>
          <Button onClick={() => setIsShopOpened((prev) => !prev)}>Shop</Button>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button>Detail</Button>
          </DialogTrigger>
          <DialogContent>
            <BaseScoreDetail baseScoreList={player.baseScoreList} />
          </DialogContent>
          <Button onClick={handleImproveHand}>Improve Hand</Button>
        </Dialog>
        <div>
          hand that score :
          <div className=" flex flex-col ">
            {getScoringHand(selectedCard).map((hand) => (
              <div className=" flex flex-row gap-2">
                {hand.map((card) => (
                  <div>{card.id}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col grow m-2 justify-between">
        <div className="flex flex-row gap-4 justify-between">
          <CardContainer>
            <Buffons buffons={buffons} />
          </CardContainer>
          <CardContainer>
            <ItemList />
          </CardContainer>
        </div>
        {isShopOpened ? (
          <Shop />
        ) : (
          <div>
            <PlayHand />
            <div className="flex flex-row gap-4">
              <div className="flex flex-col grow">
                <CardContainer>
                  <Hand
                    selected
                    onSelectCard={handleSelectCard}
                    hand={sortedHand}
                  />
                </CardContainer>
                <PlayerActions
                  handlePlayHand={handlePlayHand}
                  setSortBy={setSortBy}
                  handleDiscard={handleDiscard}
                />
              </div>
              <CardContainer>
                <Deck deck={deck} />
              </CardContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PlayerInfo = () => {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col grow gap-4 justify-between">
        <Button>Run Info</Button>
        <Button>Options</Button>
      </div>
      <div className="grid grid-rows-2 grid-cols-2 gap-4">
        <div>
          <ItemContainer name="hands">
            <Button>4</Button>
          </ItemContainer>
        </div>
        <ItemContainer name="discards">
          <Button>4</Button>
        </ItemContainer>
        <div className="col-span-2">
          <ItemCard>
            <ItemTest>
              <Button>$32</Button>
            </ItemTest>
          </ItemCard>
        </div>
        <ItemContainer name="antes">
          <Button>0</Button>
        </ItemContainer>
        <ItemContainer name="rounds">
          <Button>1</Button>
        </ItemContainer>
      </div>
    </div>
  );
};

interface ItemContainerProps {
  name: string;
  children: React.ReactNode;
}

export const ItemContainer = ({ children, name }: ItemContainerProps) => {
  return (
    <ItemCard>
      <div className="flex items-center justify-center">{name}</div>
      <ItemTest>{children}</ItemTest>
    </ItemCard>
  );
};

interface ItemTestProps {
  children: React.ReactNode;
}

export const ItemTest = ({ children }: ItemTestProps) => {
  return <div className="flex flex-col">{children}</div>;
};

interface ItemCardProps {
  children: React.ReactNode;
}

export const ItemCard = ({ children }: ItemCardProps) => {
  return <Card className="flex flex-col p-2">{children}</Card>;
};

interface Score {
  score: IScore;
  hand: IHand;
}

export const BaseScoreC = ({ score, hand }: Score) => {
  return (
    <Card className="flex flex-col items-center align-middle p-2 ">
      <div>{evaluatePokerHand(hand)}</div>
      <ScoreDetail score={score} />
    </Card>
  );
};

interface ScoreProps {}

export const Score = ({}: ScoreProps) => {
  return (
    <Card className="flex flex-row items-center align-middle p-2 ">
      <div>Round Score</div>
      <ItemCard>0</ItemCard>
    </Card>
  );
};

interface BlindProps {}

export const Blind = ({}: BlindProps) => {
  return (
    <Card className="flex flex-col items-center ">
      <Card>Small Blind</Card>
      <Card className="flex flex-row items-center justify-center gap-8">
        <div>Blind Icon</div>
        <Card className="flex flex-col">
          <div>Score at least</div>
          <div className="flex flex-row">
            <div>seal Icon</div>
            <div>10000</div>
          </div>
          <div className="flex flex-row">
            <div>Reward</div>
            <div>$$$</div>
          </div>
        </Card>
      </Card>
    </Card>
  );
};

interface CardContainerProps {
  children: React.ReactNode;
}

export const CardContainer = ({ children }: CardContainerProps) => {
  return (
    <div className="flex flex-col grow">
      <Card className="flex grow justify-center p-2 bg-black/20 h-40">
        {children}
      </Card>
      <div className="flex flex-row grow p-2">0/2</div>
    </div>
  );
};

interface ItemListProps {}

export const ItemList = ({}: ItemListProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div>0 / 0 </div>
    </div>
  );
};

interface HandProps {
  hand: IHand;
  onSelectCard: (card: ICard) => void;
  selected: boolean;
}

export const Hand = ({ hand, onSelectCard, selected }: HandProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {hand.map((handCard) => (
        <div className="relative">
          <PlayCard
            key={handCard.id}
            onSelectCard={() => onSelectCard(handCard)}
            card={handCard}
          />
        </div>
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
      {BuffonPool()
        .getBuffon()
        .map((buffon) => (
          <Card>buffon</Card>
        ))}
    </div>
  );
};

export const PlayHand = () => {
  return <div>{"playHand"}</div>;
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

type SortBy = "rank" | "suit";

interface PlayerActionsProps {
  handlePlayHand: () => void;
  setSortBy: (sortBy: SortBy) => void;
  handleDiscard: () => void;
}

function PlayerActions({
  handlePlayHand,
  setSortBy,
  handleDiscard,
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
      <Button className="bg-red-600" disabled={false} onClick={handleDiscard}>
        Discard
      </Button>
    </div>
  );
}
