import { useEffect, useRef, useState } from "react";
import {
  ConfigNode,
  Position,
  useWorkflow,
  WorkflowProvider,
} from "./providers/WorkflowProvider";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CrossIcon } from "lucide-react";
import Xarrow from "react-xarrows";

export const WorkflowPage = () => {
  return (
    <WorkflowProvider>
      <div className="flex flex-row gap-4">
        <WorkflowSidebar />
        <WorkFlowEditor />
      </div>
    </WorkflowProvider>
  );
};

export const WorkFlowEditor = () => {
  const { nodes, connections } = useWorkflow();

  return (
    <div
      id="canvas"
      className="relative w-full h-screen bg-gray-50 overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute bg-dot-grid bg-[length:25px_25px] inset-0 bg-grid-pattern pointer-events-none" />
      {nodes.map((node) => (
        <NodeComponent key={node.id} node={node} />
      ))}
      <ConnectionRenderer connections={connections} />
      {/* {connections.map((connection) => (
        <ConnectionComponent key={connection.id} connection={connection} />
      ))} */}
    </div>
  );
};

interface Props {
  node: ConfigNode;
}

const GRID_SIZE = 25;

function snapToGrid(position: Position): Position {
  return {
    x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
  };
}

export const NodeComponent: React.FC<Props> = ({ node }) => {
  const { selectNode, selectedNode } = useWorkflow();

  return (
    <MovableElement node={node}>
      <Card
        style={{
          border: selectedNode === node.id ? "3px solid blue" : "none",
        }}
        onClick={() => selectNode(node.id)}
      >
        <div
          id={`handle-${node.id}-in`}
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
        />
        <div
          id={`handle-${node.id}-out`}
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
        />
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <Button>
            <CrossIcon />
          </Button>
        </CardHeader>
        Form Node: {node.id}
      </Card>
    </MovableElement>
  );
};

interface MovableElementProps {
  children: React.ReactNode;
  node: ConfigNode;
}

export const MovableElement: React.FC<MovableElementProps> = ({
  children,
  node,
}) => {
  const { updateNodePosition } = useWorkflow();
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragging(true);

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const canvas = document.getElementById("canvas")?.getBoundingClientRect();

    if (!canvas) return;

    const newPos = {
      x: e.clientX - canvas.left - offset.x,
      y: e.clientY - canvas.top - offset.y,
    };

    updateNodePosition(node.id, snapToGrid(newPos));
  };
  return (
    <div
      className={`absolute  ${dragging ? "opacity-75" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

export const WorkflowSidebar = () => {
  const { addNode } = useWorkflow();

  return (
    <div className="p-4 bg-gray-100 w-60 space-y-2">
      <Button onClick={addNode}>Add Node</Button>
      <Button variant="outline">Sauvegarder</Button>
      <Button variant="secondary">Visualizer</Button>
    </div>
  );
};

export const ConnectionRenderer = ({ connections }: { connections: any[] }) => {
  return (
    <>
      {connections.map((conn) => (
        <Xarrow
          key={conn.id}
          start={`handle-${conn.fromId}-out`}
          end={`handle-${conn.toId}-in`}
          path="smooth"
          strokeWidth={2}
          color="#3B82F6"
          curveness={0.5}
          headSize={6}
        />
      ))}
    </>
  );
};
