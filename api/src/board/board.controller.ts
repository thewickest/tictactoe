import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './schema/board.schema';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.create(createBoardDto);
  }

  @Get('/new')
  async createNewBoard(): Promise<Board> {
    return this.boardService.createNewBoard();
  }

  @Get('/stats')
  async getStats() {
    return this.boardService.getStats();
  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return await this.boardService.patch(id, updateBoardDto);
  }

  @Get()
  async findCurrentBoard(): Promise<Board> {
    return await this.boardService.findCurrentBoard();
  }

  @Get(':id')
  async findNextBoard(@Param('id') id: string): Promise<Board> {
    return await this.boardService.generateNextBoard(id);
  }
}
