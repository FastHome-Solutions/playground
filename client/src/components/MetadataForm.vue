BenefitMatrixMetadata<script setup lang="ts">
import moment from 'moment'
import { BenefitMatrixMetadata, parseSpreadsheet, parseMetadataSuggestions } from '@/utils/parsing.utils'
import { ref } from 'vue'

const props = defineProps({
    metadata: {
        type: BenefitMatrixMetadata,
        required: false,
    },
})

const emit = defineEmits(['confirm'])

const dateFormat = 'DD.MM.YYYY HH:mm'

const from = ref(moment(props.metadata?.from).format(dateFormat))
const till = ref(moment(props.metadata?.till).format(dateFormat))
const rangeStart = ref(props.metadata?.rangeStart)
const rangeEnd = ref(props.metadata?.rangeEnd)
const portfolio = ref('Online')

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

async function confirm() {
    const metadata = new BenefitMatrixMetadata(moment(from.value, dateFormat).toDate(), moment(till.value, dateFormat).toDate(), rangeStart.value, rangeEnd.value, portfolio.value)
    emit('confirm', metadata)
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
                <v-btn color="blue-darken-1" text @click="confirm">
                    Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>