
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const SPECTATE = "spectate";
export const SPECTATE_UPDATE = "spectate_update";
export const GAME_ENDED = "game_ended";

export const ACTIVE = "active";
export const INACTIVE = "inactive";
export const ENDED = "ended";

export type gameStateType = {
  gameId: string;
  game: string;
  player1Id: string;
  player2Id: string;
  player1Name: string;
  player2Name: string;
  isPlayer1Connected: boolean;
  isPlayer2Connected: boolean;
  status: string;
  movesCount: number;
};
