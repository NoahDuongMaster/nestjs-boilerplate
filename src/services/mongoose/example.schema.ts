import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExampleDocument = HydratedDocument<Example>;

@Schema()
export class Example {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
