import { Board, status } from '../schema/board.schema';

export const checkStatus = (game: Board, symbol: string): status => {
  //Check if someone has win the game
  const {
    board: currentBoard,
    players: { player1 },
  } = game;
  let stat: status = 'ongoing';

  //check rows
  let tictactoe: boolean;
  currentBoard.map((line) => {
    tictactoe =
      tictactoe ||
      (line[0] === symbol && line[1] === symbol && line[2] === symbol);
  });
  //check columns
  currentBoard.map((line, index) => {
    tictactoe =
      tictactoe ||
      (currentBoard[0][index] === symbol &&
        currentBoard[1][index] === symbol &&
        currentBoard[2][index] === symbol);
  });

  //check diagonals
  tictactoe =
    tictactoe ||
    (currentBoard[0][0] === symbol &&
      currentBoard[1][1] === symbol &&
      currentBoard[2][2] === symbol) ||
    (currentBoard[0][2] === symbol &&
      currentBoard[1][1] === symbol &&
      currentBoard[2][0] === symbol);

  if (tictactoe) {
    symbol === player1.symbol
      ? (stat = 'player1_wins')
      : (stat = 'player1_wins');
  }

  return stat;
};
