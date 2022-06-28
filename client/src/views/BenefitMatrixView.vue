<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"
import { useRoute } from 'vue-router'
import { ref } from 'vue'


const benefitMatrixStore = useBenefitMatrixStore()
const { benefitMatrix } = storeToRefs(benefitMatrixStore)

const { fetchBenefitMatrixFromServer } = useBenefitMatrixStore()

const route = useRoute()
const id = useRoute().params.id
const columnDefs = ref(null)
fetchBenefitMatrixFromServer(id)
    .then(() => {
        columnDefs.value = [
            {
                headerName: '',
                headerClass: 'text-center',
                pinned: 'left',
                colId: 'rowNo',
                cellClass: 'text-center',
                cellRenderer: (params) => params.node.childIndex + 1,
                editable: false,
                maxWidth: 40,
                suppressSorting: true,
            },
            {
                headerName: 'Hersteller',
                headerClass: 'text-left',
                field: 'manufacturer',
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
            },
            {
                headerName: 'Gerät',
                headerClass: 'text-left',
                field: 'deviceName',
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
            },
            {
                headerName: 'Anzahlung',
                headerClass: 'text-left',
                field: 'offers',
                valueGetter: params => {
                    return params.data.offers[0].upfront
                },
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
            },
            {
                headerName: 'Rate',
                headerClass: 'text-left',
                field: 'offers',
                valueGetter: params => {
                    const metaOffer = params.data
                    return (metaOffer.tco - metaOffer.offers[0].upfront) / metaOffer.offers[0].contractDuration
                },
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
            },
            {
                headerName: 'TCO',
                headerClass: 'text-left',
                field: 'tco',
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
            },
        ]
        benefitMatrixStore.benefitMatrix.tariffNames.forEach((tariffName, i) => {
            columnDefs.value.push({
                headerName: tariffName,
                headerClass: 'text-left bg-purple-darken-2',
                field: 'offers',
                valueGetter: params => {
                    return params.data.offers[i].discount
                },
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned'
            })
        })
        benefitMatrixStore.benefitMatrix.tariffNames.forEach((tariffName, i) => {
            columnDefs.value.push({
                headerName: tariffName,
                headerClass: 'text-left bg-light-blue',
                field: 'offers',
                valueGetter: params => {
                    return params.data.offers[i].bundlePrice
                },
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned'
            })
        })
    })
</script>

<template>
    <main>
        <div justify="center">
            <v-card width="100%" height="100%" raised class="mt-4" v-if="benefitMatrix">
                <div class="text-h5">Benefit Matrix</div>
                <div class="text-h6">{{ `${benefitMatrix.brand} ${benefitMatrix.portfolio}` }}</div>
                <div class="text-h6" v-if="benefitMatrix.period">{{ `${moment(benefitMatrix.period.from).format("D MMM")} -
                                    ${ moment(benefitMatrix.period.to).format("D MMM YYYY")}`
                }}</div>
                <v-card-text>
                    <ag-grid-vue v-if="benefitMatrix.metaOffers" style="width: 100%; height: 400px"
                        class="ag-theme-material" :columnDefs="columnDefs" :rowData="benefitMatrix.metaOffers"
                        :animateRows="true" :debug="true" :defaultColDef="defaultColDef" suppressMovableColumns
                        @cell-clicked="cellClicked" :rowHeight="40" :sortingOrder="['desc', 'asc', null]"
                        :overlayLoadingTemplate="overlayLoadingTemplate" :overlayNoRowsTemplate="overlayNoRowsTemplate">
                    </ag-grid-vue>
                </v-card-text>
            </v-card>
        </div>
    </main>
</template>
