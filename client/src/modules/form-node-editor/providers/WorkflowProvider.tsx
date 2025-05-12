import React, { createContext, useContext, useState } from "react";

export type NodeId = string;

export type ConnectionId = string;

export type WorkflowId = string;

export interface Position {
  x: number;
  y: number;
}

export interface ConfigNode {
  id: NodeId;
  workFlowId: WorkflowId;
  type: string;
  position: Position;
}

export interface Connection {
  id: ConnectionId;
  workFlowId: WorkflowId;
  type: string;
  fromId: NodeId;
  toId: NodeId;
}

interface WorkflowContextType {
  nodes: ConfigNode[];
  connections: Connection[];
  addNode: () => void;
  updateNodePosition: (nodeId: NodeId, position: Position) => void;
  selectedNode: NodeId | null;
  selectNode: (nodeId: NodeId) => void;
  deselectNode: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context)
    throw new Error("useWorkflow must be used inside WorkflowProvider");
  return context;
};

function createNode(id: NodeId): ConfigNode {
  return createNodePosition(id, { x: 100, y: 100 });
}

function createNodePosition(id: NodeId, position: Position): ConfigNode {
  return {
    id,
    workFlowId: "1",
    type: "form",
    position: position,
  };
}

function createConnection(
  id: ConnectionId,
  fromId: NodeId,
  toId: NodeId
): Connection {
  return {
    id,
    workFlowId: "1",
    type: "form",
    fromId,
    toId,
  };
}

const defaultGraph = {
  nodes: [
    createNodePosition("1", { x: 100, y: 100 }),
    createNodePosition("2", { x: 400, y: 100 }),
  ],
  connections: [createConnection("1", "1", "2")],
};

export const WorkflowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nodes, setNodes] = useState<ConfigNode[]>(defaultGraph.nodes);
  const [connections, setConnections] = useState<Connection[]>(
    defaultGraph.connections
  );
  const [selectedNode, setSelectedNode] = useState<NodeId | null>(null);

  const addNode = () => {
    setNodes((prev) => [...prev, createNode(`${Date.now()}`)]);
  };

  const updateNodePosition = (nodeId: NodeId, position: Position) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, position } : node))
    );
  };

  const selectNode = (nodeId: NodeId) => {
    setSelectedNode(nodeId);
  };

  const deselectNode = () => {
    setSelectedNode(null);
  };

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        connections,
        addNode,
        updateNodePosition,
        selectNode,
        deselectNode,
        selectedNode,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
