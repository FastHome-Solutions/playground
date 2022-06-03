<template>
  <v-card width="600" height="300" raised>
    <v-card-title>Upload spreadsheet</v-card-title>
    <br>
    <v-card-text>
      <v-file-input accept="application/vnd.ms-excel, application/msexcel, application/x-msexcel, application/x-ms-excel, 
    application/x-excel, application/x-dos_ms_excel, application/xls, application/x-xls,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Click here to select a file to upload"
        outlined @change="uploadFile" show-size placeholder="Pick a file to upload">
      </v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn right @click="uploadFile">Upload</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { read, readFile, utils, writeXLSX } from "xlsx"
import BenefitMatrix, { Header, TariffDetails } from "./BenefitMatrix"

export default {
  data() {
    return {
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
          const filteredRow = row.filter(element => {
            return element !== null
          })
          const tariffDetails = new TariffDetails(
            i,
            filteredRow[0],
            filteredRow[1],
            filteredRow[2],
            filteredRow[3],
            filteredRow[4],
            filteredRow[5],
            filteredRow[6],
            filteredRow[7],
            filteredRow[8],
            filteredRow[9],
            filteredRow[10]
          )
          tariffData.push(tariffDetails)
        }

        const benefitMatrix = new BenefitMatrix(header, tariffData)
        this.$emit('uploaded-file', benefitMatrix)
      }
      reader.readAsBinaryString(chosenFile);
    }
  }
}
</script>