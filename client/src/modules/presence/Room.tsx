import { usePresence } from "./use-presence";

import { Cursors } from "./Cursors";

export const Room = () => {
  const [myPresence, updatePresence] = usePresence();

  return (
    <div
      onPointerMove={(event) => {
        updatePresence({
          cursor: {
            x: event.clientX,
            y: event.clientY,
          },
        });
      }}
    >
      <Cursors />
      <h1>Socket.IO Example</h1>
      <p>My Presence: {JSON.stringify(myPresence)}</p>
    </div>
  );
};
