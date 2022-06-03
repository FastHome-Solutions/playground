<template>
    <v-card width="600" height="300" raised>
        <v-card-title>File contents:</v-card-title>
        <v-card-text>
            <p>{{ benefitMatrix }}</p>
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import BenefitMatrix from './BenefitMatrix';

export default {
    props: {
        benefitMatrix: {
            type: BenefitMatrix,
            required: false
        }
    }
}
</script>