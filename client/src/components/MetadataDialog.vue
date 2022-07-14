<script setup lang="ts">

import MetadataForm from './MetadataForm.vue';
import { ref } from 'vue'
import { BenefitMatrixMetadata } from '@/utils/parsing.utils';

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

defineExpose({ showDialog })

var show = ref(false)

function showDialog() {
    show.value = true
}

function confirm(metadata: BenefitMatrixMetadata) {
    emit('confirm', metadata)
}

</script>

<template>
    <v-dialog v-model="show">
        <MetadataForm :addTariffsEnabled="addTariffsEnabled" :metadata="metadata" @confirm="confirm"></MetadataForm>
    </v-dialog>
</template>