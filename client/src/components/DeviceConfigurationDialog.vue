<script setup lang="ts">
import { ref } from 'vue'
import { BenefitMatrixRowData } from './benefit-matrix.businessmodel';
import DeviceConfigurationForm  from '@/components/DeviceConfigurationForm.vue'

defineExpose({ showDialog })

const props = defineProps({
    add: {
        type: Boolean,
        required: true,
    },
    deviceConfiguration: {
        type: BenefitMatrixRowData,
        required: true,
    },
})

const show = ref(false)

function showDialog() {
    show.value = true
}

const emit = defineEmits(['save',])

function save(add: Boolean, updatedDeviceConfiguration: BenefitMatrixRowData) {
    emit('save', add, updatedDeviceConfiguration)
    show.value = false
}

function cancel() {
    show.value = false
}
</script>

<template>
    <div class=" text-center">
        <v-dialog v-model="show">
            <DeviceConfigurationForm :add="add" :deviceConfiguration="deviceConfiguration" @save="save" @cancel="cancel"></DeviceConfigurationForm>
        </v-dialog>
    </div>
</template>
