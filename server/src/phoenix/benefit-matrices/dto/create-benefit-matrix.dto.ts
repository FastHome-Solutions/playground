import { Field, InputType } from "@nestjs/graphql";


@InputType()
class ValidityPeriod {

    @Field(() => Date)
    from: Date

    @Field(() => Date)
    till: Date
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

    @Field(() => [DeviceConfigurationDto])
    deviceConfigurations: DeviceConfigurationDto[]
}


@InputType()
class DeviceConfigurationDto {

    @Field()
    manufacturer: String

    @Field()
    deviceName: String

    @Field()
    tco: Number

    @Field(() => [ContractConfigurationDto])
    contractConfigurations: ContractConfigurationDto[]
}

@InputType()
class ContractConfigurationDto {
    @Field()
    duration: Number

    @Field(() => [Number])
    upfronts: Number[]

    @Field(() => [TariffConfigurationDto])
    tariffConfigurations: TariffConfigurationDto[]
}

@InputType()
class TariffConfigurationDto {
    @Field()
    name: String

    @Field()
    discount: Number

    @Field()
    voucherName: String

    @Field(() => [Number])
    bundlePrices: Number[]
}
