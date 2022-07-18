BenefitMatrixMetadata<script setup lang="ts">
import moment from 'moment'
import { BenefitMatrixMetadata } from '@/utils/parsing.utils'
import { ref } from 'vue'

const props = defineProps({
    addTariffsEnabled: {
        type: Boolean,
        required: true
    },
    metadata: {
        type: BenefitMatrixMetadata,
        required: true,
    },
})

const emit = defineEmits(['confirm'])

const dateFormat = 'DD.MM.YYYY HH:mm'

const from = ref(moment(props.metadata?.from).format(dateFormat))
const till = ref(moment(props.metadata?.till).format(dateFormat))
const brand = ref(props.metadata?.brand)
const portfolio = ref(props.metadata?.portfolio)
const rangeStart = ref('')
const rangeEnd = ref('')
const spreadsheetMetadataRequired = props.metadata.rangeStart !== undefined && props.metadata.rangeEnd !== undefined
if (spreadsheetMetadataRequired) {
    rangeStart.value = props.metadata?.rangeStart
    rangeEnd.value = props.metadata?.rangeEnd
} 

const portfolioItems = ['Online', 'Offline']
const brandItems = ['Blau', 'O2']

const rules = {
    notEmpty: value => !!value || 'Required.',
    notZero: value => value !== 0 || 'Cannot be zero',
    positive: value => value > 0 || 'Must be positive',
    validDate: value => (moment(value, dateFormat, true).isValid()) || 'Please enter a date in the format ' + dateFormat,
    validDateRange: value => (moment(from.value, dateFormat, true).isBefore(moment(till.value, dateFormat, true)) || 'From date must be before till date'),
    validExcelCellFormat: value => (v && /^[A-Z0-9]+$/i.test(v)) || 'Input must be in Excel format (e.g "D9")',
}

const tariffNames = ref([] as {}[]) 
async function confirm() {
    const tariffs = tariffNames.value.map(tariffNameWrapper => tariffNameWrapper.tariffName)
    const metadata = new BenefitMatrixMetadata(moment(from.value, dateFormat).toDate(), moment(till.value, dateFormat).toDate(), brand.value, portfolio.value, tariffs, rangeStart.value, rangeEnd.value)
    emit('confirm', metadata)
}

function addNewTariff() {
    tariffNames.value.push({ tariffName: '' }) // Plane values can't be used as models by vue
}

</script>

<template>

    <div class=" text-center">
        <v-card>
            <v-card-title>
                <span class="text-h5">Upload Metadata</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="From*" required v-model="from"
                                :rules="[rules.notEmpty, rules.validDate, rules.validDateRange]"
                                :onchange="onFromChange"
                                >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="To*" required v-model="till" :rules="dateRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select :items="portfolioItems" label="Portfolios*" required v-model="portfolio"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select :items="brandItems" label="Brand*" required persistent-hint v-model="brand">
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" v-if="rangeStart">
                            <v-text-field label="Range start*" required v-model="rangeStart" :rules="rangeRules">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" v-if="rangeEnd">
                            <v-text-field label="Range end*" required v-model="rangeEnd" :rules="rangeRules">
                            </v-text-field>
                        </v-col>
                        <v-col v-for="(tariffName, index) in tariffNames" :key="index" cols="12" sm="6" md="6">
                            <v-text-field v-bind:label="'Tariff name*'" required v-model="tariffName.tariffName"
                                type="text">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="addTariffsEnabled">
                        <v-col>
                            <v-btn @click="addNewTariff">Add new tariff</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" text @click="confirm">
                    Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>