import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './schema/board.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async patch(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return await this.boardModel.findOneAndUpdate({ _id: id }, updateBoardDto);
  }

  async findCurrentBoard(): Promise<Board> {
    return (await this.boardModel.find().sort({ createdAt: -1 }))[0];
  }
}
