import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './schema/board.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { checkStatus, calculateNextMove } from './utils/utils.service';

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

  async getStats() {
    const data = this.boardModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);
    const stats = {
      player1: 0,
      player2: 0,
      draw: 0,
    };

    (await data).forEach((result) => {
      if (result.status === 'player1_wins') {
        stats.player1 = Number(result.count);
      } else if (result.status === 'player2_wins') {
        stats.player2 = Number(result.count);
      } else if (result.status === 'draw') {
        stats.draw = Number(result.count);
      }
    });
    return stats;
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

    currentGame.board = calculateNextMove(currentBoard);

    currentGame.status = checkStatus(currentGame, 'O');

    await this.boardModel.findOneAndUpdate({ _id: id }, currentGame);

    return currentGame;
  }
}
