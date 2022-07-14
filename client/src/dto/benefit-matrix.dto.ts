export class PeriodInputType {
    from: Date
    till: Date

    constructor(from: Date, till: Date) {
        this.from = from
        this.till = till
    }
}

export class BenefitMatrixInputType {
    _id: String
    brand: String
    period: PeriodInputType
    portfolio: String
    tariffNames: String[]
    deviceConfigurations: DeviceConfigurationInputType[]

    constructor(
        brand: String,
        period: PeriodInputType,
        portfolio: String,
        tariffNames: String[],
        deviceConfigurations: DeviceConfigurationInputType[],
    ) {
        this.brand = brand
        this.period = period
        this.portfolio = portfolio
        this.tariffNames = tariffNames
        this.deviceConfigurations = deviceConfigurations
    }
}

export class DeviceConfigurationInputType {
    manufacturer: String
    deviceName: String
    tco: Number
    contractConfigurations: ContractConfigurationInputType[]

    constructor(
        manufacturer: String,
        deviceName: String,
        tco: Number,
        contractConfigurations: ContractConfigurationInputType[],
    ) {
        this.manufacturer = manufacturer
        this.deviceName = deviceName
        this.tco = tco
        this.contractConfigurations = contractConfigurations
    }
}

export class ContractConfigurationInputType {
    duration: Number
    upfronts: Number[]
    tariffConfigurations: TariffConfigurationInputType[]

    constructor(
        duration: Number,
        upfronts: Number[],
        tariffConfigurations: TariffConfigurationInputType[]
    ) {
        this.duration = duration
        this.upfronts = upfronts
        this.tariffConfigurations = tariffConfigurations
    }
}

export class TariffConfigurationInputType {
    name: String
    discount: Number
    voucherName: String
    bundlePrices: Number[]

    constructor(
        name: String,
        discount: Number,
        voucherName: String,
        bundlePrices: Number[],
    ) {
        this.name = name
        this.discount = discount
        this.voucherName = voucherName
        this.bundlePrices = bundlePrices
    }
}
