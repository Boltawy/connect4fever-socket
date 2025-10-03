export var BoardCell;
(function (BoardCell) {
    BoardCell["EMPTY"] = "empty";
    BoardCell["RED"] = "red";
    BoardCell["YELLOW"] = "yellow";
})(BoardCell || (BoardCell = {}));
export var GameStatus;
(function (GameStatus) {
    GameStatus["NOT_STARTED"] = "not_started";
    GameStatus["IN_PROGRESS"] = "in_progress";
    GameStatus["RED_WON"] = "red_won";
    GameStatus["YELLOW_WON"] = "yellow_won";
    GameStatus["TIE"] = "tie";
})(GameStatus || (GameStatus = {}));
export var socketEvents;
(function (socketEvents) {
    socketEvents["CONNECT"] = "connect";
    socketEvents["DISCONNECT"] = "disconnect";
    socketEvents["GET_ROOMS_REQUEST"] = "getRoomsRequest";
    socketEvents["GET_ROOMS_RESPONSE"] = "getRoomsResponse";
    socketEvents["CREATE_ROOM_REQUEST"] = "createRoomRequest";
    socketEvents["CREATE_ROOM_RESPONSE"] = "createRoomResponse";
    socketEvents["JOIN_ROOM_REQUEST"] = "joinRoomRequest";
    socketEvents["JOIN_ROOM_RESPONSE"] = "joinRoomResponse";
    socketEvents["UPDATE_GAME_STATE"] = "updateGameState";
    socketEvents["RESTART_GAME"] = "restartGame";
})(socketEvents || (socketEvents = {}));
//# sourceMappingURL=types.js.map