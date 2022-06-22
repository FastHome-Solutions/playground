import { read, utils } from "xlsx"
import { BenefitMatrixDto, Period, OfferDto, MetaOfferDto } from "@/dto/benefit-matrix.dto"

export default function uploadFile(chosenFile: Blob): Promise<BenefitMatrixDto> {
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
                const rows: [][] = utils.sheet_to_json(workSheet, { header: 1 })

                const headerRowNumber = 76 - 1
                const lastContentRowNumber = 108 - 1
                const firstContentColumn = 4 - 1// D
                const lastContentColumn = 14 - 1// N
                const firstBundlePriceColumn = 12 - 1 // L
                const numberOfTariffs = lastContentColumn - firstBundlePriceColumn

                const headerRow: [] = rows[headerRowNumber]

                const tariffNames: String[] = []
                for (let i = firstBundlePriceColumn; i <= lastContentColumn; i++) {
                    const tariffName = headerRow[i]
                    tariffNames.push(tariffName)
                }

                // TODO
                // this.showDialog()

                const period = new Period(
                    new Date('2022-06-09'),
                    new Date('2022-06-16'),
                )

                const metaOffers: MetaOfferDto[] = []

                for (let i = headerRowNumber + 1; i <= lastContentRowNumber; i++) {
                    const row = rows[i]
                    const offers: OfferDto[] = []
                    for (let i = 0; i <= numberOfTariffs; i++) {
                        offers.push(
                            new OfferDto(
                                24, //contractDuration
                                tariffNames[i], // tarifName
                                row[firstContentColumn + 5 + i], // discount
                                'vouchername', // voucherName Todo: For blau, currently equals to discount
                                row[firstContentColumn + 2], // upfront
                                row[firstContentColumn + 8 + i] // bundlePrice
                            )
                        )
                    }

                    metaOffers.push(
                        new MetaOfferDto(
                            row[firstContentColumn],
                            row[firstContentColumn + 1],
                            row[firstContentColumn + 4],
                            offers
                        )
                    )
                }

                const benefitMatrixDto = new BenefitMatrixDto(
                    'Blau',
                    period,
                    'Online',
                    tariffNames,
                    metaOffers
                )

                resolve(benefitMatrixDto)

            }
            reader.readAsBinaryString(chosenFile);
        }
    )
}
