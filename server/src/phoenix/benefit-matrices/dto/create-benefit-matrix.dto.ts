import { Field, InputType } from "@nestjs/graphql";


@InputType()
class ValidityPeriodInputType {

    @Field(() => Date)
    from: Date

    @Field(() => Date)
    till: Date
}

@InputType()
export class BenefitMatrixInputType {

    @Field(() => String, { nullable: true })
    _id: String

    @Field()
    brand: String

    @Field()
    period: ValidityPeriodInputType

    @Field()
    portfolio: String

    @Field(() => [String])
    tariffNames: String[]

    @Field(() => [DeviceConfigurationInputType])
    deviceConfigurations: DeviceConfigurationInputType[]
}


@InputType()
class DeviceConfigurationInputType {

    @Field()
    manufacturer: String

    @Field()
    deviceName: String

    @Field()
    tco: Number

    @Field(() => [ContractConfigurationInputType])
    contractConfigurations: ContractConfigurationInputType[]
}

@InputType()
class ContractConfigurationInputType {
    @Field()
    duration: Number

    @Field(() => [Number])
    upfronts: Number[]

    @Field(() => [TariffConfigurationInputType])
    tariffConfigurations: TariffConfigurationInputType[]
}

@InputType()
class TariffConfigurationInputType {
    @Field()
    name: String

    @Field()
    discount: Number

    @Field()
    voucherName: String

    @Field(() => [Number])
    bundlePrices: Number[]
}
