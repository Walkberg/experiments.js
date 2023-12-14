import { Socket } from "socket.io";
import express from "express";
import { Server } from "socket.io";
import http from "http";
require("dotenv").config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const port = process.env.PORT;

app.get("/", (req, res) => {
  console.log("test");
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected " + socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("user-joined", {
      connectionId: socket.id,
      roomId: roomId,
    });
  });

  socket.on("update-presence", (presenceUpdate: PresenceUpdate) => {
    io.to(presenceUpdate.roomId).emit("presence-updated", {
      connectionId: socket.id,
      presence: presenceUpdate.presence,
    });
    console.log(`User ${socket.id} joined the presence ${presenceUpdate}`);
  });

  socket.on("leave-room", (roomId) => {
    io.to(roomId).emit("user-left", { connectionId: socket.id });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", { connectionId: socket.id });
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

interface PresenceUpdate {
  roomId: string;
  presence: Presence;
}

interface Presence {
  cursor: Cursor | null;
}

interface Cursor {
  x: number;
  y: number;
}
