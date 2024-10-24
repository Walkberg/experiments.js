import { NodeEditor } from "./graph-editor";
import { Connection, Input, Node, Socket } from "./machine";

export class SolidSocket extends Socket {
  constructor() {
    super("solid");
  }

  isCompatible(other: Socket): boolean {
    return other instanceof SolidSocket;
  }
}

export class FluidSocket extends Socket {
  constructor() {
    super("fluid");
  }

  isCompatible(other: Socket): boolean {
    return other instanceof FluidSocket;
  }
}

export class Foundry extends Node {
  constructor() {
    super("Fondrier");
    this.addInput("input", new Input(new SolidSocket(), "fondrier"));
    this.addOutput("outpout", new Input(new SolidSocket(), "fondrier"));
  }
}

export class Miner extends Node {
  constructor() {
    super("Miner");

    this.addOutput("output", new Input(new SolidSocket(), "fondrier"));
  }
}

export class Constructor extends Node {
  constructor() {
    super("Constructor");

    this.addInput("input", new Input(new SolidSocket(), "fondrier"));
    this.addOutput("output", new Input(new SolidSocket(), "fondrier"));
  }
}

const graph = new NodeEditor();

// Créer quelques nœuds
const node1 = new Constructor();
const node2 = new Foundry();

// Ajouter les nœuds à l'éditeur
await graph.addNode(node1);
await graph.addNode(node2);

// Créer une connexion entre les nœuds
const connection = new Connection(node1, node2);

// Ajouter la connexion à l'éditeur
await graph.addConnection(connection);

// Afficher les nœuds et connexions
console.log("Nodes:", graph.getNodes());
console.log("Connections:", graph.getConnections());

// Supprimer un nœud
await graph.removeNode(node1.id);

// Afficher les nœuds et connexions après suppression
console.log("Nodes after removal:", graph.getNodes());
console.log("Connections after removal:", graph.getConnections());

// Tout effacer
await graph.clear();

// Afficher les nœuds et connexions après effacement
console.log("Nodes after clearing:", graph.getNodes());
console.log("Connections after clearing:", graph.getConnections());

graph.addSubscriber(1, (context) => {
  console.log(context.id);
  return true;
});
