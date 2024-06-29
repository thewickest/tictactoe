import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './schema/board.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BoardService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  create(createBoardDto: CreateBoardDto) {
    return 'This action adds a new board';
  }

  update(updateBoardDto: UpdateBoardDto) {
    return `This action updates a board`;
  }

  find(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }
}