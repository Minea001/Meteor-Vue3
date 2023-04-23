<template>
  <q-table
    v-model:pagination="pagination"
    bordered
    flat
    :rows="data"
    :columns="columns"
    :filter="filter"
    :loading="loading"
    row-key="_id"
    @request="onChangePagination"
  >
    <template #top>
      <!-- For route to saleform -->
      <div class="q-gutter-x-md">
        <q-btn label="ADD NEW" color="pink" @click="addNew"> </q-btn>
      </div>
      <q-space />
      <q-input
        v-model="filter"
        outlined
        dense
        debounce="300"
        placeholder="Search"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell-tranDate="props">
      <q-td :props="props">
        <span class="ra-text-link" @click="edit(props.row)">
          {{ formatDate(props.row.tranDate) }}
        </span>
      </q-td>
    </template>
  </q-table>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Notify from '/imports/ui/lib/notify'
import moment from 'moment'

const router = useRouter()

const columns = [
  { name: 'tranDate', label: 'Transition Date', field: 'tranDate' },
  { name: 'employeeId', label: 'Employee Name', field: 'empName' },
  { name: 'customerId', label: 'Customer Name', field: 'cusName' },
  { name: 'subTotal', label: 'Sub Total', field: 'subTotal' },
  { name: 'discount', label: 'Discount', field: 'discount' },
  { name: 'total', label: 'Total', field: 'total' },
  { name: 'status', label: 'Status', field: 'status' },
  { name: 'totalReceived', label: 'Total Recieve', field: 'totalReceived' },
]

// declear data properties
// to set dialog=false
const visibleDialog = ref(false)
const loading = ref(false)
const data = ref([])
const showId = ref('')
const filter = ref('')
//paginatte
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const formatDate = (value) => {
  return moment(value).format('DD/MM/YYYY')
}

// method 
const fetchData = () => {
  loading.value = true
  const { page, rowsPerPage } = pagination.value
  let exp = new RegExp(filter.value)
  const query = {}
  if (filter.value) {
    query['$or'] = [
      { tranDate: { $regex: exp, $options: 'i' } },
      { employeeId: { $regex: exp, $options: 'i' } },
      { customerId: { $regex: exp, $options: 'i' } },
      { subTotal: { $regex: exp, $options: 'i' } },
      { discount: { $regex: exp, $options: 'i' } },
      { total: { $regex: exp, $options: 'i' } },
      { status: { $regex: exp, $options: 'i' } },
      { statusDate: { $regex: exp, $options: 'i' } },
      { totalReceived: { $regex: exp, $options: 'i' } },
    ]
  }
  const match = {
    page,
    rowsPerPage,
    selector: query,
  }
  Meteor.call('findSale', { ...match }, (err, res) => {
    if (err) {
      console.log('error', err)
      Notify.error({ message: err.reason || err })
    } else {
      data.value = res.data || []
      pagination.value.rowsNumber = res.total || 0
    }
    loading.value = false
  })
}
const onChangePagination = (val) => {
  pagination.value = val.pagination
  fetchData()
}
const addNew = () => {
   //នៅពេលយើងចុចលើupdate វានឹង push ទៅកាន់ SaleFormតែអត់មានជាមួយid ទៅជាមួយទេ
  router.push({
    name: 'SaleForm',
  })
}
//to edit
const edit = (row) => {
  // showId.value = row._id
  router.push({
    //នៅពេលយើងចុចលើupdate វានឹង push ទៅកាន់ SaleFormតែមានជាមួយid ទៅដែរ
    name: 'SaleForm',
    //name: 'SaleForm' is from 'SaleForm' គឺយើងយក​ Name របស់វាពី file router.js
    query: {
      id: row._id,
    },
  })
}
//life cycle
onMounted(() => {
  // To show all data when Mount
  fetchData()
})
</script>
