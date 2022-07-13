<script setup lang="ts">
import { cloneDeep } from '@apollo/client/utilities';
import { ref, watch } from 'vue'
import { BenefitMatrixRowData } from './benefit-matrix.businessmodel';

const props = defineProps({
    deviceConfiguration: {
        type: BenefitMatrixRowData,
        required: true,
    },
})
const clonedDeviceConfiguration = ref(cloneDeep(props.deviceConfiguration))

const emit = defineEmits(['save', 'cancel'])

function save() {
    emit('save', clonedDeviceConfiguration.value)
}

function cancel() {
    emit('cancel')
}

function onUpfrontChange(event) {
    props.deviceConfiguration.rate = (props.deviceConfiguration.tco - props.deviceConfiguration.upfront) / props.deviceConfiguration.contractDuration
}
</script>

<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">Edit Device Configuration</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Hersteller*" required v-model="clonedDeviceConfiguration.manufacturer">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Gerät*" required v-model="clonedDeviceConfiguration.deviceName">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Anzahlung*" required v-model="clonedDeviceConfiguration.upfront"
                            type="number" @change="onUpfrontChange">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Rate*" required v-model="clonedDeviceConfiguration.rate" type="number">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field label="TCO*" required v-model="clonedDeviceConfiguration.tco" type="number">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-for="(discount, index) in clonedDeviceConfiguration.discounts" cols="12" sm="6" md="6"
                        :key="index">
                        <v-text-field v-bind:label="discount.tariffName + ` discount*`" required
                            v-model="discount.discount" color="purple" type="number"></v-text-field>
                    </v-col>
                    <v-col v-for="(bundlePrice, index) in clonedDeviceConfiguration.bundlePrices" cols="12" sm="6"
                        md="6" :key="index">
                        <v-text-field v-bind:label="bundlePrice.tariffName + ` bundle price*`" required
                            v-model="bundlePrice.bundlePrice" color="blue" type="number">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-container>
            <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color=" blue-darken-1" text @click="cancel">
                Abbrechen
            </v-btn>
            <v-btn color=" blue-darken-1" text @click="save">
                Speichern
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
