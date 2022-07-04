import { TariffConfigurationDto, DeviceConfigurationDto, ContractConfigurationDto } from '@/dto/benefit-matrix.dto'

/**
 * Only the data needed to represent one row of a BenefitMatrixView's table
 * */ 
export class RowData { 
    manufacturer: String
    deviceName: String
    upfrontInternal: number
    tcoInternal: number
    contractDuration: number
    rate: number
    tariffs: TariffData[] = []
    constructor(deviceConfiguration: DeviceConfigurationDto) {
        this.manufacturer = deviceConfiguration.manufacturer
        this.deviceName = deviceConfiguration.deviceName
        this.upfrontInternal = deviceConfiguration.contractConfigurations[0].upfront
        this.tcoInternal =  deviceConfiguration.tco
        this.contractDuration = deviceConfiguration.contractConfigurations[0].duration        
        this.rate = (this.tco - this.upfrontInternal) / this.contractDuration

        deviceConfiguration.contractConfigurations[0].tariffConfigurations.forEach(
            tariffConfiguration => {
                this.tariffs.push(
                    new TariffData(this.rate, tariffConfiguration)
                )
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
                        tariff.bundlePrice
                    )
                )
            }
        )

        return new DeviceConfigurationDto(
            this.manufacturer,
            this.deviceName,
            this.tco,
            new ContractConfigurationDto(
                this.contractDuration,
                this.upfront,
                tariffConfigurations
            )
        )
    }
}
 
class TariffData {
    name: String
    discountInternal: number
    bundlePriceInternal: number
    voucherName: String
    rate: number
    simPrice: number
    constructor(rate: number, tariffConfiguration: TariffConfigurationDto) {
        this.name = tariffConfiguration.name
        this.discountInternal = tariffConfiguration.discount
        this.bundlePriceInternal = tariffConfiguration.bundlePrice
        this.voucherName = tariffConfiguration.voucherName
        this.rate = rate
        this.simPrice = tariffConfiguration.bundlePrice - rate + tariffConfiguration.discount
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
}