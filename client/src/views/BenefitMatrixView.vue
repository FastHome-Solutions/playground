<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import {useRoute} from 'vue-router'

const { benefitMatrix, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatrixFromServer } = useBenefitMatrixStore()

const route = useRoute()

const id = useRoute().params.id

fetchBenefitMatrixFromServer(id)

</script>

<template>
    <main>
        <p>Requested with ID {{ $route.params.id }}</p>
        <p v-if="loading">Loading posts...</p>
        <p v-if="error">{{ error.message }}</p>
        <p v-if="benefitMatrix">
            From {{benefitMatrix.period.from}} to {{benefitMatrix.period.to}}
        </p>
    </main>
</template>
