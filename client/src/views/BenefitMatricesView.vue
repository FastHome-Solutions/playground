<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBenefitMatrixStore } from '@/stores/benefit-matrix.store'
import ItemGrid from '@/components/ItemGrid.vue'
import moment from 'moment'
import router from '@/router'
import MetadataDialog from '@/components/MetadataDialog.vue'
import { ref } from 'vue'
import { file } from '@babel/types'
import { BenefitMatrixMetadata, parseMetadataSuggestions, parseSpreadsheet, SpreadsheetMetadata, uploadFile } from '@/utils/parsing.utils'
import { PeriodInputType, type BenefitMatrixInputType } from '@/dto/benefit-matrix.dto'
import { cloneDeep } from '@apollo/client/utilities/common/cloneDeep'

const { benefitMatrix, benefitMatrices, loading, error } = storeToRefs(useBenefitMatrixStore())
const { fetchBenefitMatricesFromServer, editBenefitMatrix } = useBenefitMatrixStore()


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
  {
    headerName: 'Clone',
    headerClass: 'text-left',
    field: 'clone',
    cellClass: 'text-left',
    width: 180,
    minWidth: 130,
    maxWidth: 250,
    type: 'rightAligned',
    cellRenderer: cloneCellRenderer,
    sortable: false,
    filter: false
  }
]

function cloneCellRenderer(params) {
  let eGui = document.createElement('div');
  eGui.innerHTML = `<button data-action="clone" >Clone</button>`
  return eGui;
}

function cellClicked(event) {
  if (
    event.column.colId === 'clone' &&
    event.event.target.dataset.action
  ) {
    let action = event.event.target.dataset.action
    if (action === 'clone') {
      console.log('clone')
      onCloneBenefitMatrix(event.data)
    }
  } else {
    router.push({ name: 'benefit-matrix', params: { id: event.data._id } })
  }
}

fetchBenefitMatricesFromServer()

// File Upload
const dialog = ref(null)
const metadata = ref({} as BenefitMatrixMetadata)

// Clone BenefitMatrix
function onCloneBenefitMatrix(benefitMatrix: BenefitMatrixInputType) {
  editBenefitMatrix(cloneDeep(benefitMatrix))
  metadata.value = new BenefitMatrixMetadata(benefitMatrix.period.from, benefitMatrix.period.till, benefitMatrix.brand, benefitMatrix.portfolio)
  
  dialog.value.showDialog()
}

let spreadsheet = [[]]
async function onFileUpload(event) {
  const fileName = event.target.files[0].name
  spreadsheet = await uploadFile(event.target.files[0])
  metadata.value = parseMetadataSuggestions(fileName, spreadsheet)
  
  dialog.value.showDialog()
}

async function addMetadataToBenefitMatrix(metadata: BenefitMatrixMetadata) {
  if(metadata instanceof SpreadsheetMetadata) {
    const parsedBenefitMatrix = parseSpreadsheet(metadata, spreadsheet)
    editBenefitMatrix(parsedBenefitMatrix)
  } else {
    const clonedBenefitMatrix = cloneDeep(benefitMatrix.value)
    clonedBenefitMatrix.period = new PeriodInputType(
      metadata.from,
      metadata.till,
    )
    clonedBenefitMatrix.brand = metadata.brand
    clonedBenefitMatrix.portfolio = metadata.portfolio
    benefitMatrix.value = clonedBenefitMatrix
  }
  router.push({ name: 'edit-benefit-matrix' })
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

    <MetadataDialog ref="dialog" @confirm='addMetadataToBenefitMatrix' :metadata="metadata" />

    <p v-if="loading">Loading posts...</p>
    <p v-if="error">{{ error.message }}</p>

    <ItemGrid v-if="benefitMatrices" style="width: 100%; height: 400px" :columnDefs="columnDefs"
      :rowData="benefitMatrices" @cell-clicked="cellClicked"></ItemGrid>


  </main>
</template>
