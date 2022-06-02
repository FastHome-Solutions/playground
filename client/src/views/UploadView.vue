<template>
  <upload />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import Upload from '../components/Upload.vue';

export default defineComponent({
  name: 'UploadView',

  components: {
    Upload,
  },
});
</script>
