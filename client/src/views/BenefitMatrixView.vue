<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import moment from 'moment'
import ItemGrid from '@/components/ItemGrid.vue'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import router from '@/router'
import DeviceConfigurationDialog from '@/components/DeviceConfigurationDialog.vue'
import { ContractConfigurationInputType, TariffConfigurationInputType, DeviceConfigurationInputType, BenefitMatrixInputType } from '@/dto/benefit-matrix.dto'
import { BenefitMatrixBundlePrice, BenefitMatrixDiscount, BenefitMatrixRowData, benefitMatrixToRowData } from '@/components/benefit-matrix.businessmodel'
import { cloneDeep } from '@apollo/client/utilities'
import { computed } from '@vue/reactivity'
import ConfirmCancelDialog from '@/components/ConfirmCancelDialog.vue'


const benefitMatrixStore = useBenefitMatrixStore()
const { benefitMatrix, loading, error } = storeToRefs(benefitMatrixStore)
const { previousBenefitMatrix } = storeToRefs(benefitMatrixStore)
const { nextBenefitMatrix } = storeToRefs(benefitMatrixStore)

const { updateBenefitMatrixOnServer, fetchBenefitMatrixFromServer, uploadSpreadsheetToServer } = useBenefitMatrixStore()

const route = useRoute()

onBeforeRouteUpdate(async (to, from) => {
    updateData(to.params.id)
})

const columnDefs = ref(null)

const editMode = ref(route.params.id === undefined) // editing is in progress when a device configuration is added/deleted/edited or a new BM hasn't been uploaded yet
let editingNewBenefitMatrix = editMode.value
let addBenefitMatrixMode = editMode.value && !benefitMatrix.value._id // either adding a file by upload or manually
if (addBenefitMatrixMode) {
    setColDefs()
}

if (!editMode.value) { // display data regularly
    updateData(route.params.id)
} else {
    if (!addBenefitMatrixMode) { // clone mode needs a server call to enrich the BM
        updateData(benefitMatrix.value._id)
    }
}

const rowData = computed(() => benefitMatrixToRowData(benefitMatrix.value))

function updateData(id: String) {
    const benefitMatrixBeforeUpdate = cloneDeep(benefitMatrix)
    fetchBenefitMatrixFromServer(id)
        .then(() => {
            if (editMode.value) {
                const clonedBenefitMatrix = cloneDeep(benefitMatrix.value)
                clonedBenefitMatrix._id = undefined
                clonedBenefitMatrix.period = benefitMatrixBeforeUpdate.value.period
                clonedBenefitMatrix.brand = benefitMatrixBeforeUpdate.value.brand
                clonedBenefitMatrix.portfolio = benefitMatrixBeforeUpdate.value.portfolio
                benefitMatrix.value = clonedBenefitMatrix
            }
            setColDefs()
        })
}

function setColDefs() {
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
        minWidth: 160,
        maxWidth: 200,
        type: 'rightAligned',
        cellRenderer: editCellRenderer,
        sortable: false,
        filter: false
    })

    function editCellRenderer(params) {
        let eGui = document.createElement('div');
        eGui.innerHTML =
            `<button data-action="edit" >Edit</button> 
            <button data-action="clone" style="margin-left:10px;">Clone</button>
            <button data-action="delete" style="margin-left:10px;">Delete</button>`
        return eGui;
    }
}

const dialog = ref(DeviceConfigurationDialog)
const deletionConfirmationDialog = ref(ConfirmCancelDialog)
const savingConfirmationDialog = ref(ConfirmCancelDialog)
const addingDeviceConfiguration = ref(false)
const selectedDeviceConfiguration = ref({} as BenefitMatrixRowData)

function cellClicked(event) {
    if (
        event.column.colId === 'edit' &&
        event.event.target.dataset.action
    ) {
        let action = event.event.target.dataset.action
        selectedDeviceConfiguration.value = event.data
        if (action === 'edit') {
            console.log('edit')
            addingDeviceConfiguration.value = false
            dialog.value.showDialog()
        } else if (action === 'clone') {
            console.log('clone')
            addingDeviceConfiguration.value = true
            dialog.value.showDialog()
        } else if (action === 'delete') {
            console.log('delete')
            deletionConfirmationDialog.value.showDialog()
        }
    }
}

function openPrevious() {
    router.push({ path: '/benefit-matrix/' + previousBenefitMatrix.value._id })
}

