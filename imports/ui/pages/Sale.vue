<template>
  <q-table v-model:pagination="pagination" bordered flat :rows="data" :columns="columns" :filter="filter"
    :loading="loading" row-key="_id" @request="onChangePagination">
    <template #top>
      <!-- For route to saleform -->
      <div class="q-gutter-x-md">
        <q-btn  label="ADD NEW" color="pink">
          <router-link exact :to="{ name: 'SaleForm' }" class="absolute full-width full-height"></router-link>
        </q-btn>

      </div>
      <q-space />
      <q-input v-model="filter" outlined dense debounce="300" placeholder="Search">
        <template #append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </template>
    <template #body-cell-name="props">
      <q-td :props="props">
        <span @click="edit(props.row)" class="ra-text-link"></span>
      </q-td>
    </template>
  </q-table>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import Notify from '/imports/ui/lib/notify'


const columns = [
{ name: 'tranDate', label: 'Transition Date', field: 'tranDate' },
  { name: 'employeeId', label: 'Employee Name', field: 'employeeId' },
  { name: 'customerId', label: 'Customer Name', field: 'customerId' },
  { name: 'subTotal', label: 'Sub Total', field: 'subTotal' },
  { name: 'discount', label: 'Discount', field: 'discount' },
  { name: 'total', label: 'Total', field: 'total' },
  { name: 'status', label: 'Status', field: 'status' },
  { name: 'statusDate', label: 'Status Date', field: 'total' },
  { name: 'totalReceived', label: 'Total Recieve', field: 'totalReceived' }
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
    page, rowsPerPage, selector: query
  }
  Meteor.call('findSale', { ...match }, (err, res) => {
    if (err) {
      console.log('error', err)
      Notify.error({ message: err.reason || err })
    } else {
      data.value = res.data || []
      pagination.value.rowsNumber = res.total || 0
      console.log(res)

    }
    loading.value = false
    console.log(res)
  })

}
const onChangePagination = (val) => {
  pagination.value = val.pagination
  fetchData()
}
//to edit
const edit = (row) => {
  visibleDialog.value = true
  showId.value = row._id
}
//life cycle
onMounted(() => {
  fetchData()

})
</script>