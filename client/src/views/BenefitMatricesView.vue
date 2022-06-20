<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'

const { benefitMatrices, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatricesFromServer } = useBenefitMatrixStore()

fetchBenefitMatricesFromServer()
</script>

<template>
  <main>
    <p v-if="loading">Loading posts...</p>
    <p v-if="error">{{ error.message }}</p>
    <ul v-if="benefitMatrices">
      <li v-for="benefitMatrix of benefitMatrices" :key="benefitMatrix._id">
        <router-link :to="{ name: 'benefit-matrix', params: { id: benefitMatrix._id } }">
          {{ benefitMatrix.brand }} {{ benefitMatrix.portfolio }} {{ benefitMatrix.period }}
        </router-link>
      </li>
    </ul>
  </main>
</template>
