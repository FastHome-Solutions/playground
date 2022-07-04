<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import router from '@/router'
import DeviceConfigurationDialog from '@/components/DeviceConfigurationDialog.vue'
import type { DeviceConfigurationDto } from '@/dto/benefit-matrix.dto'


const benefitMatrixStore = useBenefitMatrixStore()
const { benefitMatrix } = storeToRefs(benefitMatrixStore)
const { previousBenefitMatrix } = storeToRefs(benefitMatrixStore)
const { nextBenefitMatrix } = storeToRefs(benefitMatrixStore)

const { fetchBenefitMatrixFromServer } = useBenefitMatrixStore()
const { updateBenefitMatrixOnServer } = useBenefitMatrixStore()


const route = useRoute()

watch(
    () => route.params.id,
    (newId, oldId) => {
        if(newId) {
            updateData(newId)
        }
    }
)

const id = route.params.id
const columnDefs = ref(null)
const nextDate = ref('')

function updateData(id: String) {
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
                        return params.data.contractConfigurations[0].upfront
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
                        const deviceConfiguration = params.data
                        return (deviceConfiguration.tco - deviceConfiguration.contractConfigurations[0].upfront) / deviceConfiguration.contractConfigurations[0].duration
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
                        return params.data.contractConfigurations[0].tariffConfigurations[i].discount
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
                        return params.data.contractConfigurations[0].tariffConfigurations[i].bundlePrice
                    },
                    cellClass: 'text-left',
                    width: 180,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned'
                })
            })
            columnDefs.value.push({
                headerName: 'Edit',
                headerClass: 'text-left',
                field: 'edit',
                cellClass: 'text-left',
                width: 180,
                minWidth: 130,
                maxWidth: 250,
                type: 'rightAligned',
                cellRenderer: editCellRenderer,
                sortable: false,
                    filter: false
            })

            function editCellRenderer(params) {
                let eGui = document.createElement('div');
                eGui.innerHTML = `<button data-action="edit" >Edit</button>`
                return eGui;
            }
        })
}

updateData(id)

const dialog = ref(null)
function cellClicked(event) {
    if (
        event.column.colId === 'edit' &&
        event.event.target.dataset.action
    ) {
        let action = event.event.target.dataset.action
        if (action === 'edit') {
            console.log('edit')
            dialog.value.showDialog(event.data)
        }
    }
}

function openPrevious() {
    router.push({ path: '/benefit-matrix/' + previousBenefitMatrix.value._id })
}

function openNext() {
    router.push({ name: 'benefit-matrix', params: { id: nextBenefitMatrix.value._id } })
}

function update(deviceConfiguration: DeviceConfigurationDto) {

    console.log(`device config on event ${deviceConfiguration}`)
    // updateBenefitMatrixOnServer(route.params.id, benefitMatrix)
}

</script>

<template>
    <main>
        <div justify="center">
            <v-card width="100%" height="100%" raised class="mt-4" v-if="benefitMatrix">
                <div class="text-h5">Benefit Matrix</div>
                <div class="text-h6">{{ `${benefitMatrix.brand} ${benefitMatrix.portfolio}` }}</div>
                <div class="text-h6" v-if="benefitMatrix.period">
                    {{ `${moment(benefitMatrix.period.from).format("D MMM")} - ${
                    moment(benefitMatrix.period.till).format("D MMM YYYY")}`}}
                </div>
                <v-card-text>
                    <ag-grid-vue v-if="benefitMatrix.deviceConfigurations" style="width: 100%; height: 400px"
                        class="ag-theme-material" :columnDefs="columnDefs" :rowData="benefitMatrix.deviceConfigurations"
                        :animateRows="true" :debug="true" :defaultColDef="defaultColDef" suppressMovableColumns
                        @cell-clicked="cellClicked" :rowHeight="40" :sortingOrder="['desc', 'asc', null]">
                    </ag-grid-vue>
                </v-card-text>
            </v-card>
        </div>

        <DeviceConfigurationDialog ref="dialog" @save="update" />

        <v-btn class="text-h6" v-if="previousBenefitMatrix && previousBenefitMatrix.period" @click="openPrevious">{{ `<-
        ${moment(previousBenefitMatrix.period.from).format("D MMM")} - ${
        moment(previousBenefitMatrix.period.till).format("D MMM YYYY")}`}}</v-btn>
                <v-btn class="text-h6" v-if="benefitMatrix && benefitMatrix.period" disabled>
                    {{ ` ${moment(benefitMatrix.period.from).format("D MMM")} -
                    ${moment(benefitMatrix.period.till).format("D MMM YYYY")}`}}</v-btn>
                <v-btn class="text-h6" v-if="nextBenefitMatrix && nextBenefitMatrix.period" @click="openNext">{{
                `${moment(nextBenefitMatrix.period.from).format("D MMM")} -
                ${moment(nextBenefitMatrix.period.till).format("D MMM YYYY")} ->`}}</v-btn>

    </main>
</template>
