<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <upload @uploaded-file="uploadedFile" />
      </v-col>
      <v-col cols="auto">
        <sheet :benefitMatrix="benefitMatrix" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// Components
import Upload from '../components/Upload.vue'
import Sheet from '../components/Sheet.vue'
import type BenefitMatrix from '@/components/BenefitMatrix';

export default {

  name: 'UploadView',
  components: {
    Upload, Sheet,
  },
  data() {
    return {
      benefitMatrix: null
    }
  },
  methods: {
    uploadedFile(benefitMatrix: BenefitMatrix) {
      this.benefitMatrix = benefitMatrix
    }
  }
}

</script>
