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

  <div class="text-center">
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">Upload Metadata</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Filename*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Spreadsheet ID*"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="From*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="To*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Range start*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Range end*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="['Online', 'Offline']" label="Portfolios*" required multiple
                  hint="Multiple selections possible" persistent-hint></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="dialog = false">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { read, utils } from "xlsx"
import { BenefitMatrixDto, Period, OfferDto, MetaOfferDto } from "@/dto/benefit-matrix.dto"
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'

export default {
  setup() {
    const benefitMatrixStore = useBenefitMatrixStore()

    return {
      benefitMatrixStore
    }
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    showDialog() {
      this.dialog = true
    },
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
                row[firstContentColumn  + 5 + i], // discount
                'vouchername', // voucherName
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

        this.benefitMatrixStore.uploadSpreadsheet(benefitMatrixDto)

      }
      reader.readAsBinaryString(chosenFile);
    }
  },
  apollo: {

  },
}
</script>