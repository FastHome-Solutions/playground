<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import { useRoute } from 'vue-router'
import Sheet from '@/components/Sheet.vue'

const { benefitMatrix, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatrixFromServer } = useBenefitMatrixStore()

const route = useRoute()

const id = useRoute().params.id

fetchBenefitMatrixFromServer(id)

</script>

<template>
    <main>
        <div justify="center">
            <Sheet />
        </div>
    </main>
</template>
