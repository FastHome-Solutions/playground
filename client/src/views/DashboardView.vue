<script setup lang="ts">
import router from '@/router'

function list() {
      router.push({name: 'benefit-matrices'})
    }

</script>

<template>
  <v-container fill-height>
    <v-btn
    @click="list">
      List
    </v-btn>
  </v-container>
</template>


