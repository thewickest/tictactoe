import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Put()
  update(@Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(updateBoardDto);
  }

  @Get()
  find() {
    return this.boardService.find();
  }
}
