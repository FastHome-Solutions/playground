export class Period {
    from: Date
    to: Date

    constructor(from: Date, to: Date) {
        this.from = from
        this.to = to
    }
}

export class CreateBenefitMatrixDto {
    brand: String
    period: Period
    portfolio: String
    tariffNames: String[]
    metaOffers: MetaOfferDto[]

    constructor(
        brand: String,
        period: Period,
        portfolio: String,
        tariffNames: String[],
        metaOffers: MetaOfferDto[],
    ) {
        this.brand = brand
        this.period = period
        this.portfolio = portfolio
        this.tariffNames = tariffNames
        this.metaOffers = metaOffers
    }
}

export class MetaOfferDto {
    manufacturer: String
    deviceName: String
    tco: Number
    offers: OfferDto[]

    constructor(
        manufacturer: String,
        deviceName: String,
        tco: Number,
        offers: OfferDto[],
    ) {
        this.manufacturer = manufacturer
        this.deviceName = deviceName
        this.tco = tco
        this.offers = offers
    }
}

export class OfferDto {
    contractDuration: Number
    tarifName: String
    discount: Number
    voucherName: String
    upfront: Number
    bundlePrice: Number

    constructor(
        contractDuration: Number,
        tarifName: String,
        discount: Number,
        voucherName: String,
        upfront: Number,
        bundlePrice: Number,
    ) {
        this.contractDuration = contractDuration
        this.tarifName = tarifName
        this.discount = discount
        this.voucherName = voucherName
        this.upfront = upfront
        this.bundlePrice = bundlePrice
    }
}
