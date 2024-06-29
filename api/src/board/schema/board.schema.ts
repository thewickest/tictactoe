import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

interface Player {
  id: string;
  symbol: 'X' | 'O';
}

export interface Players {
  player1: Player;
  player2: Player;
}

export type status = 'ongoing' | 'draw' | 'player1_wins' | 'player2_wins';

@Schema()
export class Board {
  @Prop({ type: Object })
  players: Players;

  @Prop()
  board: string[][];

  @Prop()
  status: status;

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
