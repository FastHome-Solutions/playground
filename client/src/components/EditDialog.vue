<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUploadStore } from '@/stores/upload.store'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import { SpreadsheetMetadata, parseSpreadsheet } from '@/utils/parsing.utils'
import { ref } from 'vue'
import router from '@/router'
import { TariffConfigurationDto, type DeviceConfigurationDto } from '@/dto/benefit-matrix.dto'

const uploadStore = useUploadStore()

const { uploadSpreadsheetToServer } = useBenefitMatrixStore()
const { benefitMatrix } = storeToRefs(useBenefitMatrixStore())

const dateFormat = 'DD.MM.YYYY HH:mm'

uploadStore.parseMetadata(uploadStore.fileName, uploadStore.spreadsheet)

var manufacturer = ref('')
var deviceName = ref('')
var upfront = ref(0)
var rate = ref(0)
var tco = ref(0)
var tariffConfigurations = ref([])

var show = ref(false)

function showDialog(deviceConfiguration: DeviceConfigurationDto) {
    manufacturer.value = deviceConfiguration.manufacturer
    deviceName.value = deviceConfiguration.deviceName
    upfront.value = deviceConfiguration.contractConfigurations[0].upfront
    rate.value = (deviceConfiguration.tco - deviceConfiguration.contractConfigurations[0].upfront) / deviceConfiguration.contractConfigurations[0].duration
    tco.value = deviceConfiguration.tco
    tariffConfigurations.value = deviceConfiguration.contractConfigurations[0].tariffConfigurations

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

function finishEditing() {
    show.value=false
}


</script>

<template>

    <div class=" text-center">
        <v-dialog v-model="show">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Edit Device Configuration</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Hersteller*" required v-model="manufacturer">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Gerät*" required v-model="deviceName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Anzahlung*" required v-model="upfront">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Rate*" required v-model="rate"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="TCO*" required v-model="tco"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="tariffConfiguration in tariffConfigurations" cols="12" sm="6" md="6"
                                :key="tariffConfiguration.name">
                                <v-text-field v-bind:label="tariffConfiguration.name + ` discount*`" required
                                    v-model="tariffConfiguration.discount" color="purple"></v-text-field>
                            </v-col>
                            <v-col v-for="tariffConfiguration in tariffConfigurations" cols="12" sm="6" md="6"
                                :key="tariffConfiguration.name">
                                <v-text-field v-bind:label="tariffConfiguration.name + ` bundle price*`" required
                                    v-model="tariffConfiguration.bundlePrice" color="blue"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" text @click="finishEditing">
                        Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
