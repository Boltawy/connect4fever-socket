export enum BoardCell { //duplicate enum
  EMPTY = 'empty',
  RED = 'red',
  YELLOW = 'yellow',
}

export enum GameStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  RED_WON = 'red_won',
  YELLOW_WON = 'yellow_won',
  TIE = 'tie',
}

export interface IGameState {
  boardArray: BoardCell[];
  diskPointerArray: number[];
  gameStatus: GameStatus;
  redTurn: boolean;
  timer: number;
}

export interface IMultiplayerGameState extends IGameState {
  roomId: string;
  player1Id: string;
  player2Id: string | null;
  gameStatus: GameStatus;
}

export enum socketEvents { // should define both name & payload, Probably a "wrapper" function
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  GET_ROOMS_REQUEST = 'getRoomsRequest',
  GET_ROOMS_RESPONSE = 'getRoomsResponse',
  CREATE_ROOM_REQUEST = 'createRoomRequest',
  CREATE_ROOM_RESPONSE = 'createRoomResponse',
  JOIN_ROOM_REQUEST = 'joinRoomRequest',
  JOIN_ROOM_RESPONSE = 'joinRoomResponse',
  UPDATE_GAME_STATE = 'updateGameState',
  RESTART_GAME = 'restartGame',
  PLAY_DISC_SOUND = 'playDiscSound',
  RED_WINS = 'redWins',
  YELLOW_WINS = 'yellowWins'
}