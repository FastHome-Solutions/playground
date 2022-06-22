<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { MetaOfferDto } from '@/dto/benefit-matrix.dto'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'

const benefitMatrixStore = useBenefitMatrixStore()
const { benefitMatrix } = storeToRefs(benefitMatrixStore)

function calculateRate(metaOffer: MetaOfferDto) {
    return (metaOffer.tco - metaOffer.offers[0].upfront) / metaOffer.offers[0].contractDuration
}
</script>


<template>
    <v-card width="100%" height="100%" raised class="mt-4" v-if="benefitMatrix">
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
                        <th v-for="tariffName in benefitMatrix.tariffNames" :key="tariffName"
                            class="text-center bg-purple-darken-2">
                            {{ tariffName }}
                        </th>
                        <th v-for="tariffName in benefitMatrix.tariffNames" :key="tariffName"
                            class="text-center bg-light-blue">
                            {{ tariffName }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="metaOffer in benefitMatrix.metaOffers" :key="metaOffer.deviceName">
                        <td>{{ metaOffer.manufacturer }}</td>
                        <td>{{ metaOffer.deviceName }}</td>
                        <td>{{ metaOffer.offers[0].upfront }}</td>
                        <td>{{ calculateRate(metaOffer) }}</td>
                        <td>{{ metaOffer.tco }}</td>
                        <td v-for="offer in metaOffer.offers">
                            {{ offer.discount }}
                        </td>
                        <td v-for="offer in metaOffer.offers">
                            {{ offer.bundlePrice }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>
