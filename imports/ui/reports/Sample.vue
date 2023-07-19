<template>
  <div>
    <q-card class="my-card">
      <q-form class="q-gutter-md">
        <q-card-section>
          <div class="row q-col-gutter-x-md q-col-gutter-y-md">
            <div class="col-xs-12 col-md-6 col-lg-6">
              <q-input v-model="form.tranDate" filled mask="date" dense>
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="form.tranDate">
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
            <div class="col-xs-12 col-md-6 col-lg-6">
              <q-input
                v-model="form.name"
                filled
                mask="date"
                dense
                placeholder="Name..."
              >
              </q-input>
            </div>
          </div>
        </q-card-section>
        <div class="text-right q-pb-md q-pr-md">
          <q-btn @click="filterdata()" label="Submit" color="primary" />
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
          <div class="col colspan-8">
            <span class="title"> Name : </span>
            [All]
            <div class="ra-mt-sm" />
          </div>
          <div class="col colspan-8">
            <span class="title"> Gender: </span>
            [All]
            <div class="ra-mt-sm" />
          </div>
          <div class="col colspan-8">
            <span class="title"> Address: </span>
            [All]
          </div>
        </div>
      </template>

      <!--REPORT CONTENT-->
      <div>
        <table id="myTable" class="table-content">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th v-if="showMoreHeader('gender')">Gender</th>
              <th v-if="showMoreHeader('address')">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in reportData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span class="ra-text-link">
                  {{ doc.code }}
                </span>
              </td>
              <td>{{ doc.name }}</td>
              <td v-if="showMoreHeader('gender')">{{ doc.gender }}</td>
              <td v-if="showMoreHeader('address')">{{ doc.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ReportLayoutVue>
  </div>
</template>
<script setup>
import moment from 'moment'
import { includes } from 'lodash'
import { ref } from 'vue'
import ReportLayoutVue from '../layouts/ReportLayout.vue'

const execTime = ref(0)
const paperSize = ref('a4-p')
const reportName = ref('Sample Report')
const columns = ref([
  { label: 'Gender', value: 'gender' },
  { label: 'Address', value: 'address' },
])
const checkedColumns = ref(['gender', 'address'])
const reportData = ref([
        
])
const cssText = ref(``)
const form = ref({
  name: '',
  tranDate: moment(new Date()).format('YYYY/MM/DD'),
})

const changeColumn = (val) => {
  checkedColumns.value = val
}
const showMoreHeader = (field) => {
  return includes(checkedColumns.value, field)
}
// for filter data
const filterdata=()=>{

}
</script>
<style lang="scss" scoped>
@import './imports/ui/styles/report.scss';
</style>
