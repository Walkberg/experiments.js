interface IBoard {
  id: string;
}

interface ICard {
  id: string;
  health: number;
  attack: number;
  name: string;
}

interface ISide {
  id: string;
}

export class DomainEvent {
  constructor(public readonly id: string) {}
}

export class CardAttacked extends DomainEvent {
  constructor(
    public readonly attackCardId: string,
    public readonly attackedCardId: string
  ) {
    super("card-attacked");
  }
}

export class BoardResolved extends DomainEvent {
  constructor() {
    super("board-resolved");
  }
}

export abstract class AgregateRoot {
  events: DomainEvent[] = [];

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  clearEvents() {
    this.events = [];
  }

  getEvents(): DomainEvent[] {
    return this.events;
  }
}

export class Board extends AgregateRoot implements IBoard {
  playerSide: Side = new Side();
  opponentSide: Side = new Side();

  constructor(public id: string) {
    super();
  }

  pickRandomSide(): Side {
    return this.playerSide;
  }

  pickOtherSide(): Side {
    return this.playerSide;
  }

  resolveBoard() {
    while (
      this.playerSide.cards.length > 0 &&
      this.opponentSide.cards.length > 0
    ) {
      const playerCard = this.playerSide.pickRandomCard();
      const opponentCard = this.opponentSide.pickAttackableCard();

      playerCard.attackCard(opponentCard);
      this.addEvent(new CardAttacked(playerCard.id, opponentCard.id));

      this.removeDeadCards();
    }

    this.addEvent(new BoardResolved());
  }

  removeDeadCards() {
    this.playerSide.cards = this.playerSide.cards.filter(
      (card) => card.health > 0
    );
    this.opponentSide.cards = this.opponentSide.cards.filter(
      (card) => card.health > 0
    );
  }
}

export class Side implements ISide {
  id: string = "1";

  cards: Card[] = new Array<Card>();

  pickNextCard(): Card {
    if (this.cards.length === 0) {
      throw new Error("No cards left");
    }
    return this.cards[0];
  }

  pickAttackableCard(): Card {
    return this.pickRandomCard();
  }

  pickRandomCard(): Card {
    if (this.cards.length === 0) {
      throw new Error("No cards left");
    }
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    return this.cards[randomIndex];
  }
}

export class Card implements ICard {
  id: string;
  health: number;
  attack: number;
  name: string;

  constructor(id: string, health: number, attack: number, name: string) {
    this.id = id;
    this.health = health;
    this.attack = attack;
    this.name = name;
  }

  static create(): Card {
    return new Card("1", 2, 3, "test");
  }

  removeHealth(count: number) {
    this.health -= count;
  }

  attackCard(card: Card) {
    console.log("Attacking");
    this.removeHealth(card.attack);
    card.removeHealth(this.attack);
  }
}

export function createCards(count: number): Card[] {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const id = `card-${Math.round(Math.random() * 5000000)}`;
    const card = new Card(
      id,
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 5) + 1,
      id
    );
    cards.push(card);
  }
  return cards;
}

// Initialisation du board avec des cartes sur chaque côté
function initializeBoard(): Board {
  const board = new Board("board-1");

  const playerCards = createCards(7);
  const opponentCards = createCards(7);

  board.playerSide.cards = playerCards;
  board.opponentSide.cards = opponentCards;

  return board;
}

const board = initializeBoard();

export { board };
