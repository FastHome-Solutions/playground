<script setup lang="ts">

import { ref } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['confirm', 'cancel'])

defineExpose({ showDialog })

var show = ref(false)

function showDialog() {
    show.value = true
}

function confirm() {
    emit('confirm')
    show.value = false
}

function cancel() {
    emit('cancel')
    show.value = false
}

</script>

<template>
    <v-dialog v-model="show">
        <div class=" text-center">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p>{{text}}</p>
                </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" text @click="cancel">
                            Cancel
                        </v-btn>
                        <v-btn color="blue-darken-1" text @click="confirm">
                            Confirm
                        </v-btn>
                    </v-card-actions>
            </v-card>
        </div>
    </v-dialog>
</template>