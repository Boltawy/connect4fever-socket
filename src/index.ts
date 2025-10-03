import express from "express";
import { Server, Socket } from "socket.io";

const app = express();
import cors from "cors";
import { GameStatus, socketEvents, type IGameState, type IMultiplayerGameState } from "./types.js";

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => res.json("Hello World!"));

const server = app.listen(process.env.PORT || 3000, () =>
  console.log(
    `Connect4Fever Socket Server listening on port ${process.env.PORT || 3000}.`
  )
);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4200",
      "https://connect4fever.netlify.app",
      "https://connect4fever.vercel.app",
    ],
    methods: ["GET", "POST"],
    // credentials: true
  },
});

let rooms: IMultiplayerGameState[] = [];
const createGameInstance = (
  player1Id: string,
  player2Id?: string
): IMultiplayerGameState => {
  const newGame = {
    boardArray: Array(42).fill("empty"),
    diskPointerArray: [35, 36, 37, 38, 39, 40, 41],
    playerTurn: "red",
    player1Id: player1Id,
    player2Id: player2Id || "",
    gameStatus: GameStatus.NOT_STARTED,
    winner: null,
    roomId: Math.floor(Math.random() * 10000).toString(),
    redTurn: true,
    timer: 20,
  };
  rooms.push(newGame);
  return newGame;
};

io.on("connection", (socket: Socket) => {
  console.log(`user with id ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`user with id ${socket.id} disconnected`);
    rooms = rooms.filter((game) => game.player1Id !== socket.id);
    io.emit("getRoomsResponse", rooms);
  });

  socket.on(socketEvents.CREATE_ROOM_REQUEST, () => {
    console.log("create room request");
    const gameInstance = createGameInstance(socket.id);
    socket.emit(socketEvents.CREATE_ROOM_RESPONSE, gameInstance);
    io.emit(socketEvents.GET_ROOMS_RESPONSE, rooms);
    socket.join(gameInstance.roomId);
  });

  socket.on(socketEvents.GET_ROOMS_REQUEST, () => {
    socket.emit(socketEvents.GET_ROOMS_RESPONSE, rooms);
  });

  socket.on(socketEvents.JOIN_ROOM_REQUEST, (roomId: string) => {
    console.log("join room request recieved on room ", roomId);
    const gameInstance = rooms.find((game) => game.roomId === roomId);
    if (!gameInstance) {
      socket.emit(socketEvents.JOIN_ROOM_RESPONSE, "Room not found");
      return;
    }
    socket.join(gameInstance.roomId);
    gameInstance.player2Id = socket.id;
    io.to(roomId).emit(socketEvents.JOIN_ROOM_RESPONSE, gameInstance);
  });

  socket.on(socketEvents.UPDATE_GAME_STATE, (gameState: IMultiplayerGameState) => {
    console.log("update game state request recieved on room ", gameState.roomId);
    const room = rooms.find((game) => game.roomId === gameState.roomId);
    if (!room) {
      console.log("room not found");
      return;
    }
    Object.assign(room, gameState);

    console.log("game state updated", room);
    io.emit(socketEvents.UPDATE_GAME_STATE, room);
  });
  socket.on(socketEvents.RESTART_GAME, (roomId: string) => {
    const gameState = rooms.find((game) => game.roomId === roomId);
    if (!gameState) {
      console.log("game not found");
      return;
    }
    const newGameState = resetGameState(gameState!);
    io.emit(socketEvents.UPDATE_GAME_STATE, newGameState);
  });
});

const resetGameState = (gameState: IMultiplayerGameState): IMultiplayerGameState => {
  return {
    boardArray: Array(42).fill("empty"),
    diskPointerArray: [35, 36, 37, 38, 39, 40, 41],
    redTurn: true,
    player1Id: gameState.player1Id,
    player2Id: gameState.player2Id,
    gameStatus: GameStatus.IN_PROGRESS,
    roomId: gameState.roomId,
    timer: 20,
  };
};
