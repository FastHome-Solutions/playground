<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"
import moment from 'moment'
import router from '@/router'


const { benefitMatrices, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatricesFromServer } = useBenefitMatrixStore()

const columnDefs = [
  {
    headerName: '',
    headerClass: 'text-center',
    pinned: 'left',
    colId: 'rowNo',
    cellClass: 'text-center',
    cellStyle: () => ({ 'font-size': '9px', 'margin-top': '2px' }),
    // cellRenderer: (params) => params.node.childIndex + 1,
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
]

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  editable: false,
  enableRangeSelection: true,
  enableColResize: true,
  suppressCellSelection: true,
  suppressMovableColumns: true,
  maxColWidth: 320,
  minColWidth: 50,
  rowHeight: 26,
  rowSelection: 'single',
  sortingOrder: ['desc', 'asc', null],
}

function cellClicked(event) { // Example of consuming Grid Event
  console.log("cell was clicked", event.data._id);
  router.push({ name: 'benefit-matrix', params: { id: event.data._id } })
}

fetchBenefitMatricesFromServer()

// rowData.value = benefitMatrices
</script>

<template>
  <main>
    <p v-if="loading">Loading posts...</p>
    <p v-if="error">{{ error.message }}</p>
    <ag-grid-vue v-if="benefitMatrices" style="width: 100%; height: 200px%" class="ag-theme-material full-height"
      :columnDefs="columnDefs" :rowData="benefitMatrices" animateRows="true" debug="true" :defaultColDef="defaultColDef"
      @cell-clicked="cellClicked">
    </ag-grid-vue>
  </main>
</template>
