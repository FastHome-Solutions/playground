
import { defineStore } from "pinia"
import { uploadFile, SpreadsheetMetadata, parseMetadataSuggestions } from '@/utils/parsing.utils'

export const useUploadStore = defineStore('UploadStore', {
    state: () => ({
        metadataDialog: false,
        spreadsheet: [[]],
        fileName: String,
        metadataSuggestions: SpreadsheetMetadata,
        metadata: SpreadsheetMetadata,
        loading: false,
        error: null,
    }),
    actions: {
        showMetadataDialog() {
            this.metadataDialog = true
        },
        hideMetadataDialog() {
            this.metadataDialog = false
        },
        uploadSpreadsheet(chosenFile: Blob): Promise {
            this.loading = true;

            return uploadFile(chosenFile)
            .then((result) => {
                console.log('Selected file parsed to JSON')
                this.spreadsheet = result
                this.fileName = chosenFile.name
                this.loading = false
            })
            .catch((error) => {
                console.error(error)
                this.error = error
                this.loading = false
            })
        },
        parseMetadata(filename: String, spreadsheet: [][]){
            this.metadataSuggestions = parseMetadataSuggestions(filename, spreadsheet)
        },
    },
});
 


