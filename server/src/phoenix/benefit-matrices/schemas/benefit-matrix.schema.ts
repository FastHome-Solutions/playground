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
  till: Date
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

  @Field(() => [DeviceConfiguration])
  @Prop()
  deviceConfigurations: DeviceConfiguration[]
}

@ObjectType()
class DeviceConfiguration {
  @Field()
  @Prop()
  manufacturer: String

  @Field()
  @Prop()
  deviceName: String

  @Field()
  @Prop()
  tco: Number

  @Field(() => [ContractConfiguration])
  @Prop()
  contractConfigurations: ContractConfiguration[]
}

@ObjectType()
class ContractConfiguration {
  @Field()
  @Prop()
  duration: Number

  @Field()
  @Prop()
  upfront: Number

  @Field(() => [TariffConfiguration])
  @Prop()
  tariffConfigurations: TariffConfiguration[]
}

@ObjectType()
class TariffConfiguration {
  @Field()
  @Prop()
  name: String
  
  @Field()
  @Prop()
  discount: Number
  
  @Field()
  @Prop()
  voucherName: String
  
  @Field()
  @Prop()
  bundlePrice: Number
}

export const BenefitMatrixSchema = SchemaFactory.createForClass(BenefitMatrix);
