export type NodeId = string;

export type ConnectionId = string;

export type NodeBase = {
  id: NodeId;
};

export type ConnectionBase = {
  id: ConnectionId;
  source: NodeId;
  target: NodeId;
};

export class DomainEvent {
  constructor(public readonly id: string) {}
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

export interface Notifier {
  addSubscriber: (
    priority: number,
    callbackFunction: () => Promise<boolean> | boolean
  ) => void;

  removeSubscriber: (callbackFunction: () => Promise<void>) => void;

  notify: ({}: { type: string; data: any }) => Promise<boolean> | boolean;
}

export class NotifierImpl implements Notifier {
  addSubscriber(
    priority: number,
    callbackFunction: (ctx: NodeBase) => Promise<boolean> | boolean
  ) {}

  removeSubscriber(callbackFunction: () => Promise<void> | void) {}

  async notify({ type, data }: { type: string; data: any }): Promise<boolean> {
    console.log("notify", type, data);
    return true;
  }
}

export class NodeEditor extends NotifierImpl {
  private nodes: NodeBase[] = [];
  private connections: ConnectionBase[] = [];

  public getNode(id: string): NodeBase | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  public getNodes(): NodeBase[] {
    return this.nodes;
  }

  public async addNode(node: NodeBase): Promise<void> {
    if (this.getNode(node.id)) {
      throw new Error("Node already exists");
    }
    this.nodes.push(node);
  }

  public getConnections(): ConnectionBase[] {
    return this.connections;
  }

  public async getConnection(id: string): Promise<ConnectionBase | undefined> {
    return this.connections.find((connection) => connection.id === id);
  }

  public async removeNode(id: string): Promise<void> {
    const index = this.nodes.findIndex((n) => n.id === id);
    const node = this.nodes[index];

    if (!(await this.notify({ type: "node-remove", data: node }))) return;

    this.nodes = this.nodes.filter((node) => node.id !== id);

    if (!(await this.notify({ type: "node-removed", data: node }))) return;
  }

  public async addConnection(connection: ConnectionBase): Promise<void> {
    if (this.getNode(connection.id)) {
      throw new Error("Connection already exists");
    }
    this.connections.push(connection);
  }

  public async removeConnection(id: string): Promise<void> {
    this.connections = this.connections.filter(
      (connection) => connection.id !== id
    );
  }

  public async clear() {
    for (const connection of this.connections.slice()) {
      await this.removeConnection(connection.id);
    }

    for (const node of this.nodes.slice()) {
      await this.removeNode(node.id);
    }
  }
}
