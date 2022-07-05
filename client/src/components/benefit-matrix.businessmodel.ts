import type { BenefitMatrixDto } from '@/dto/benefit-matrix.dto'

/**
 * Only the data needed to represent one row of a BenefitMatrixView table
 * */
export class BenefitMatrixRowData {
    manufacturer: string
    deviceName: string
    contractDuration: number
    upfront: number
    rate: number
    tco: number
    discounts: BenefitMatrixDiscount[]
    bundlePrices: BenefitMatrixBundlePrice[]

    constructor(
        manufacturer: string,
        deviceName: string,
        contractDuration: number,
        upfront: number,
        rate: number,
        tco: number,
        discounts: BenefitMatrixDiscount[],
        bundlePrices: BenefitMatrixBundlePrice[],
    ) {
        this.manufacturer = manufacturer
        this.deviceName = deviceName
        this.contractDuration = contractDuration
        this.upfront = upfront
        this.rate = rate
        this.tco = tco
        this.discounts = discounts
        this.bundlePrices = bundlePrices
    }
}

export class BenefitMatrixDiscount {
    tariffName: string
    voucherName: string
    discount: number

    constructor(tariffName: string, voucherName: string, discount: number) {
        this.tariffName = tariffName
        this.voucherName = voucherName
        this.discount = discount
    }
}

export class BenefitMatrixBundlePrice {
    tariffName: String
    bundlePrice: number

    constructor(tariffName: string, bundlePrice: number) {
        this.tariffName = tariffName
        this.bundlePrice = bundlePrice
    }
}

export function benefitMatrixToRowData(benefitMatrix: BenefitMatrixDto): BenefitMatrixRowData[] {
    const rows: BenefitMatrixRowData[] = []

    benefitMatrix.deviceConfigurations.forEach(
        deviceConfiguration => {
            deviceConfiguration.contractConfigurations.forEach(
                contractConfiguration => {

                    const discounts: BenefitMatrixDiscount[] = []
                    const bundlePrices: BenefitMatrixBundlePrice[] = []

                    contractConfiguration.tariffConfigurations.forEach(
                        tariffConfiguration => {
                            discounts.push(
                                new BenefitMatrixDiscount(
                                    tariffConfiguration.name,
                                    tariffConfiguration.voucherName,
                                    tariffConfiguration.discount,
                                )
                            )
                            bundlePrices.push(
                                new BenefitMatrixBundlePrice(
                                    tariffConfiguration.name,
                                    tariffConfiguration.bundlePrice,
                                )
                            )
                        }
                    )

                    const rate = (deviceConfiguration.tco - contractConfiguration.upfront) / contractConfiguration.duration

                    rows.push(new BenefitMatrixRowData(
                        deviceConfiguration.manufacturer,
                        deviceConfiguration.deviceName,
                        contractConfiguration.duration,
                        contractConfiguration.upfront,
                        rate,
                        deviceConfiguration.tco,
                        discounts,
                        bundlePrices,
                    ))
                }
            )
        }
    )

    return rows
}