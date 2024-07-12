import { Board, status } from '../schema/board.schema';

const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';

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
    symbol === HUMAN_PLAYER ? (stat = 'player1_wins') : (stat = 'player2_wins');
  }
  if (boxesLeft === 0 && !tictactoe) {
    stat = 'draw';
  }

  return stat;
};

const minmax = async (game: Board, player: string): Promise<number> => {
  // const { board: currentBoard } = game;
  const status = checkStatus(game, player);
  const posibleMoves: Board[] = getPosiblesMoves(game, player);

  //base
  if (status === 'player1_wins') {
    return -1;
  } else if (status === 'player2_wins') {
    return 1;
  } else if (status === 'draw') {
    return 0;
  }

  if (player === AI_PLAYER) {
    let value = -1000;
    for (const move of posibleMoves) {
      value = Math.max(value, await minmax(move, HUMAN_PLAYER));
    }
    return value;
  } else {
    let value = 1000;
    for (const move of posibleMoves) {
      value = Math.min(value, await minmax(move, AI_PLAYER));
    }
    return value;
  }
};

const getPosiblesMoves = (game: Board, player: string): Board[] => {
  const posibleMoves: Board[] = [];
  // console.log('game', game);
  const { board: currentBoard } = game;
  currentBoard.map((row, index) => {
    row.map((box, column) => {
      if (box === '') {
        const nextGame = JSON.parse(JSON.stringify(game));
        nextGame.board[index][column] = player;
        posibleMoves.push(nextGame);
      }
    });
  });
  return posibleMoves;
};
export const calculateNextAIMove = async (game: Board) => {
  const posibleMoves: Board[] = getPosiblesMoves(game, AI_PLAYER);

  if (posibleMoves.length === 0) return game;

  const scoredBoards = [];
  for (const move of posibleMoves) {
    const score = await minmax(move, HUMAN_PLAYER);
    scoredBoards.push({ score, game: move });
  }

  let nextBoard = { game: {}, score: -1000 };
  for (const sB of scoredBoards) {
    if (sB.score > nextBoard.score) nextBoard = sB;
  }
  return nextBoard.game;
};

export const calculateNextMove = (board) => {
  const currentBoard = [...board];
  //TODO: Move to other side
  // THE WIN WIN algorithm
  // first checks firsts move. If the player2 hasn't played yet, plays on a random corner
  const moves = currentBoard.reduce((res, line) => {
    const prev = line.reduce((res, el) => {
      return el === AI_PLAYER ? res + 1 : res;
    }, 0);
    return res + prev;
  }, 0);
  if (moves == 0) {
    let played = false;
    while (!played) {
      const firstIndex = Math.random() < 0.5 ? 0 : 2;
      const secondIndex = Math.random() < 0.5 ? 0 : 2;
      if (currentBoard[firstIndex][secondIndex] === '') {
        currentBoard[firstIndex][secondIndex] = AI_PLAYER;
        played = true;
      }
    }
  }
  // for the second move, checks the previous move and plays next to it if's posible.
  else if (moves == 1) {
    const previousMove = currentBoard
      .map((line, lineIndex) => {
        if (line.concat().includes(AI_PLAYER)) {
          return line
            .map((box, columnIndex) => {
              if (box === AI_PLAYER) return { lineIndex, columnIndex };
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
      currentBoard[lineIndex][nextColumn] = AI_PLAYER;
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
        currentBoard[nextLine][columnIndex] = AI_PLAYER;
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
        currentBoard[firstIndex][secondIndex] = AI_PLAYER;
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
        currentBoard[firstIndex][secondIndex] = AI_PLAYER;
        played = true;
      }
    }
  }
  return currentBoard;
};
