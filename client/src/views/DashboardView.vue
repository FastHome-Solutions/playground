<template>
  <v-container fill-height>
    <v-btn
    @on="navigate">

    </v-btn>
  </v-container>
</template>

<script lang="ts">
// Components
import Upload from '../components/Upload.vue'
import Sheet from '../components/Sheet.vue'
import type BenefitMatrix from '@/components/BenefitMatrix';

export default {

  name: 'DashboardView',
  methods: {
    navigate() {
      // this.$router. 
    }
  }
}

</script>
