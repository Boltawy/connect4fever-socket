import express from "express";
import { Server, Socket } from "socket.io";
const app = express();
import cors from "cors";
import { GameStatus, socketEvents, } from "./types.js";
app.use(express.json());
app.use(cors());
// Routes
app.get("/", (req, res) => res.json("Hello World!"));
const server = app.listen(process.env.PORT || 3000, () => console.log(`Connect4Fever Socket Server listening on port ${process.env.PORT || 3000}.`));
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
let rooms = [];
const createGameInstance = (player1Id, player2Id) => {
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
io.on("connection", (socket) => {
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
    socket.on(socketEvents.JOIN_ROOM_REQUEST, (roomId) => {
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
    socket.on(socketEvents.UPDATE_GAME_STATE, (gameState) => {
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
    socket.on(socketEvents.RESTART_GAME, (roomId) => {
        const gameState = rooms.find((game) => game.roomId === roomId);
        if (!gameState) {
            console.log("game not found");
            return;
        }
        const newGameState = resetGameState(gameState);
        io.emit(socketEvents.UPDATE_GAME_STATE, newGameState);
    });
    socket.on(socketEvents.PLAY_DISC_SOUND, (roomId) => {
        socket.broadcast.to(roomId).emit(socketEvents.PLAY_DISC_SOUND);
    });
    socket.on(socketEvents.RED_WINS, (roomId) => {
        console.log("red wins");
        socket.broadcast.to(roomId).emit(socketEvents.RED_WINS);
    });
    socket.on(socketEvents.YELLOW_WINS, (roomId) => {
        console.log("yellow wins");
        socket.broadcast.to(roomId).emit(socketEvents.YELLOW_WINS);
    });
});
const resetGameState = (gameState) => {
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
//# sourceMappingURL=index.js.map