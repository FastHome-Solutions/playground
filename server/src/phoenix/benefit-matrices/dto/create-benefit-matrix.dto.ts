import { Field, InputType } from "@nestjs/graphql";


@InputType()
class ValidityPeriod {

    @Field(() => Date)
    from: Date

    @Field(() => Date)
    to: Date
}


@InputType()
export class CreateBenefitMatrixDto {

    @Field()
    brand: String

    @Field()
    period: ValidityPeriod

    @Field()
    portfolio: String

    @Field(() => [String])
    tariffNames: String[]

    @Field(() => [MetaOfferDto])
    metaOffers: MetaOfferDto[]

}


@InputType()
class MetaOfferDto {

    @Field()
    manufacturer: String

    @Field()
    deviceName: String

    @Field()
    tco: Number

    @Field(() => [OfferDto])
    offers: OfferDto[]

}


@InputType()
class OfferDto {

    @Field()
    contractDuration: Number

    @Field()
    tarifName: String

    @Field()
    discount: Number

    @Field()
    voucherName: String

    @Field()
    upfront: Number

    @Field()
    bundlePrice: Number

}
