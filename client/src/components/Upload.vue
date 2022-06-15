<template>
  <v-card width="600" height="160" raised class="mx-auto">
    <v-card-title>Upload spreadsheet</v-card-title>
    <br>
    <v-card-text>
      <v-file-input accept="application/vnd.ms-excel, application/msexcel, application/x-msexcel, application/x-ms-excel, 
    application/x-excel, application/x-dos_ms_excel, application/xls, application/x-xls,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Click here to select a file to upload"
        outlined @change="uploadFile" show-size placeholder="Pick a file to upload">
      </v-file-input>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { read, utils } from "xlsx"
import { BenefitMatrix, Header, TariffDetails } from "./BenefitMatrix"
import gql from 'graphql-tag'
import { CreateBenefitMatrixDto, Period, OfferDto, MetaOfferDto } from "@/dto/create-benefit-matrix.dto"
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'


export default {
  setup() {
    const benefitMatrixStore = useBenefitMatrixStore()

    return {
      benefitMatrixStore
    }
  },
  methods: {
    /**
     * Currently, this function isn't actually uploading, just parsing.
     * I assume this will be done on the server eventually.
     * @param event 
     */
    uploadFile(event) {
      var chosenFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (progressEvent) => {
        if (progressEvent === null) {
          return
        }

        // Parse data 
        const bstr = progressEvent.target.result
        const workBook = read(bstr, { type: 'binary' })
        // Get first worksheet
        const workSheetName = workBook.SheetNames[0]
        const workSheet = workBook.Sheets[workSheetName]

        // Extract rows 
        const rows: [][] = utils.sheet_to_json(workSheet, { header: 1 })
        // Get Benefit Matrix header. 
        // TODO: hardcoded to row 75. needs to be dynamic
        const filteredHeaderRow: [] = rows[75].filter(element => {
          return element !== null
        })
        const header = new Header(
          filteredHeaderRow[0],
          filteredHeaderRow[1],
          filteredHeaderRow[2],
          filteredHeaderRow[3],
          filteredHeaderRow[4],
          filteredHeaderRow[5],
          filteredHeaderRow[6],
          filteredHeaderRow[7],
          filteredHeaderRow[8],
          filteredHeaderRow[9],
          filteredHeaderRow[10]
        )
        // Get Benefit Matrix data
        // TODO: replace hardcoded column numbers
        const tariffData: TariffDetails[] = []
        for (let i = 76; i < 108; i++) {
          const row = rows[i]
          row.splice(0, 3) // filter out the leftmost cell
          const tariffDetails = new TariffDetails(
            i,
            row[0],
            row[1],
            row[2],
            row[3],
            row[4],
            row[5],
            row[6],
            row[7],
            row[8],
            row[9],
            row[10]
          )
          tariffData.push(tariffDetails)
        }

        const benefitMatrix = new BenefitMatrix(header, tariffData)
        this.benefitMatrixStore.uploadSpreadsheet(benefitMatrix)
        // this.$emit('uploaded-file', benefitMatrix)

        // Transform to format used on the 
        // TODO: parse
        const period = new Period(
          new Date('2022-06-09'),
          new Date('2022-06-16'),
        )

        const offers = [
          new OfferDto(
            24,
            'Allnet XL',
            -1.5,
            'vouchername',
            1,
            34.99
          )
        ]

        const metaOffers = [
          new MetaOfferDto (
            'Apple',
            'iPhone 16',
            519,
            offers
          )
        ]

        const benefitMatrixDto = new CreateBenefitMatrixDto(
            'Blau',
            period,
            'Online',
            ['Allnet L', 'Allnet XL'],
            metaOffers
        )

        // to the server!
        this.$apollo.mutate({
          mutation: gql`mutation CreateBenefitMatrix($benefitMatrix: CreateBenefitMatrixDto!) {
            createBenefitMatrix(benefitMatrix: $benefitMatrix) {
              _id
              brand
              portfolio
            }
          }`,
          variables: {
            benefitMatrix: benefitMatrixDto
          },
        }).then((data) => {
          // Result
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
      reader.readAsBinaryString(chosenFile);
    }
  },
  apollo: {

  },
}
</script>