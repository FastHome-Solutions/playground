export class Period {
    from: Date
    till: Date

    constructor(from: Date, till: Date) {
        this.from = from
        this.till = till
    }
}

export class BenefitMatrixDto {
    _id: String
    brand: String
    period: Period
    portfolio: String
    tariffNames: String[]
    deviceConfigurations: DeviceConfigurationDto[]

    constructor(
        brand: String,
        period: Period,
        portfolio: String,
        tariffNames: String[],
        deviceConfigurations: DeviceConfigurationDto[],
    ) {
        this.brand = brand
        this.period = period
        this.portfolio = portfolio
        this.tariffNames = tariffNames
        this.deviceConfigurations = deviceConfigurations
    }
}

export class DeviceConfigurationDto {
    manufacturer: String
    deviceName: String
    tco: Number
    contractConfigurations: ContractConfigurationDto[]

    constructor(
        manufacturer: String,
        deviceName: String,
        tco: Number,
        contractConfigurations: ContractConfigurationDto[],
    ) {
        this.manufacturer = manufacturer
        this.deviceName = deviceName
        this.tco = tco
        this.contractConfigurations = contractConfigurations
    }
}

export class ContractConfigurationDto {
    duration: Number
    upfronts: Number[]
    tariffConfigurations: TariffConfigurationDto[]

    constructor(
        duration: Number,
        upfronts: Number[],
        tariffConfigurations: TariffConfigurationDto[]
    ) {
        this.duration = duration
        this.upfronts = upfronts
        this.tariffConfigurations = tariffConfigurations
    }
}

export class TariffConfigurationDto {
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
