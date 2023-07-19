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
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="form.dateT">
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
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
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="form.dateF">
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                                        </div>
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                        </div>

                        <div class="col-xs-6 col-md-6 col-lg-6">
                            <div class="row q-col-gutter-sm">
                                <!--catagory  -->
                                <div class="col-md-6">
                                    <q-select dense v-model="form.categoryIds" outlined :options="cateogoryOpts" multiple
                                        emit-value map-options option-value="_id" option-label="name" label="Category" />
                                </div>
                                <!-- Item -->
                                <div class="col-md-6">
                                    <q-select dense v-model="form.itemIds" outlined :options="itemOpts" multiple emit-value
                                        map-options option-value="_id" option-label="name" label="Item" />
                                </div>
                            </div>
                        </div>
                        <!-- Employee -->
                        <div class="col-xs-6 col-md-6 col-lg-6">
                            <q-select dense v-model="form.employeeIds" outlined :options="employeeOpts" multiple emit-value
                                map-options option-value="_id" option-label="name" label="Employee" />
                        </div>
                        <!-- Customer -->
                        <div class="col-xs-6 col-md-6 col-lg-6">
                            <q-select dense v-model="form.customerIds" outlined :options="customerOpts" multiple emit-value
                                map-options option-value="_id" option-label="name" label="Customer" />
                        </div>
                    </div>
                </q-card-section>
                <div class="text-right q-pb-md q-pr-md">
                    <q-btn @click="submit()" label="Submit" color="primary" />
                </div>
            </q-form>
        </q-card>
        <ReportLayoutVue :exec-time="execTime" :report-title="`Testing`" :paper-size="paperSize" :css-text="cssText"
            :columns="columns" :active-columns="checkedColumns" @changeColumn="changeColumn">
            <!--REPORT HEADER-->
            <template #header>
                <div class="report-name">
                    {{ reportName }}
                </div>
            </template>

            <!--REPORT FILTER-->
            <template #filter>
                <div class="row">
                    <div class="col colspan-6">
                        <span class="title"> Employee : </span>
                        {{empFilter}}
                        <div class="ra-mt-sm" />
                    </div>
                    <div class="col colspan-6">
                        <span class="title"> Customer: </span>
                      {{ cusFilter }}
                        <div class="ra-mt-sm" />
                    </div>
                    <div class="col colspan-6">
                        <span class="title"> Category: </span>
                        {{ categFilter }}
                    </div>
                    <div class="col colspan-6">
                        <span class="title"> Item: </span>
                        {{ itemFilter }}
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
                            <th>Employee</th>
                            <th>Customer</th>
                            <th>Item</th>
                            <th>QTY</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(doc, index) in reportData" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ formDate(doc.tranDate) }}</td>
                            <td >{{ doc.empName }}</td>
                            <td>{{ doc.cusName }}</td>
                            <td>{{ doc.itemName }}</td>
                            <td>{{ doc.qty }}</td>
                            <td>{{ doc.price }}</td>
                            <td>{{ doc.amount }}</td>
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
import { ref, onMounted,computed } from 'vue'
import ReportLayoutVue from '../layouts/ReportLayout.vue'

const execTime = ref(0)
const paperSize = ref('a4-p')
const reportName = ref('Sale Transectiton Detail Report')
const columns = ref([
    { label: 'Employee', value: 'empname' },
    { label: 'Customer', value: 'cusname' },
])
const checkedColumns = ref(['gender', 'address'])
const reportData = ref([])
const grandTotal = ref(0)
const cssText = ref(``)
const form = ref({
    categoryIds: [],
    itemIds: [],
    customerIds: [],
    employeeIds: [],
    dateT: moment(new Date()).format('YYYY/MM/DD'),
    dateF: moment(new Date()).format('YYYY/MM/DD'),
})
const employeeOpts = ref([])
const customerOpts = ref([])
const cateogoryOpts = ref([])
const itemOpts = ref([])

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
    const selected = customerOpts.value.filter(it=>{
        return form.value.customerIds.includes(it._id)
    })
    if(selected.length){
        return selected.map(it=>it.name)
    }
    return '[All]'
})
//Filter Category
const categFilter = computed(()=>{
    const selected = cateogoryOpts.value.filter(it=>{
        return form.value.categoryIds.includes(it._id)
    })
    if(selected.length){
        return selected.map(it=>it.name)
    }
    return '[All]'
})
//Filter Item
const itemFilter = computed(()=>{
    const selected = itemOpts.value.filter(it=>{
        return form.value.itemIds.includes(it._id)
    })
    if(selected.length){
        return selected.map(it=>it.name)
    }
    return '[All]'
})
const changeColumn = (val) => {
    checkedColumns.value = val
}
const showMoreHeader = (field) => {
    return includes(checkedColumns.value, field)
}
const formDate = (value) => {
    return moment(value).format('YYYY/MM/DD')
}
// for filter data
const submit = () => {
    const selector = {
        reportDate: [
            moment(form.value.dateT).startOf('day').toDate(),
            moment(form.value.dateF).endOf('day').toDate(),
        ]
    }
    if (form.value.customerIds.length) {
        selector.customerIds = form.value.customerIds
    }
    if (form.value.employeeIds.length) {
        selector.employeeIds = form.value.employeeIds
    }
    if (form.value.itemIds.length) {
        selector.itemIds = form.value.itemIds
    }
    if (form.value.categoryIds.length) {
        selector.categoryIds = form.value.categoryIds
    }
    reportData.value = []
    Meteor.call('saleTransactionsDetail', { ...selector }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            reportData.value = res.data
            grandTotal.value = res.grandTotal
        }
    })
}
//get option
const getEmployeeOpts = () => {
    Meteor.call('ShowEmployee', (err, res) => {
        employeeOpts.value = res
    })
}
const getCustomerOpts = () => {
    Meteor.call('ShowCustomer', (err, res) => {
        customerOpts.value = res
    })
}
const getCategoryOpts = () => {
    Meteor.call('ShowCat', (err, res) => {
        cateogoryOpts.value = res
    })
}
const getItemOpts = () => {
    Meteor.call('ShowItem', (err, res) => {
        itemOpts.value = res
    })
}
// To find value item 
onMounted(() => {
    getEmployeeOpts()
    getCustomerOpts()
    getItemOpts()
    getCategoryOpts()
})
</script>
<style lang="scss" scoped>
@import './imports/ui/styles/report.scss';
</style>
  