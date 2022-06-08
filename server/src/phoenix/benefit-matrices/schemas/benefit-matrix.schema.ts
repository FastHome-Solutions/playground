import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BenefitMatrixDocument = BenefitMatrix & Document;

@ObjectType()
class Period {
  @Field()
  @Prop()
  from: Date

  @Field()
  @Prop()
  to: Date
}

@ObjectType()
@Schema({ collection: 'benefit-matrices' })
export class BenefitMatrix {

  @Field(type => ID)
  _id: Types.ObjectId

  @Field()
  @Prop()
  brand: String

  @Field()
  @Prop()
  period: Period

  @Field()
  @Prop()
  portfolio: String

  @Field(() => [String])
  @Prop()
  tariffNames: String[]

  @Field(() => [MetaOffer])
  @Prop()
  metaOffers: MetaOffer[]
}

@ObjectType()
class MetaOffer {
  @Field()
  @Prop()
  manufacturer: String

  @Field()
  @Prop()
  deviceName: String

  @Field()
  @Prop()
  tco: Number

  @Field(() => [Offer])
  @Prop()
  offers: Offer[]
}

@ObjectType()
class Offer {
  @Field()
  @Prop()
  contractDuration: Number
  
  @Field()
  @Prop()
  tarifName: String
  
  @Field()
  @Prop()
  discount: Number
  
  @Field()
  @Prop()
  voucherName: String
  
  @Field()
  @Prop()
  upfront: Number
  
  @Field()
  @Prop()
  bundlePrice: Number
}

export const BenefitMatrixSchema = SchemaFactory.createForClass(BenefitMatrix);
