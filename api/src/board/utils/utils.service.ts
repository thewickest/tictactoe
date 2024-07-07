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

export const calculateNextMove = (board) => {
  const currentBoard = [...board];
  //TODO: Move to other side
  // THE WIN WIN algorithm
  // first checks firsts move. If the player2 hasn't played yet, plays on a random corner
  const moves = currentBoard.reduce((res, line) => {
    const prev = line.reduce((res, el) => {
      return el === 'O' ? res + 1 : res;
    }, 0);
    return res + prev;
  }, 0);
  if (moves == 0) {
    let played = false;
    while (!played) {
      const firstIndex = Math.random() < 0.5 ? 0 : 2;
      const secondIndex = Math.random() < 0.5 ? 0 : 2;
      if (currentBoard[firstIndex][secondIndex] === '') {
        currentBoard[firstIndex][secondIndex] = 'O';
        played = true;
      }
    }
  }
  // for the second move, checks the previous move and plays next to it if's posible.
  else if (moves == 1) {
    const previousMove = currentBoard
      .map((line, lineIndex) => {
        if (line.concat().includes('O')) {
          return line
            .map((box, columnIndex) => {
              if (box === 'O') return { lineIndex, columnIndex };
            })
            .filter((el) => el);
        }
      })
      .filter((el) => el)[0][0];
    const { lineIndex, columnIndex } = previousMove;
    let played = false;
    //try columns
    let nextColumn = columnIndex + 1;
    if (nextColumn == 3) {
      nextColumn = columnIndex - 1;
    }
    let nextBox = currentBoard[lineIndex][nextColumn];
    if (nextBox === '') {
      currentBoard[lineIndex][nextColumn] = 'O';
      played = true;
    }
    //try rows
    if (!played) {
      let nextLine = lineIndex + 1;
      if (nextLine == 3) {
        nextLine = lineIndex - 1;
      }
      nextBox = currentBoard[nextLine][columnIndex];
      if (nextBox === '') {
        currentBoard[nextLine][columnIndex] = 'O';
      }
    }
  }
  // for the third move, tries to play in any other corner.
  else if (moves === 2) {
    //plays in any other corner if possible
    let played = false;
    while (!played) {
      const firstIndex = Math.random() < 0.5 ? 0 : 2;
      const secondIndex = Math.random() < 0.5 ? 0 : 2;
      if (currentBoard[firstIndex][secondIndex] === '') {
        currentBoard[firstIndex][secondIndex] = 'O';
        played = true;
      }
    }
  }
  // for the other moves, tries to win and block the other player
  else if (moves >= 3) {
    let played = false;
    while (!played) {
      const firstIndex = Math.floor(Math.random() * 3);
      const secondIndex = Math.floor(Math.random() * 3);
      if (currentBoard[firstIndex][secondIndex] == '') {
        currentBoard[firstIndex][secondIndex] = 'O';
        played = true;
      }
    }
  }
  return currentBoard;
};
