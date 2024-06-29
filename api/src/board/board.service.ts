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

  async generateNextBoard(id: string): Promise<Board> {
    const currentGame: Board = await this.boardModel.findOne({
      _id: id,
    });
    const { board: currentBoard } = currentGame;
    let playing = true;
    while (playing) {
      const firstIndex = Math.floor(Math.random() * 3);
      const secondIndex = Math.floor(Math.random() * 3);
      if (currentBoard[firstIndex][secondIndex] == '') {
        currentBoard[firstIndex][secondIndex] = 'O';
        playing = false;
      }
    }

    // Generated the next move from the current board
    // console.log('board', currentBoard);
    // // THE WIN WIN algorithm
    // // first checks firsts move. If the player2 hasn't played yet, plays on a random corner
    // const fakeBoard = [['','','O'],['','X','X'],['','','']]
    // const moves = fakeBoard.filter((line) => line.concat().includes('O'));
    // if (moves.length == 0) {
    //   const firstIndex = Math.floor(Math.random() * 3);
    //   const secondIndex = Math.floor(Math.random() * 3);
    //   if (fakeBoard[firstIndex][secondIndex] !== '') {
    //     fakeBoard[secondIndex][firstIndex] = 'O';
    //   } else {
    //     fakeBoard[firstIndex][secondIndex] = 'O';
    //   }
    // }
    // // for the second move, checks the previous move and plays next to it if's posible.
    // else {
    //   const previousMove = fakeBoard
    //     .map((line, lineIndex) => {
    //       if (line.concat().includes('O')) {
    //         return line
    //           .map((box, columnIndex) => {
    //             if (box === 'O') return { lineIndex, columnIndex };
    //           })
    //           .filter((el) => el);
    //       }
    //     })
    //     .filter((el) => el)[0][0];
    //   console.log('prvious ', previousMove);
    //   const { lineIndex, columnIndex } = previousMove;
    //   if(columnIndex + 1 < 3 && fakeBoard[lineIndex][columnIndex] !== 'X')
    // }
    // for the third move, tries to play in any other corner.
    // for the other moves, tries to win and block the other player
    //

    await this.boardModel.findOneAndUpdate({ _id: id }, currentGame);

    return currentGame;
  }
}
