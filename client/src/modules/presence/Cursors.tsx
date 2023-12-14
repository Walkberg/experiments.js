import { CursorCompoent } from "./Cursor";
import { useOthers as useOthers } from "./use-other";

export const Cursors = () => {
  const { others } = useOthers();

  console.log(others)

  return (
    <div>
      coucou
      {others.map(({ connectionId, presence }) => (
        <CursorCompoent key={connectionId} cursor={presence.cursor} />
      ))}
    </div>
  );
};
