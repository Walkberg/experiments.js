import { Cursor } from "./room-provider";

interface CursorProps {
  cursor: Cursor | null;
}

export const CursorCompoent = ({ cursor }: CursorProps) => {
  if (cursor == null) {
    return <div>null</div>;
  }

  return (
    <div>
      {cursor.x}
      {cursor.y}
    </div>
  );
};