function openNext() {
    router.push({ name: 'benefit-matrix', params: { id: nextBenefitMatrix.value._id } })
}

function update(add: boolean, updatedDeviceConfiguration: BenefitMatrixRowData) {
    editMode.value = true // from here on in edit mode

    if (add === true) {
        benefitMatrix.value = addDeviceConfiguration(updatedDeviceConfiguration)
    } else {
        benefitMatrix.value = editDeviceConfiguration(updatedDeviceConfiguration)
    }
}

function confirmDeletion() {
    deleteDeviceConfiguration(selectedDeviceConfiguration.value)
}

function deleteDeviceConfiguration(deviceConfigurationToDelete: BenefitMatrixRowData) {
    editMode.value = true // from here on in edit mode

    // Cloning because Apollo return values are immutable by design
    const clonedBenefitMatrix = cloneDeep(benefitMatrix.value)
    const deviceConfiguration: DeviceConfigurationInputType = clonedBenefitMatrix.deviceConfigurations.find(deviceConfiguration => {
        return deviceConfiguration.deviceName === deviceConfigurationToDelete.deviceName && deviceConfiguration.manufacturer === deviceConfigurationToDelete.manufacturer
            && deviceConfiguration.tco === deviceConfigurationToDelete.tco
    })
    const contractConfiguration: ContractConfigurationInputType = deviceConfiguration?.contractConfigurations.find(contractConfiguration => {
        return contractConfiguration.duration === deviceConfigurationToDelete.contractDuration
    })

    const upfrontIndex = contractConfiguration.upfronts.indexOf(deviceConfigurationToDelete.upfront)
    if (upfrontIndex !== -1) { // row contained additional upfronts and bundle prices, delete them
        contractConfiguration.upfronts.splice(upfrontIndex, 1)
        contractConfiguration.tariffConfigurations.forEach(tariff => {
            tariff.bundlePrices.splice(upfrontIndex, 1)
        })
    } else { // delete contract configuration
        deviceConfiguration.contractConfigurations = deviceConfiguration?.contractConfigurations.filter(contractConfiguration => {
            return contractConfiguration.duration === deviceConfigurationToDelete.contractDuration
        })
    }

    if (deviceConfiguration.contractConfigurations.length == 0) { // no more contracts => delete device configuration
        clonedBenefitMatrix.deviceConfigurations = clonedBenefitMatrix.deviceConfigurations.filter(deviceConfiguration => {
            return deviceConfiguration.deviceName === deviceConfigurationToDelete.deviceName && deviceConfiguration.manufacturer === deviceConfigurationToDelete.manufacturer
                && deviceConfiguration.tco === deviceConfigurationToDelete.tco
        })
    }
    benefitMatrix.value = clonedBenefitMatrix
}

