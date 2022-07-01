import { read, utils } from "xlsx"
import { BenefitMatrixDto, Period, ContractConfigurationDto, TariffConfigurationDto, DeviceConfigurationDto } from "@/dto/benefit-matrix.dto"

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

export function parseMetadataSuggestions(filename: String, spreadsheet: [][]): SpreadsheetMetadata {
    const startYear = (filename.length > 4) ? filename.substring(0, 4) : null

    var from = ''
    var to = ''

    // From date
    if (filename.length >= 9) {
        from = startYear + '-' + filename.substring(4, 6) + '-' + filename.substring(6, 8) + 'T00:00:00'
    }
    spreadsheet.forEach(
        (row) => {
            row.find((cell) => {

                // To date
                if (cell && cell.length >= 6) {
                    var dateFormat = filename.substring(6, 8) + '.' + filename.substring(4, 6) + '.'
                    if (cell.substring(0, 6) === dateFormat) {
                        to = startYear + '-' + cell.substring(12, 14) + '-' + cell.substring(9, 11) + 'T23:59:59'
                    }
                }

                // TODO Range start

                // TODO Range end
            }
            )
        }
    )
    console.log('startDate ' + from)
    console.log('endDate ' + to)

    const metadata = new SpreadsheetMetadata(new Date(from), new Date(to), 'D76', 'N106', 'Online')
    return metadata

}

export function parseSpreadsheet(metadata: SpreadsheetMetadata, spreadsheet: [[]]): BenefitMatrixDto {
    const headerRowNumber = metadata.rangeStart.replace(/[^0-9]/gi, '') - 1
    const lastContentRowNumber = metadata.rangeEnd.replace(/[^0-9]/gi, '') - 1
    const firstContentColumn = excelColumnToIndex(metadata.rangeStart) - 1
    const lastContentColumn = excelColumnToIndex(metadata.rangeEnd) - 1
    const firstBundlePriceColumn = 12 - 1 // L
    const numberOfTariffs = lastContentColumn - firstBundlePriceColumn

    const headerRow: [] = spreadsheet[headerRowNumber]

    const tariffNames: String[] = []
    for (let i = firstBundlePriceColumn; i <= lastContentColumn; i++) {
        const tariffName = headerRow[i]
        tariffNames.push(tariffName)
    }

    const period = new Period(
        metadata.from,
        metadata.till,
    )

    const deviceConfigurations: DeviceConfigurationDto[] = []

    for (let i = headerRowNumber + 1; i <= lastContentRowNumber; i++) {
        const row = spreadsheet[i]
        const contractConfigurations: ContractConfigurationDto[] = []
        const tariffConfigurations: TariffConfigurationDto[] = []
        for (let i = 0; i <= numberOfTariffs; i++) {
            tariffConfigurations.push(
                new TariffConfigurationDto(
                    tariffNames[i], // tarifName
                    row[firstContentColumn + 5 + i], // discount
                    'vouchername', // voucherName Todo: For blau, currently equals to discount
                    row[firstContentColumn + 8 + i], // bundlePrice
                )
            )    
        }

        //TODO: Handle multiple contract configurations
        contractConfigurations.push(
            new ContractConfigurationDto(
                24, //contractDuration
                row[firstContentColumn + 2], // upfront
                tariffConfigurations,
            )
        )

        deviceConfigurations.push(
            new DeviceConfigurationDto(
                row[firstContentColumn], // manufacturer
                row[firstContentColumn + 1], // device name
                row[firstContentColumn + 4], // TCO
                contractConfigurations,
            )
        )
    }

    const benefitMatrixDto = new BenefitMatrixDto(
        'Blau', // TODO
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

export class SpreadsheetMetadata {
    from: Date;
    till: Date;
    rangeStart: String;
    rangeEnd: String;
    portfolio: String;
    constructor(from: Date, to: Date, rangeStart: String, rangeEnd: String, portfolio: String) {
        this.from = from
        this.till = to
        this.rangeStart = rangeStart
        this.rangeEnd = rangeEnd
        this.portfolio = portfolio
    }
}