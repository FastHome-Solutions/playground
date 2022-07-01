<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUploadStore } from '@/stores/upload.store'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import { SpreadsheetMetadata, parseSpreadsheet } from '@/utils/parsing.utils'
import { ref } from 'vue'
import router from '@/router'

const uploadStore = useUploadStore()

const { uploadSpreadsheetToServer } = useBenefitMatrixStore()
const { benefitMatrix } = storeToRefs(useBenefitMatrixStore())

const dateFormat = 'DD.MM.YYYY HH:mm'

uploadStore.parseMetadata(uploadStore.fileName, uploadStore.spreadsheet)

var from = ref('')
var till = ref('')
var rangeStart = ref('')
var rangeEnd = ref('')
var portfolio = ref('Online')

var show = ref(false)
function showDialog() {
    from.value = moment(uploadStore.metadataSuggestions.from).format(dateFormat)
    till.value = moment(uploadStore.metadataSuggestions.to).format(dateFormat)
    rangeStart.value = uploadStore.metadataSuggestions.rangeStart
    rangeEnd.value = uploadStore.metadataSuggestions.rangeEnd
    show.value = true
}
defineExpose({showDialog})


const portfolioItems = ['Online', 'Offline']


const dateRules = [
    v => (v && moment(v, dateFormat, true).isValid()) || 'Please enter a date in the format ' + dateFormat,
]

const rangeRules = [
    v => (v && /^[A-Z0-9]+$/i.test(v)) || 'Input must be in Excel format (e.g "D9")',
]

const portfolioRules = [
    v => (v) || 'Please select a portfolio.'
]

async function parseSpreadsheetWithInput() {
    const metadata = new SpreadsheetMetadata(moment(from.value, dateFormat).toDate(), moment(till.value, dateFormat).toDate(), rangeStart.value, rangeEnd.value, portfolio.value)
    const parsedBenefitMatrix = parseSpreadsheet(metadata, uploadStore.spreadsheet)
    await uploadSpreadsheetToServer(parsedBenefitMatrix)
    router.push({ name: 'benefit-matrix', params: { id: benefitMatrix.value._id } })
}


</script>

<template>

    <div class=" text-center">
        <v-dialog v-model="show">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Upload Metadata</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="From*" required v-model="from" :rules="dateRules">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="To*" required v-model="till" :rules="dateRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Range start*" required v-model="rangeStart" :rules="rangeRules">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Range end*" required v-model="rangeEnd" :rules="rangeRules">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select :items="portfolioItems" label="Portfolios*" required multiple
                                    hint="Multiple selections possible" persistent-hint v-model="portfolio"></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" text @click="parseSpreadsheetWithInput">
                        Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>