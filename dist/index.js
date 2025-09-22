import express from "express";
import { Server } from "socket.io";
const app = express();
import cors from "cors";
app.use(express.json());
app.use(cors());
// Routes
app.get("/", (req, res) => res.json("Hello World!"));
const server = app.listen(process.env.PORT || 3000, () => console.log(`Connect4Fever API listening on port ${process.env.PORT || 3000}.`));
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
let gameState = {
    board: Array(42).fill("empty"),
    diskPointerArray: [35, 36, 37, 38, 39, 40, 41],
    gameStatus: "playing",
    winner: null,
};
io.on("connection", (socket) => {
    console.log("a user connected");
    // socket.on("createRoom", () => {
    //     // const gameInstance = createGameInstance()
    //     // socket.emit("roomCreated", gameInstance)
    //     socket.join(gameInstance.roomId)
    // })
    socket.on("updateBoardRequest", (boardArray) => {
        io.emit("updateBoard", boardArray);
        console.log("board updated  ");
    });
    socket.on("updatePointerArrayRequest", (pointerArray) => {
        io.emit("updatePointerArray", pointerArray);
        console.log("pointer array updated  ");
    });
    socket.on("updateGameStateRequest", (gameState) => {
        console.log("game state updated", gameState);
        io.emit("updateGameState", gameState);
    });
    socket.on("restartGameRequest", () => {
        resetGameState(gameState);
        io.emit("restartGame", gameState);
    });
});
const resetGameState = (gameState) => {
    gameState = {
        board: Array(42).fill("empty"),
        diskPointerArray: [35, 36, 37, 38, 39, 40, 41],
        gameStatus: "playing",
        winner: null,
    };
};
//# sourceMappingURL=index.js.map