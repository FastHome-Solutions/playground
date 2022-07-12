<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"
import moment from 'moment'
import router from '@/router'
import MetadataDialog from '@/components/MetadataDialog.vue'
import { ref } from 'vue'
import { file } from '@babel/types'
import { uploadFile } from '@/utils/parsing.utils'

const { benefitMatrix, benefitMatrices, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatricesFromServer, uploadSpreadsheetToServer } = useBenefitMatrixStore()


const columnDefs = [
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
    headerName: 'Period',
    headerClass: 'text-left',
    field: 'period',
    cellClass: 'text-left',
    valueFormatter: ({ value }) => `${moment(value.from).format("D MMM")} - ${moment(value.till).format("D MMM YYYY")}`,
    sort: 'desc',
    sortingOrder: ['desc', 'asc'],
    comparator: (period1, period2) => moment(period1.from).isSame(period2.from) ? 0 : moment(period1.from).isAfter(period2.from) ? 1 : -1,
    width: 260,
    minWidth: 160,
    maxWidth: 350,
  },
  {
    headerName: 'Brand',
    headerClass: 'text-left',
    field: 'brand',
    cellClass: 'text-left',
    width: 180,
    minWidth: 130,
    maxWidth: 250,
    type: 'rightAligned',
  },
  {
    headerName: 'Portfolio',
    headerClass: 'text-left',
    field: 'portfolio',
    cellClass: 'text-left',
    width: 180,
    minWidth: 130,
    maxWidth: 250,
    type: 'rightAligned',
  },
]

function editCellRenderer(params) {
  let eGui = document.createElement('div');
  eGui.innerHTML = `<button data-action="edit" >Edit</button>`
  return eGui;
}

// DefaultColDef sets props common to all Columns
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

const overlayLoadingTemplate = '<span class=" ag-overlay-loading-center">Loading Promotions</span>'
const overlayNoRowsTemplate = '<span class="ag-overlay-loading-center">No Data Found</span>'

function cellClicked(event) {
    router.push({ name: 'benefit-matrix', params: { id: event.data._id } })
}

fetchBenefitMatricesFromServer()

// File Upload
const dialog = ref(null)
async function onFileUpload(event) {
  const spreadsheet = await uploadFile(event.target.files[0])
  const fileName = event.target.files[0].name
  dialog.value.showDialog(fileName, spreadsheet)
}

async function uploadBenefitMatrix(parsedBenefitMatrix: BenefitMatrixDto) {
  await uploadSpreadsheetToServer(parsedBenefitMatrix)
  router.push({ name: 'benefit-matrix', params: { id: benefitMatrix.value._id } })
}
</script>

<template>
  <main style="fill-height">
    <v-card-title>
      Benefit Matrices
      <v-spacer></v-spacer>
      <v-btn rounded="lg" elevation="2" color="primary" absolute bottom right @click="$refs.fileUpload.click()"> Upload
      </v-btn>
      <v-file-input id="fileUpload" ref="fileUpload" accept="application/vnd.ms-excel, application/msexcel, application/x-msexcel, application/x-ms-excel, 
    application/x-excel, application/x-dos_ms_excel, application/xls, application/x-xls,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Click here to select a file to upload"
        outlined @change="onFileUpload" show-size placeholder="Pick a file to upload" style="display:none">
      </v-file-input>
    </v-card-title>

    <MetadataDialog ref="dialog" @parsed-spreadsheet='uploadBenefitMatrix' />

    <p v-if="loading">Loading posts...</p>
    <p v-if="error">{{ error.message }}</p>
    <ag-grid-vue v-if="benefitMatrices" style="width: 100%; height: 400px" class="ag-theme-material"
      :columnDefs="columnDefs" :rowData="benefitMatrices" :animateRows="true" :debug="true"
      :defaultColDef="defaultColDef" suppressMovableColumns @cell-clicked="cellClicked" :rowHeight="40"
      :sortingOrder="['desc', 'asc', null]" :overlayLoadingTemplate="overlayLoadingTemplate"
      :overlayNoRowsTemplate="overlayNoRowsTemplate">
    </ag-grid-vue>


  </main>
</template>
