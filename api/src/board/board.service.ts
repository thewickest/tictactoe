import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './schema/board.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { checkStatus } from './utils/utils.service';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const createdBoard = new this.boardModel({
      ...createBoardDto,
      createdAt: new Date(),
      updateAt: new Date(),
    });
    return createdBoard.save();
  }

  async createNewBoard(): Promise<Board> {
    const newBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    const createdBoard = new this.boardModel({
      board: newBoard,
      status: 'ongoing',
      createdAt: new Date(),
      updateAt: new Date(),
    });
    return createdBoard.save();
  }

  async patch(id: string, updateBoardDto: any): Promise<Board> {
    const currentGame = await this.boardModel.findOne({ _id: id }).lean();
    const stat = checkStatus(
      { ...currentGame, board: updateBoardDto.board },
      'X',
    );
    return await this.boardModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...updateBoardDto,
        status: stat,
      },
      { new: true },
    );
  }

  async findCurrentBoard(): Promise<Board> {
    return (await this.boardModel.find().sort({ createdAt: -1 }))[0];
  }

  async generateNextBoard(id: string): Promise<Board> {
    const currentGame: Board = await this.boardModel.findOne({
      _id: id,
    });
    const { board: currentBoard } = currentGame;
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
      while (played) {
        const firstIndex = Math.floor(Math.random() * 3);
        const secondIndex = Math.floor(Math.random() * 3);
        if (currentBoard[firstIndex][secondIndex] == '') {
          currentBoard[firstIndex][secondIndex] = 'O';
          played = true;
        }
      }
    }

    currentGame.status = checkStatus(currentGame, 'O');

    await this.boardModel.findOneAndUpdate({ _id: id }, currentGame);

    return currentGame;
  }
}
