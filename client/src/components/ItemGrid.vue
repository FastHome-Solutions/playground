<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-material.css"

const props = defineProps<{
  columnDefs: []
  rowData: []
}>()

const emit = defineEmits<{
  (e: 'cell-clicked', event): void
}>()

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

function cellClicked(event) {
  emit('cell-clicked', event)
}

const overlayLoadingTemplate = '<span class=" ag-overlay-loading-center">Loading</span>'
const overlayNoRowsTemplate = '<span class="ag-overlay-loading-center">No Data Found</span>'

</script>

<template>
    <ag-grid-vue class="ag-theme-material"
      :columnDefs="columnDefs" :rowData="rowData" :animateRows="true" :debug="true"
      :defaultColDef="defaultColDef" suppressMovableColumns @cell-clicked="cellClicked" :rowHeight="40"
      :sortingOrder="['desc', 'asc', null]" :overlayLoadingTemplate="overlayLoadingTemplate"
      :overlayNoRowsTemplate="overlayNoRowsTemplate">
    </ag-grid-vue>
</template>