function addDeviceConfiguration(updatedDeviceConfiguration: BenefitMatrixRowData): BenefitMatrixInputType {
    // Cloning because Apollo return values are immutable by design
    const clonedBenefitMatrix = cloneDeep(benefitMatrix.value)

    if (!clonedBenefitMatrix.deviceConfigurations) { clonedBenefitMatrix.deviceConfigurations = [] }

    const deviceConfigurationToAddTo: DeviceConfigurationInputType = clonedBenefitMatrix.deviceConfigurations.find(deviceConfiguration => {
        return deviceConfiguration.deviceName === updatedDeviceConfiguration.deviceName && deviceConfiguration.manufacturer === updatedDeviceConfiguration.manufacturer
            && deviceConfiguration.tco === updatedDeviceConfiguration.tco
    })
    if (deviceConfigurationToAddTo) {
        // device configuration hasn't changed, use existing one
        const contractConfigurationToAddTo: ContractConfigurationInputType = deviceConfigurationToAddTo.contractConfigurations.find(contractConfiguration => {
            return contractConfiguration.duration === updatedDeviceConfiguration.contractDuration
        })
        if (contractConfigurationToAddTo) {
            // contract configuration hasn't changed, use existing one

            let newUpfront = false
            let newBundlePrice = false
            if (contractConfigurationToAddTo.upfronts.indexOf(updatedDeviceConfiguration.upfront) === -1) { // Upfront has changed
                newUpfront = true
            }

            contractConfigurationToAddTo.tariffConfigurations.forEach((tariffConfiguration, i) => {
                let needNewTariffConfig = false
                if (tariffConfiguration.discount === updatedDeviceConfiguration.discounts[i].discount) {
                    // discount hasn't changed
                } else {
                    // create new tariff configuration
                    needNewTariffConfig = true
                }

                if (tariffConfiguration.voucherName === updatedDeviceConfiguration.discounts[i].voucherName) {
                    // voucher name didn't change
                } else {
                    // create new tariff configuration
                    needNewTariffConfig = true
                }

                if (!needNewTariffConfig && tariffConfiguration.bundlePrices.indexOf(updatedDeviceConfiguration.bundlePrices[i].bundlePrice) === -1) { // Bundle price has changed
                    // new bundle price
                    newBundlePrice = true
                }

                if (needNewTariffConfig) {
                    // If we need a new tariff config, since we can't add another one, we also need a new contract config 
                    deviceConfigurationToAddTo.contractConfigurations.push(deviceConfigurationToContract(updatedDeviceConfiguration))
                }
            })
            if (newUpfront || newBundlePrice) { // if there is a new upfront or a new bundle price, the upfront and all the bundle prices need to be added
                contractConfigurationToAddTo.upfronts.push(updatedDeviceConfiguration.upfront)

                contractConfigurationToAddTo.tariffConfigurations.forEach((tariffConfiguration, i) => {
                    tariffConfiguration.bundlePrices.push(updatedDeviceConfiguration.bundlePrices[i].bundlePrice)
                })
            }

        } else {
            // create new contract config
            deviceConfigurationToAddTo.contractConfigurations.push(deviceConfigurationToContract(updatedDeviceConfiguration))
        }
    } else {
        // device configuration has changed, create new one
        const newContractConfigurations = deviceConfigurationToContract(updatedDeviceConfiguration)
        const newDeviceConfiguration = new DeviceConfigurationInputType(updatedDeviceConfiguration.manufacturer, updatedDeviceConfiguration.deviceName, updatedDeviceConfiguration.tco, [newContractConfigurations])
        clonedBenefitMatrix.deviceConfigurations.push(newDeviceConfiguration)
    }

    return clonedBenefitMatrix
}

function editDeviceConfiguration(updatedDeviceConfiguration: BenefitMatrixRowData): BenefitMatrixInputType {
    // Cloning because Apollo return values are immutable by design
    const clonedBenefitMatrix = cloneDeep(benefitMatrix.value)

    // Update clonedBenefitMatrix with updatedDeviceConfiguration 
    const deviceConfigurationToUpdate: DeviceConfigurationInputType = clonedBenefitMatrix.deviceConfigurations.find(deviceConfiguration => {
        return deviceConfiguration.deviceName === selectedDeviceConfiguration.value.deviceName && deviceConfiguration.manufacturer === selectedDeviceConfiguration.value.manufacturer
            && deviceConfiguration.tco === selectedDeviceConfiguration.value.tco
    })

    deviceConfigurationToUpdate.deviceName = updatedDeviceConfiguration.deviceName
    deviceConfigurationToUpdate.manufacturer = updatedDeviceConfiguration.manufacturer
    deviceConfigurationToUpdate.tco = updatedDeviceConfiguration.tco
    const contractConfigurationToUpdate: ContractConfigurationInputType = deviceConfigurationToUpdate?.contractConfigurations.find(contractConfiguration => {
        return contractConfiguration.duration === selectedDeviceConfiguration.value.contractDuration
    })
    contractConfigurationToUpdate.duration = updatedDeviceConfiguration.contractDuration
    const selectedUpfrontIndex = contractConfigurationToUpdate.upfronts.indexOf(selectedDeviceConfiguration.value.upfront)
    contractConfigurationToUpdate.upfronts[selectedUpfrontIndex] = updatedDeviceConfiguration.upfront
    contractConfigurationToUpdate.tariffConfigurations.forEach((tariffConfiguration, i) => {
        const discounts = updatedDeviceConfiguration.discounts
        tariffConfiguration.voucherName = updatedDeviceConfiguration.discounts[i].voucherName
        tariffConfiguration.name = updatedDeviceConfiguration.discounts[i].tariffName
        tariffConfiguration.discount = updatedDeviceConfiguration.discounts[i].discount
        const selectedBundlePriceIndex = tariffConfiguration.bundlePrices.indexOf(selectedDeviceConfiguration.value.bundlePrices[i].bundlePrice)
        tariffConfiguration.bundlePrices[selectedBundlePriceIndex] = updatedDeviceConfiguration.bundlePrices[i].bundlePrice
    })

    return clonedBenefitMatrix
}

