<template>
  <v-container fill-height>
    <div justify="center">
      <upload @uploaded-file="uploadedFile" />
    </div>
    <div justify="center">
      <sheet :benefitMatrix="benefitMatrix" />
    </div>
  </v-container>
</template>

<script lang="ts">
// Components
import Upload from '../components/Upload.vue'
import type BenefitMatrix from '@/components/BenefitMatrix';

export default {

  name: 'UploadView',
  components: {
    Upload,
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
