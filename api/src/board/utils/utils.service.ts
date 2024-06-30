import { Board, status } from '../schema/board.schema';

export const checkStatus = (game: Board, symbol: string): status => {
  //Check if someone has win the game
  const { board: currentBoard } = game;
  let stat: status = 'ongoing';

  //check rows
  let tictactoe: boolean;
  currentBoard.map((line, index) => {
    tictactoe =
      tictactoe ||
      //check rows
      (line[0] === symbol && line[1] === symbol && line[2] === symbol) ||
      //check columns
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

  //check if there is moves left
  const boxesLeft = currentBoard.reduce((res, line) => {
    const prev = line.reduce((res, el) => {
      return el === '' ? res + 1 : res;
    }, 0);
    return res + prev;
  }, 0);

  if (tictactoe) {
    symbol === 'X' ? (stat = 'player1_wins') : (stat = 'player2_wins');
  }
  if (boxesLeft === 0 && !tictactoe) {
    stat = 'draw';
  }

  return stat;
};
