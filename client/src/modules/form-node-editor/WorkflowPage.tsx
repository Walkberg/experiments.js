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
      <GridRenderer size={GRID_SIZE} />
      <NodeRender nodes={nodes} />
      <ConnectionRenderer connections={connections} />
      <ConnectionPreview />
    </div>
  );
};

export const ConnectionPreview = () => {
  const {} = useWorkflow();

  return <></>;
};

export const NodeRender = ({ nodes }: { nodes: ConfigNode[] }) => {
  return (
    <>
      {nodes.map((node) => (
        <NodeComponent key={node.id} node={node} />
      ))}
    </>
  );
};

export const GridRenderer = ({ size }: { size: number }) => {
  return (
    <div
      className={`absolute bg-dot-grid bg-[length:${size}px_${size}px] inset-0 bg-grid-pattern pointer-events-none`}
    />
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
        className="cursor-pointer hover:bg-gray-100"
        onClick={() => selectNode(node.id)}
      >
        <Anchor position="left" color="blue" node={node} />
        <Anchor position="right" color="green" node={node} />
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </div>
            <Button>
              <CrossIcon />
            </Button>
          </div>
        </CardHeader>
        Form Node: {node.id}
      </Card>
    </MovableElement>
  );
};

export const Anchor = ({
  node,
  position,
  color,
}: {
  node: ConfigNode;
  position: "left" | "right";
  color: "blue" | "green";
}) => {
  return (
    <div
      id={`handle-${node.id}-${position === "left" ? "in" : "out"}`}
      className={`absolute -${
        position === "left" ? "left" : "right"
      }-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
        color === "blue" ? " bg-blue-500" : "bg-green-500"
      } rounded-full`}
    />
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
