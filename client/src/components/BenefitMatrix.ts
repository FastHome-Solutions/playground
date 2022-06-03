export default class BenefitMatrix {
    header: Header
    tariffDetails: TariffDetails[]
    constructor(
        header: Header,
        tariffDetails: TariffDetails[]
    ) {
        this.header = header
        this.tariffDetails = tariffDetails
    }
}

export class Header {
    manufacturer: String
    device: String
    parcialPayment: String
    rate: String
    tco: String
    discountAllnetL: String
    discountAllnetXL: String
    discountAllnetPlus: String
    offerAllnetL: String
    offerAllnetXL: String
    offerAllnetPlus: String
    constructor(
        manufacturer: String,
        device: String,
        parcialPayment: String,
        rate: String,
        tco: String,
        discountAllnetL: String,
        discountAllnetXL: String,
        discountAllnetPlus: String,
        offerAllnetL: String,
        offerAllnetXL: String,
        offerAllnetPlus: String) {
        this.manufacturer = manufacturer
        this.device = device
        this.parcialPayment = parcialPayment
        this.rate = rate
        this.tco = tco
        this.discountAllnetL = discountAllnetL
        this.discountAllnetXL = discountAllnetXL
        this.discountAllnetPlus = discountAllnetPlus
        this.offerAllnetL = offerAllnetL
        this.offerAllnetXL = offerAllnetXL
        this.offerAllnetPlus = offerAllnetPlus
    }
}

export class TariffDetails {
    id: Number
    manufacturer: String
    device: String
    parcialPayment: Number
    rate: Number
    tco: Number
    discountAllnetL: Number
    discountAllnetXL: Number
    discountAllnetPlus: Number
    offerAllnetL: Number
    offerAllnetXL: Number
    offerAllnetPlus: Number
    constructor(
        id: Number,
        manufacturer: String,
        device: String,
        parcialPayment: Number,
        rate: Number,
        tco: Number,
        discountAllnetL: Number,
        discountAllnetXL: Number,
        discountAllnetPlus: Number,
        offerAllnetL: Number,
        offerAllnetXL: Number,
        offerAllnetPlus: Number) {
        this.id = id
        this.manufacturer = manufacturer
        this.device = device
        this.parcialPayment = parcialPayment
        this.rate = rate
        this.tco = tco
        this.discountAllnetL = discountAllnetL
        this.discountAllnetXL = discountAllnetXL
        this.discountAllnetPlus = discountAllnetPlus
        this.offerAllnetL = offerAllnetL
        this.offerAllnetXL = offerAllnetXL
        this.offerAllnetPlus = offerAllnetPlus
    }
}