function deviceConfigurationToTariff(deviceConfiguration: BenefitMatrixRowData) {
    return deviceConfiguration.discounts.map((discount, i) => {
        return new TariffConfigurationInputType(
            discount.tariffName,
            discount.discount,
            discount.voucherName,
            [deviceConfiguration.bundlePrices[i].bundlePrice]
        )
    })
}

function deviceConfigurationToContract(deviceConfiguration: BenefitMatrixRowData) {
    const newTariffConfigurations = deviceConfigurationToTariff(deviceConfiguration)

    return new ContractConfigurationInputType(
        deviceConfiguration.contractDuration,
        [deviceConfiguration.upfront],
        newTariffConfigurations,
    )
}

function onCancel() {
    benefitMatrix.value = null
    editMode.value = false
    addBenefitMatrixMode = false
    router.push({ name: 'benefit-matrices' })
}

function onConfirmSaving() {
    if (editingNewBenefitMatrix) {
        uploadSpreadsheetToServer(benefitMatrix.value)
            .then(() => {
                editMode.value = false
                addBenefitMatrixMode = false
                editingNewBenefitMatrix = false
                router.replace({ name: 'benefit-matrix', params: { id: benefitMatrix.value._id } })
                updateData(benefitMatrix.value._id)
            })
    } else {
        updateBenefitMatrixOnServer(benefitMatrix.value)
            .then(() => {
                editMode.value = false
            })
    }
}

function onSave() {
    savingConfirmationDialog.value.showDialog()
}

function onAdd() {
    console.log('add')
    const discounts = [] as BenefitMatrixDiscount[]
    const bundlePrices = [] as BenefitMatrixBundlePrice[]
    const tariffs = benefitMatrix.value.tariffNames.forEach(tariffName => {
        discounts.push(new BenefitMatrixDiscount(tariffName, '', 0))
        bundlePrices.push(new BenefitMatrixBundlePrice(tariffName, 0))
    })
    selectedDeviceConfiguration.value = new BenefitMatrixRowData('', '', 24, 0, 0, 0, discounts, bundlePrices)
    addingDeviceConfiguration.value = true
    dialog.value.showDialog()
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
                    <ItemGrid v-if="rowData" style="width: 100%; height: 400px" :columnDefs="columnDefs"
                        :rowData="rowData" @cell-clicked="cellClicked"></ItemGrid>
                </v-card-text>
            </v-card>
        </div>

        <DeviceConfigurationDialog ref="dialog" @save="update" :add="addingDeviceConfiguration"
            :deviceConfiguration="selectedDeviceConfiguration" />

        <ConfirmCancelDialog ref="deletionConfirmationDialog" @confirm="confirmDeletion"
            :text="'Do you really want to delete this item?'" />
        <ConfirmCancelDialog ref="savingConfirmationDialog" @confirm="onConfirmSaving"
            :text="'Please confirm you want to apply your changes'" />

        <v-spacer></v-spacer>
        <v-btn rounded="lg" elevation="2" color="primary" absolute bottom right @click="onAdd">
            Add
        </v-btn>
        <div v-if="!editMode">
            <v-btn class="text-h6" v-if="previousBenefitMatrix && previousBenefitMatrix.period" @click="openPrevious">{{
                    `<- ${moment(previousBenefitMatrix.period.from).format("D MMM")} -
                                ${moment(previousBenefitMatrix.period.till).format("D MMM YYYY")}`
            }}</v-btn>
                    <v-btn class="text-h6" v-if="benefitMatrix && benefitMatrix.period" disabled>
                        {{ ` ${moment(benefitMatrix.period.from).format("D MMM")} -
                                                ${moment(benefitMatrix.period.till).format("D MMM YYYY")}`
                        }}</v-btn>
                    <v-btn class="text-h6" v-if="nextBenefitMatrix && nextBenefitMatrix.period" @click="openNext">{{
                            `${moment(nextBenefitMatrix.period.from).format("D MMM")} -
                                            ${moment(nextBenefitMatrix.period.till).format("D MMM YYYY")} ->`
                    }}</v-btn>
        </div>

        <v-btn class="text-h6" v-if="editMode" @click="onCancel">Cancel</v-btn>
        <v-btn class="text-h6" v-if="editMode" @click="onSave">Save</v-btn>

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
