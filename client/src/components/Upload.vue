<template>
  <div id="app">
    <v-app>
      <v-container fill-height>
        <v-row justify="center">
          <v-col cols="auto">
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
          </v-col>
          <v-col cols="auto">
            <v-card width="600" height="300" raised>
              <v-card-title>File contents:</v-card-title>
              <v-card-text>
                <p>{{ data }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>
<script lang="ts">
import { read, readFile, utils, writeXLSX } from "xlsx";

export default {
  data() {
    return {
      data: ''
    }
  },
  methods: {
    uploadFile(event) { /* currently not actually uploading, just parsing */
      var chosenFile = event.target.files[0];

      console.log('upload' + chosenFile)

      const reader = new FileReader();

      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = read(bstr, { type: 'binary' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]

        console.log(ws)
      }
      reader.readAsBinaryString(chosenFile);
    }
  }
}
</script>