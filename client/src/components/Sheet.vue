<template>
    <v-card width="100%" height="100%" raised v-if="benefitMatrix !== null" class="mt-4">
        <v-card-title>Benefit Matrix:</v-card-title>
        <v-card-text>

            <v-table>
                <thead>
                    <tr>
                        <th class="text-center bg-grey">
                            {{ benefitMatrix.header.manufacturer }}
                        </th>
                        <th class="text-center bg-grey">
                            {{ benefitMatrix.header.device }}
                        </th>
                        <th class="text-center bg-grey">
                            {{ benefitMatrix.header.parcialPayment }}
                        </th>
                        <th class="text-center bg-grey">
                            {{ benefitMatrix.header.rate }}
                        </th>
                        <th class="text-center bg-grey">
                            {{ benefitMatrix.header.tco }}
                        </th>
                        <th class="text-center bg-purple-darken-2">
                            {{ benefitMatrix.header.discountAllnetL }}
                        </th>
                        <th class="text-center bg-purple-darken-2">
                            {{ benefitMatrix.header.discountAllnetXL }}
                        </th>
                        <th class="text-center bg-purple-darken-2">
                            {{ benefitMatrix.header.discountAllnetPlus }}
                        </th>
                        <th class="text-center bg-light-blue">
                            {{ benefitMatrix.header.offerAllnetL }}
                        </th>
                        <th class="text-center bg-light-blue">
                            {{ benefitMatrix.header.offerAllnetXL }}
                        </th>
                        <th class="text-center bg-light-blue">
                            {{ benefitMatrix.header.offerAllnetPlus }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tariff in benefitMatrix.tariffDetails" :key="tariff.id">
                        <td>{{ tariff.manufacturer }}</td>
                        <td>{{ tariff.device }}</td>
                        <td>{{ tariff.parcialPayment }}</td>
                        <td>{{ tariff.rate }}</td>
                        <td>{{ tariff.tco }}</td>
                        <td>{{ tariff.discountAllnetL }}</td>
                        <td>{{ tariff.discountAllnetXL }}</td>
                        <td>{{ tariff.discountAllnetPlus }}</td>
                        <td>{{ tariff.offerAllnetL }}</td>
                        <td>{{ tariff.offerAllnetXL }}</td>
                        <td>{{ tariff.offerAllnetXL }}</td>
                    </tr>
                </tbody>
            </v-table>
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