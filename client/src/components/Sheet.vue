<template>
    <v-card width="600" height="300" raised>
        <v-card-title>File contents:</v-card-title>
        <v-card-text>

            <v-table v-if="benefitMatrix !== null">
                <thead>
                    <tr>
                        <th class="text-left">
                            {{ benefitMatrix.header.manufacturer }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.device }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.rate }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.tco }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.discountAllnetL }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.discountAllnetXL }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.discountAllnetPlus }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.offerAllnetL }}
                        </th>
                        <th class="text-left">
                            {{ benefitMatrix.header.offerAllnetXL }}
                        </th>
                        <th class="text-left">
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