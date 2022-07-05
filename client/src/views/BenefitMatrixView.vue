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
import { BenefitMatrixDto, ContractConfigurationDto, DeviceConfigurationDto, Period, TariffConfigurationDto, } from '@/dto/benefit-matrix.dto'
import { BenefitMatrixBundlePrice, BenefitMatrixDiscount, BenefitMatrixRowData, benefitMatrixToRowData } from '@/components/benefit-matrix.businessmodel'


const benefitMatrixStore = useBenefitMatrixStore()
const { benefitMatrix, loading, error } = storeToRefs(benefitMatrixStore)
const { previousBenefitMatrix } = storeToRefs(benefitMatrixStore)
const { nextBenefitMatrix } = storeToRefs(benefitMatrixStore)

const { fetchBenefitMatrixFromServer } = useBenefitMatrixStore()
const { updateBenefitMatrixOnServer } = useBenefitMatrixStore()


const route = useRoute()

watch(
    () => route.params.id,
    (newId, oldId) => {
        if (newId) {
            updateData(newId)
        }
    }
)

const grid = ref(null)
const columnDefs = ref(null)
const rowData = ref(null)

function updateData(id: String) {
    fetchBenefitMatrixFromServer(id)
        .then(() => {
            const rows = benefitMatrixToRowData(benefitMatrix.value)
            rowData.value = rows

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
                    headerName: 'Vertragslaufzeit',
                    headerClass: 'text-left',
                    field: 'contractDuration',
                    cellClass: 'text-left',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned',
                },
                {
                    headerName: 'Anzahlung',
                    headerClass: 'text-left',
                    field: 'upfront',
                    cellClass: 'text-left',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned',
                },
                {
                    headerName: 'Rate',
                    headerClass: 'text-left',
                    field: 'rate',
                    cellClass: 'text-left',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned',
                },
                {
                    headerName: 'TCO',
                    headerClass: 'text-left',
                    field: 'tco',
                    cellClass: 'text-left',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned',
                },
            ]
            benefitMatrix.value.tariffNames.forEach((tariffName: string, i: number) => {
                columnDefs.value.push({
                    headerName: tariffName,
                    headerClass: 'text-left bg-purple-darken-2',
                    field: 'discounts',
                    valueGetter: params => {
                        return params.data.discounts[i].discount
                    },
                    cellClass: 'text-left',
                    width: 130,
                    minWidth: 130,
                    maxWidth: 250,
                    type: 'rightAligned'
                })
            })
            benefitMatrix.value.tariffNames.forEach((tariffName: string, i: number) => {
                columnDefs.value.push({
                    headerName: tariffName,
                    headerClass: 'text-left bg-light-blue',
                    field: 'bundlePrices',
                    valueGetter: params => {
                        return params.data.bundlePrices[i].bundlePrice
                    },
                    cellClass: 'text-left',
                    width: 130,
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

const defaultColDef = {
    editable: false,
    sortable: true,
    filter: true,
    resizable: true,
    maxWidth: 320,
    minWidth: 50,
    rowSelection: 'single',
    colResizeDefault: 'shift',
}

updateData(route.params.id)

const dialog = ref(DeviceConfigurationDialog)
let outdatedDeviceConfiguration: DeviceConfigurationDto
function cellClicked(event) {
    if (
        event.column.colId === 'edit' &&
        event.event.target.dataset.action
    ) {
        let action = event.event.target.dataset.action
        if (action === 'edit') {
            console.log('edit')
            outdatedDeviceConfiguration = event.data
            dialog.value.showDialog(outdatedDeviceConfiguration)
        }
    }
}

function openPrevious() {
    router.push({ path: '/benefit-matrix/' + previousBenefitMatrix.value._id })
}

function openNext() {
    router.push({ name: 'benefit-matrix', params: { id: nextBenefitMatrix.value._id } })
}

function update(updatedDeviceConfiguration: DeviceConfigurationDto) {

    // TODO: Is there a nicer way to do this?
    const clonedPeriod = new Period(
        benefitMatrix.value.period.from,
        benefitMatrix.value.period.till,
    )
    const clonedDeviceConfigurations: DeviceConfigurationDto[] = []

    benefitMatrix.value.deviceConfigurations.forEach(
        deviceConfiguration => {
            if (deviceConfiguration.manufacturer == outdatedDeviceConfiguration.manufacturer && deviceConfiguration.deviceName == outdatedDeviceConfiguration.deviceName) {
                clonedDeviceConfigurations.push(updatedDeviceConfiguration)
                console.log(`changing ${JSON.stringify(outdatedDeviceConfiguration)} to ${JSON.stringify(updatedDeviceConfiguration)}`)
            } else {
                const clonedContractConfigurations: ContractConfigurationDto[] = []

                deviceConfiguration.contractConfigurations.forEach(
                    contractConfiguration => {

                        const clonedTariffConfigurations: TariffConfigurationDto[] = []

                        contractConfiguration.tariffConfigurations.forEach(
                            tariffConfiguration => {
                                clonedTariffConfigurations.push(
                                    new TariffConfigurationDto(
                                        tariffConfiguration.name,
                                        tariffConfiguration.discount,
                                        tariffConfiguration.voucherName,
                                        tariffConfiguration.bundlePrice
                                    )
                                )
                            }
                        )

                        clonedContractConfigurations.push(
                            new ContractConfigurationDto(
                                contractConfiguration.duration,
                                contractConfiguration.upfront,
                                clonedTariffConfigurations,
                            )
                        )
                    }
                )

                clonedDeviceConfigurations.push(
                    new DeviceConfigurationDto(
                        deviceConfiguration.manufacturer,
                        deviceConfiguration.deviceName,
                        deviceConfiguration.tco,
                        clonedContractConfigurations,
                    )
                )
            }
        }
    )

    const clonedBenefitMatrix = new BenefitMatrixDto(
        benefitMatrix.value.brand,
        clonedPeriod,
        benefitMatrix.value.portfolio,
        benefitMatrix.value.tariffNames,
        clonedDeviceConfigurations,
    )

    const overlayLoadingTemplate = '<span class=" ag-overlay-loading-center">Loading Promotions</span>'
    const overlayNoRowsTemplate = '<span class="ag-overlay-loading-center">No Data Found</span>'

    updateBenefitMatrixOnServer(route.params.id, clonedBenefitMatrix)
}

</script>

<template>
    <main>
        <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6" v-if="loading">
        </v-progress-linear>

        <div justify="center">
            <v-card width="100%" height="100%" raised class="mt-4" v-if="benefitMatrix">
                <div class="text-h5">Benefit Matrix</div>
                <div class="text-h6">{{ `${benefitMatrix.brand} ${benefitMatrix.portfolio}` }}</div>
                <div class="text-h6" v-if="benefitMatrix.period">
                    {{ `${moment(benefitMatrix.period.from).format("D MMM")} -
                    ${moment(benefitMatrix.period.till).format("D MMM YYYY")}`
                    }}
                </div>
                <v-card-text>
                    <ag-grid-vue v-if="rowData" ref="grid" style="width: 100%; height: 400px" class="ag-theme-material"
                        :columnDefs="columnDefs" :rowData="rowData" :animateRows="true" :debug="true"
                        :defaultColDef="defaultColDef" suppressMovableColumns @cell-clicked="cellClicked"
                        :rowHeight="40" :sortingOrder="['desc', 'asc', null]"
                        :overlayLoadingTemplate="overlayLoadingTemplate" :overlayNoRowsTemplate="overlayNoRowsTemplate">
                    </ag-grid-vue>
                </v-card-text>
            </v-card>
        </div>

        <DeviceConfigurationDialog ref="dialog" @save="update" />

        <v-btn class="text-h6" v-if="previousBenefitMatrix && previousBenefitMatrix.period" @click="openPrevious">{{ `<-
        ${moment(previousBenefitMatrix.period.from).format("D MMM")} -
        ${moment(previousBenefitMatrix.period.till).format("D MMM YYYY")}` }}</v-btn>
                <v-btn class="text-h6" v-if="benefitMatrix && benefitMatrix.period" disabled>
                    {{ ` ${moment(benefitMatrix.period.from).format("D MMM")} -
                    ${moment(benefitMatrix.period.till).format("D MMM YYYY")}`
                    }}</v-btn>
                <v-btn class="text-h6" v-if="nextBenefitMatrix && nextBenefitMatrix.period" @click="openNext">{{
                `${moment(nextBenefitMatrix.period.from).format("D MMM")} -
                ${moment(nextBenefitMatrix.period.till).format("D MMM YYYY")} ->`
                }}</v-btn>

                <v-snackbar v-model="error">
                    {{ error.message }}

                    <template v-slot:action="{ attrs }">
                        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                            Close
                        </v-btn>
                    </template>
                </v-snackbar>
    </main>
</template>
