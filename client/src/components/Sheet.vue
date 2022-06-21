<script setup lang="ts">
import type { MetaOfferDto } from '@/dto/benefit-matrix.dto';
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'

const benefitMatrixStore = useBenefitMatrixStore()

function calculateRate(metaOffer: MetaOfferDto) {
    return (metaOffer.tco - metaOffer.offers[0].upfront) / metaOffer.offers[0].contractDuration
}
</script>
<script lang="ts">
</script>
<template>
    <v-card width="100%" height="100%" raised class="mt-4" v-if="benefitMatrixStore.benefitMatrix.tariffNames">
        <v-card-title>Benefit Matrix:</v-card-title>
        <v-card-text>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-center bg-grey">
                            Hersteller
                        </th>
                        <th class="text-center bg-grey">
                            Gerät
                        </th>
                        <th class="text-center bg-grey">
                            Anzahlung
                        </th>
                        <th class="text-center bg-grey">
                            Rate
                        </th>
                        <th class="text-center bg-grey">
                            TCO
                        </th>
                        <th v-for="discount in benefitMatrixStore.benefitMatrix.tariffNames" :key="discount"
                            class="text-center bg-purple-darken-2">
                            {{ discount }}
                        </th>
                        <th v-for="bundlePrice in benefitMatrixStore.benefitMatrix.tariffNames" :key="bundlePrice"
                            class="text-center bg-purple-darken-2">
                            {{ bundlePrice }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="metaOffer in benefitMatrixStore.benefitMatrix.metaOffers" :key="metaOffer.deviceName">
                        <td>{{ metaOffer.manufacturer }}</td>
                        <td>{{ metaOffer.deviceName }}</td>
                        <td>{{ metaOffer.offers[0].upfront }}</td>
                        <td>{{ calculateRate(metaOffer) }}</td>
                        <td>{{ metaOffer.tco }}</td>
                        <td v-for="offer in metaOffer.offers">
                            {{ offer.discount}}
                        </td>
                        <td v-for="offer in metaOffer.offers">
                            {{ offer.bundlePrice}}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>
