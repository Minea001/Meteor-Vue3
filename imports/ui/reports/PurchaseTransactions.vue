<template>
  <div>
    <q-card class="my-card">
      <q-form class="q-gutter-md">
        <q-card-section>
          <div class="row q-col-gutter-x-md q-col-gutter-y-md">
            <div class="col-xs-12 col-md-6 col-lg-6">
              <div class="row q-col-gutter-sm">
                <div class="col-md-6">
                  <q-input v-model="form.dateT" filled mask="date" dense>
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="form.dateT">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6">
                  <q-input v-model="form.dateF" filled mask="date" dense>
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="form.dateF">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 col-lg-6">
              <q-select
                dense
                v-model="form.vendorIds"
                outlined
                :options="vendorOpts"
                multiple
                emit-value
                map-options
                option-value="_id"
                option-label="name"
                label="Vendor" 
              />
            </div>
            <div class="col-xs-12 col-md-6 col-lg-6">
              <q-select
                dense
                v-model="form.employeeIds"
                outlined
                :options="employeeOpts"
                multiple
                emit-value
                map-options
                option-value="_id"
                option-label="name"
                label="Employee"
              />
            </div>
          </div>
        </q-card-section>
        <div class="text-right q-pb-md q-pr-md">
          <q-btn @click="submit()" label="Submit" color="primary" />
        </div>
      </q-form>
    </q-card>
    <ReportLayoutVue
      :exec-time="execTime"
      :report-title="`Testing`"
      :paper-size="paperSize"
      :css-text="cssText"
      :columns="columns"
      :active-columns="checkedColumns"
      @changeColumn="changeColumn"
    >
      <!--REPORT HEADER-->
      <template #header>
        <div class="report-name">
          {{ reportName }}
        </div>
      </template>

      <!--REPORT FILTER-->
      <template #filter>
        <div class="row">
          <div class="col colspan-12">
            <span class="title"> Employee : </span>
            {{ empFilter }}
            <div class="ra-mt-sm" />
          </div>
          <div class="col colspan-12">
            <span class="title"> Vendor: </span>
            {{ cusFilter }}
            <div class="ra-mt-sm" />
          </div>
          
        </div>
      </template>

      <!--REPORT CONTENT-->
      <div>
        <table id="myTable" class="table-content">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th v-if="showMoreHeader('employee')">Employee</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in reportData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                {{ formDate(doc.tranDate) }}
              </td>
              <td v-if="showMoreHeader('employee')">{{ doc.empName }}</td>
              <td>{{ doc.venName }}</td>
              <td>{{ doc.subTotal }}</td>
              <td>{{ doc.discount }}</td>
              <td>{{ doc.total }}</td>
            </tr>
          </tbody>
        </table>
        <span class="float-right text-lg font-medium mt-2">
          Total: {{ grandTotal }}
        </span>
      </div>
    </ReportLayoutVue>
  </div>
</template>
<script setup>
import moment from 'moment'
import { includes } from 'lodash'
import { onMounted, ref,computed } from 'vue'
import ReportLayoutVue from '../layouts/ReportLayout.vue'

const execTime = ref(0)
const paperSize = ref('a4-p')
const reportName = ref('Purchase Transaction')
const columns = ref([{ label: 'Employee', value: 'employee' }]) //?
const checkedColumns = ref(['employee'])
const reportData = ref([])
const grandTotal = ref(0)
const cssText = ref(``)
const form = ref({
  vendorIds: [],
  employeeIds: [],
  dateT: moment(new Date()).format('YYYY/MM/DD'),
  dateF: moment(new Date()).format('YYYY/MM/DD'),
})

const employeeOpts = ref([])
const vendorOpts = ref([])

const changeColumn = (val) => {
  checkedColumns.value = val
}
const showMoreHeader = (field) => {
  return includes(checkedColumns.value, field)
}

const formDate = (value) => {
  return moment(value).format('YYYY/MM/DD')
}
// Filter Employee
const empFilter = computed(()=>{
    const selected = employeeOpts.value.filter(it=>{
        return form.value.employeeIds.includes(it._id)
    })
    if(selected.length){
        return selected.map(it=>it.name)
    }
    return '[All]'
})
// Filter Customer
const cusFilter = computed(()=>{
    const selected = vendorOpts.value.filter(it=>{
        return form.value.vendorIds.includes(it._id)
    })
    if(selected.length){
        return selected.map(it=>it.name)
    }
    return '[All]'
})
// for filter data
const submit = () => {
  const selector = {
    reportDate: [
      moment(form.value.dateT).startOf('day').toDate(),
      moment(form.value.dateF).endOf('day').toDate(),
    ],
  }
  if (form.value.vendorIds.length) {
    selector.vendorIds = form.value.vendorIds
  }
  if (form.value.employeeIds.length) {
    selector.employeeIds = form.value.employeeIds
  }

  reportData.value = []
  Meteor.call('purchaseTransactions', { ...selector }, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      reportData.value = res.data
      grandTotal.value = res.grandTotal
    }
  })
}
// Get options
const getEmployeeOpts = () => {
  Meteor.call('ShowEmployee', (err, res) => {
    employeeOpts.value = res
  })
}
const getVendorOpts = () => {
  Meteor.call('ShowVendor', (err, res) => {
    vendorOpts.value = res
  })
}

onMounted(() => {
  getEmployeeOpts()
  getVendorOpts()
})
</script>
<style lang="scss" scoped>
@import './imports/ui/styles/report.scss';
</style>
