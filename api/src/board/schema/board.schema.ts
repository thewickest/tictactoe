import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop([String])
  board: string[];

  @Prop()
  status: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
