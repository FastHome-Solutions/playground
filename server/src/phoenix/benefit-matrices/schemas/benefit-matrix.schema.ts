import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BenefitMatrixDocument = BenefitMatrix & Document;

@Schema({ collection: 'benefit-matrices' })
export class BenefitMatrix {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const BenefitMatrixSchema = SchemaFactory.createForClass(BenefitMatrix);
