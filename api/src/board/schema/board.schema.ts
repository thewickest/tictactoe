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

@Schema()
export class Board {
  @Prop({ type: Object })
  players: Players;

  @Prop()
  board: string[][];

  @Prop()
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
