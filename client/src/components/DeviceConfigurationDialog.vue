<script setup lang="ts">
import type { DeviceConfigurationDto } from '@/dto/benefit-matrix.dto'
import { RowData } from '@/components/device-configuration.businessmodels'
import { ref } from 'vue'

let rowData = ref(RowData)

let show = ref(false)

function showDialog(deviceConfiguration: DeviceConfigurationDto) {
    rowData.value = new RowData(deviceConfiguration)

    show.value = true
}
defineExpose({ showDialog })

const emit = defineEmits(['save',])

function save() {
    const dto = rowData.value.toDeviceConfigurationDto()
    emit('save', dto)

    show.value = false
}

function cancel() {
    show.value = false
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
                                <v-text-field label="Hersteller*" required v-model="rowData.manufacturer">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Gerät*" required v-model="rowData.deviceName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Anzahlung*" required v-model="rowData.upfront" type="number">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Rate*" required v-model="rowData.rate" type="number">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="TCO*" required v-model="rowData.tco" type="number"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="tariff in rowData.tariffs" cols="12" sm="6" md="6" :key="tariff.name">
                                <v-text-field v-bind:label="tariff.name + ` discount*`" required
                                    v-model="tariff.discount" color="purple" type="number"></v-text-field>
                            </v-col>
                            <v-col v-for="tariff in rowData.tariffs" cols="12" sm="6" md="6" :key="tariff.name">
                                <v-text-field v-bind:label="tariff.name + ` bundle price*`" required
                                    v-model="tariff.bundlePrice" color="blue" type="number">
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
        </v-dialog>
    </div>
</template>
