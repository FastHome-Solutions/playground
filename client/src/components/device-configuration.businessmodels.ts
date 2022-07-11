import { TariffConfigurationDto, DeviceConfigurationDto, ContractConfigurationDto } from '@/dto/benefit-matrix.dto'
import type { BenefitMatrixBundlePrice, BenefitMatrixDiscount, BenefitMatrixRowData } from './benefit-matrix.businessmodel'

/**
 * Only the data needed to represent one row of a BenefitMatrixView's table in the DeviceConfigurationDialog
 * */
export class RowData {
    manufacturer: String
    deviceName: String
    private upfrontInternal: number
    private originalUpfronts: number[]
    private originalUpfrontIndex: number
    tcoInternal: number
    contractDuration: number
    rate: number
    tariffs: TariffData[] = []

    constructor(rowData: BenefitMatrixRowData) {
        this.manufacturer = rowData.manufacturer
        this.deviceName = rowData.deviceName
        this.upfrontInternal = rowData.upfront
        this.originalUpfronts = [...rowData.allUpfronts]
        this.originalUpfrontIndex = this.originalUpfronts.indexOf(this.upfrontInternal)
        this.tcoInternal = rowData.tco
        this.contractDuration = rowData.contractDuration
        this.rate = (this.tco - this.upfrontInternal) / this.contractDuration

        this.tariffs = rowData.discounts.map(
            (discount, i) => {
                const bundlePrice = rowData.bundlePrices[i]

                return new TariffData(this.rate, discount, bundlePrice)
            }
        )
    }

    get upfront() {
        return this.upfrontInternal
    }

    set upfront(upfront: number) {
        this.upfrontInternal = upfront
        this.rate = (this.tcoInternal - this.upfrontInternal) / this.contractDuration
    }

    get tco() {
        return this.tcoInternal
    }

    set tco(tco: number) {
        this.tcoInternal = tco
        this.rate = (this.tcoInternal - this.upfrontInternal) / this.contractDuration
    }

    toDeviceConfigurationDto(): DeviceConfigurationDto {
        const tariffConfigurations: TariffConfigurationDto[] = []

        this.tariffs.forEach(
            tariff => {
                tariffConfigurations.push(
                    new TariffConfigurationDto(
                        tariff.name,
                        tariff.discount,
                        tariff.voucherName,
                        tariff.bundlePrices,
                    )
                )
            }
        )

        this.originalUpfronts[this.originalUpfrontIndex] = this.upfront

        return new DeviceConfigurationDto(
            this.manufacturer,
            this.deviceName,
            this.tco,
            [
                new ContractConfigurationDto(
                    this.contractDuration,
                    this.originalUpfronts,
                    tariffConfigurations
                )
            ]
        )
    }
}

class TariffData {
    name: String
    discountInternal: number
    bundlePriceInternal: number
    private originalBundlePrices: number[]
    private originalBundlePriceIndex: number
    voucherName: String
    rate: number
    simPrice: number
    constructor(rate: number, discount: BenefitMatrixDiscount, bundlePrice: BenefitMatrixBundlePrice) {
        this.name = discount.tariffName
        this.discountInternal = discount.discount
        this.bundlePriceInternal = bundlePrice.bundlePrice
        this.originalBundlePrices = [...bundlePrice.allBundlePrices]
        this.originalBundlePriceIndex = this.originalBundlePrices.indexOf(this.bundlePriceInternal)
        this.voucherName = discount.voucherName
        this.rate = rate
        this.simPrice = bundlePrice.bundlePrice - rate + discount.discount
    }

    set discount(discount: number) {
        this.discountInternal = discount
        this.bundlePriceInternal = this.rate + this.simPrice - this.discount
    }

    get discount() {
        return this.discountInternal
    }

    set bundlePrice(bundlePrice: number) {
        this.bundlePriceInternal = bundlePrice
        this.discount = (this.bundlePriceInternal - this.rate - this.simPrice) * -1
    }

    get bundlePrice() {
        return this.bundlePriceInternal
    }

    get bundlePrices() {
        this.originalBundlePrices[this.originalBundlePriceIndex] = this.bundlePriceInternal
        return this.originalBundlePrices
    }
}