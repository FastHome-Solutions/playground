<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"
import moment from 'moment'
import router from '@/router'
import uploadFile from '@/utils/parsing.utils'

const { benefitMatrices, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatricesFromServer } = useBenefitMatrixStore()
const { uploadSpreadsheetToServer } = useBenefitMatrixStore()

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
    suppressSorting: true,
  },
  {
    headerName: 'Period',
    headerClass: 'text-left',
    field: 'period',
    cellClass: 'text-left',
    valueFormatter: ({ value }) => `${moment(value.from).format("D MMM")} - ${moment(value.to).format("D MMM YYYY")}`,
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
  {
    headerName: 'Edit',
    headerClass: 'text-left',
    field: 'edit',
    cellClass: 'text-left',
    width: 180,
    minWidth: 130,
    maxWidth: 250,
    type: 'rightAligned',
    cellRenderer: editCellRenderer,
    cellRendererParams: {
      clicked: function (field) {
        alert(`${field} was clicked`)
      }
    },
    sortable: false,
    filter: false
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
  if (
    event.column.colId === 'edit' &&
    event.event.target.dataset.action
  ) {
    let action = event.event.target.dataset.action
    if (action === 'edit') {
      console.log('edit')
    }
  } else {
    router.push({ name: 'benefit-matrix', params: { id: event.data._id } })
  }
}

function onFileUpload(event) {
  uploadFile(event.target.files[0])
    .then((result) => {
      console.log(result)
      uploadSpreadsheetToServer(result)
    })
    .catch((error) => {
      console.error(error)
    })
}

fetchBenefitMatricesFromServer()

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
