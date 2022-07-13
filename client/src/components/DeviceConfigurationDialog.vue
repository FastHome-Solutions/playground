<script setup lang="ts">
import { ref } from 'vue'
import { BenefitMatrixRowData } from './benefit-matrix.businessmodel';
import DeviceConfigurationForm  from '@/components/DeviceConfigurationForm.vue'

defineExpose({ showDialog })

const props = defineProps({
    deviceConfiguration: {
        type: BenefitMatrixRowData,
        required: true,
    },
})

const show = ref(false)

function showDialog(benefitMatrixRowData: BenefitMatrixRowData) {
    console.log(props.deviceConfiguration)
    //TODO
    console.assert(benefitMatrixRowData === props.deviceConfiguration, 'device configs not equal')
    show.value = true
}

const emit = defineEmits(['save',])

function save() {
    // const dto = rowData.value.toDeviceConfigurationDto()
    // emit('save', dto)

    show.value = false
}

function cancel() {
    show.value = false
}
</script>

<template>
    <div class=" text-center">
        <v-dialog v-model="show">
            <DeviceConfigurationForm :deviceConfiguration="deviceConfiguration" @save="save" @cancel="cancel"></DeviceConfigurationForm>
        </v-dialog>
    </div>
</template>
