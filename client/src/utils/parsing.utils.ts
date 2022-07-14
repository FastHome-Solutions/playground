import { read, utils } from "xlsx"
import { BenefitMatrixInputType, PeriodInputType, ContractConfigurationInputType, TariffConfigurationInputType, DeviceConfigurationInputType } from "@/dto/benefit-matrix.dto"

export function uploadFile(chosenFile: Blob): Promise<[][]> {
    // var chosenFile = event.target.files[0];
    const reader = new FileReader();

    return new Promise(
        function (resolve, reject) {
            reader.onload = (progressEvent) => {
                if (progressEvent === null) {
                    reject('Couldn\'t load file')
                }

                // Parse data 
                const bstr = progressEvent.target.result
                const workBook = read(bstr, { type: 'binary' })
                // Get first worksheet
                const workSheetName = workBook.SheetNames[0]
                const workSheet = workBook.Sheets[workSheetName]

                // Extract rows 
                const spreadsheet: [][] = utils.sheet_to_json(workSheet, { header: 1 })

                resolve(spreadsheet)
            }
            reader.readAsBinaryString(chosenFile);
        }
    )
}

export function parseMetadataSuggestions(filename: String, spreadsheet: [][]): BenefitMatrixMetadata {
    const startYear = (filename.length > 4) ? filename.substring(0, 4) : null

    var from = ''
    var till = ''

    // From date
    if (filename.length >= 9) {
        from = startYear + '-' + filename.substring(4, 6) + '-' + filename.substring(6, 8) + 'T00:00:00'
    }
    spreadsheet.forEach(
        (row) => {
            row.find((cell) => {

                // Till date
                if (cell && cell.length >= 6) {
                    var dateFormat = filename.substring(6, 8) + '.' + filename.substring(4, 6) + '.'
                    if (cell.substring(0, 6) === dateFormat) {
                        till = startYear + '-' + cell.substring(12, 14) + '-' + cell.substring(9, 11) + 'T23:59:59'
                    }
                }

                // TODO Range start

                // TODO Range end
            }
            )
        }
    )
    console.log('startDate ' + from)
    console.log('endDate ' + till)

    const metadata = new SpreadsheetMetadata(new Date(from), new Date(till), 'Blau', 'Online', 'D76', 'N106')
    return metadata
}

export function parseSpreadsheet(metadata: SpreadsheetMetadata, spreadsheet: [[]]): BenefitMatrixInputType {
    const headerRowNumber = removeChars(metadata.rangeStart) - 1
    const lastContentRowNumber = metadata.rangeEnd.replace(/[^0-9]/gi, '') - 1
    const firstContentColumn = excelColumnToIndex(metadata.rangeStart) - 1
    const lastContentColumn = excelColumnToIndex(metadata.rangeEnd) - 1
    let firstBundlePriceColumn = 12 - 1 // defautl to L

    let firstDiscountIndex = 5
    let upfrontIndex = 2
    let tcoIndex = 4
    let hasMultipleContractDurations = false

    const headerRow: [] = spreadsheet[headerRowNumber]

    if (headerRow.includes('Laufzeit')) {
        // Multiple contract durations
        hasMultipleContractDurations = true
        firstDiscountIndex = 6
        upfrontIndex = 3
        tcoIndex = 5
    }

    const firstTariffName = headerRow[firstContentColumn + firstDiscountIndex] // Discount's tariff name
    for (let i = firstContentColumn + firstDiscountIndex + 1; i <= lastContentColumn; i++) {
        if (headerRow[i] == firstTariffName) { // First row with the same name as the first discount's, is where bundles start
            firstBundlePriceColumn = i
        }
    }
    const numberOfTariffs = lastContentColumn - firstBundlePriceColumn

    const tariffNames: String[] = []
    for (let i = firstBundlePriceColumn; i <= lastContentColumn; i++) {
        const tariffName = removeLineBreaks(headerRow[i]).trim()
        tariffNames.push(tariffName)
    }

    const period = new PeriodInputType(
        metadata.from,
        metadata.till,
    )

    const deviceConfigurations: DeviceConfigurationInputType[] = []

    var lastDeviceConfig: DeviceConfigurationInputType
    for (let i = headerRowNumber + 1; i <= lastContentRowNumber; i++) {
        const row = spreadsheet[i]
        const contractConfigurations: ContractConfigurationInputType[] = []
        const tariffConfigurations: TariffConfigurationInputType[] = []
        for (let i = 0; i <= numberOfTariffs; i++) {
            tariffConfigurations.push(
                new TariffConfigurationInputType(
                    tariffNames[i], // tariffName
                    row[firstContentColumn + firstDiscountIndex + i], // discount
                    row[firstContentColumn + firstDiscountIndex + i] + '', // voucherName. For blau, currently equals to discount
                    [row[firstBundlePriceColumn + i]], // bundlePrice
                )
            )
        }

        let contractDuration = 24
        if (hasMultipleContractDurations) {
            contractDuration = removeChars(row[firstContentColumn + 2])
        }

        contractConfigurations.push(
            new ContractConfigurationInputType(
                contractDuration,
                [row[firstContentColumn + upfrontIndex]], // upfronts
                tariffConfigurations,
            )
        )

        if (lastDeviceConfig && lastDeviceConfig.manufacturer == row[firstContentColumn] && lastDeviceConfig.deviceName == row[firstContentColumn + 1]) {
            lastDeviceConfig.contractConfigurations = lastDeviceConfig.contractConfigurations.concat(contractConfigurations)
        } else {
            const deviceConfiguration = new DeviceConfigurationInputType(
                row[firstContentColumn], // manufacturer
                row[firstContentColumn + 1], // device name
                row[firstContentColumn + tcoIndex], // TCO
                contractConfigurations,
            )
            deviceConfigurations.push(deviceConfiguration)
            lastDeviceConfig = deviceConfiguration
        }
    }

    const benefitMatrixDto = new BenefitMatrixInputType(
        metadata.brand,
        period,
        metadata.portfolio,
        tariffNames,
        deviceConfigurations
    )

    return benefitMatrixDto
}

function excelColumnToIndex(columnName: String): Number {
    const sanitizedColumnName = columnName.replace(/[0-9]/g, '')
    const numberOfLetters = sanitizedColumnName.length

    var columnIndex = 0
    for (let i = 0; i < numberOfLetters; i++) {
        columnIndex *= 26
        const charIndex = sanitizedColumnName.charCodeAt(i) - 65 + 1
        columnIndex += charIndex
    }
    return columnIndex
}

function removeChars(stringWithChars: string): number {
    return parseInt(stringWithChars.replace(/[^0-9]/gi, ''))
}

function removeLineBreaks(stringWithBreaks: string): string {
    return stringWithBreaks.replace(/(\r\n|\n|\r)/gm, '')
}

export class BenefitMatrixMetadata {
    from: Date
    till: Date
    brand: string
    portfolio: string
    constructor(from: Date, till: Date, brand: string, portfolio: string) {
        this.from = from
        this.till = till
        this.brand = brand
        this.portfolio = portfolio
    }
}

export class SpreadsheetMetadata extends BenefitMatrixMetadata {
    rangeStart: string
    rangeEnd: string
    constructor(from: Date, till: Date, brand: string, portfolio: string, rangeStart: string, rangeEnd: string) {
        super(from, till, brand, portfolio)
        this.rangeStart = rangeStart
        this.rangeEnd = rangeEnd
    }
}