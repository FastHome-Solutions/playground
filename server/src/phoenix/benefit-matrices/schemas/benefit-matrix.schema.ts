import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BenefitMatrixDocument = BenefitMatrix & Document;

@ObjectType()
@Schema({ collection: 'benefit-matrices' })
export class BenefitMatrix {
  @Field(type => ID)
  @Prop()
  name: string;

  @Field()
  @Prop()
  age: number;

  @Field()
  @Prop()
  breed: string;
}

export const BenefitMatrixSchema = SchemaFactory.createForClass(BenefitMatrix);
