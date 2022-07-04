<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import { ref } from 'vue'
import { type DeviceConfigurationDto } from '@/dto/benefit-matrix.dto'

const { uploadSpreadsheetToServer } = useBenefitMatrixStore()

class TariffData {
    name: String
    disc: number
    bundle: number
    rate: number
    simPrice: number
    constructor(name: String, discount: number, bundlePrice: number, rate: number, simPrice: number) {
        this.name = name
        this.disc = discount
        this.bundle = bundlePrice
        this.rate = rate
        this.simPrice = simPrice
    }

    set discount(discount:number) {
        this.disc = discount
        this.bundle = this.rate + this.simPrice - this.discount
    }

    get discount() {
        return this.disc
    }

    set bundlePrice(bundlePrice: number) {
        this.bundle = bundlePrice
        this.discount = (this.bundle - this.rate - this.simPrice) * -1
    }

    get bundlePrice() {
        return this.bundle
    }
}

let manufacturer = ref('')
let deviceName = ref('')
let upfront = ref(0)
let rate = ref(0)
let tco = ref(0)
let tariffData = ref(new Array<TariffData>())

let show = ref(false)

let contractDuration = 0

function showDialog(deviceConfiguration: DeviceConfigurationDto) {
    manufacturer.value = deviceConfiguration.manufacturer
    deviceName.value = deviceConfiguration.deviceName
    upfront.value = deviceConfiguration.contractConfigurations[0].upfront
    tco.value = deviceConfiguration.tco
    contractDuration = deviceConfiguration.contractConfigurations[0].duration
    setRate()
    
    // Calculate sim prices. Used for changing discounts / bundle prices
    deviceConfiguration.contractConfigurations[0].tariffConfigurations.forEach(
        (tariffConfiguration): void => {
            tariffData.value.push(new TariffData(
                tariffConfiguration.name,
                tariffConfiguration.discount,
                tariffConfiguration.bundlePrice,
                rate.value,
                tariffConfiguration.bundlePrice - rate.value + tariffConfiguration.discount
            ))
        }
    )

    show.value = true
}
defineExpose({ showDialog })

function setRate() {
    rate.value = (tco.value - upfront.value) / contractDuration
}

function finishEditing() {
    tariffData.value = new Array<TariffData>()
    show.value = false
    //emit stuff to parent
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
                                <v-text-field label="Anzahlung*" required v-model="upfront" @change="setRate">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Rate*" required v-model="rate"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="TCO*" required v-model="tco" @change="setRate"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="tariff in tariffData" cols="12" sm="6" md="6" :key="tariff.name">
                                <v-text-field v-bind:label="tariff.name + ` discount*`" required
                                    v-model="tariff.discount" color="purple"></v-text-field>
                            </v-col>
                            <v-col v-for="tariff in tariffData" cols="12" sm="6" md="6" :key="tariff.name">
                                <v-text-field v-bind:label="tariff.name + ` bundle price*`" required
                                    v-model="tariff.bundlePrice" color="blue">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color=" blue-darken-1" text @click="finishEditing">
                        Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
