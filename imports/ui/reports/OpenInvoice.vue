<template>
    <div>
        <q-card class="my-card">
            <q-form class="q-gutter-md">
                <q-card-section>
                    <div class="row q-col-gutter-x-md q-col-gutter-y-md">
                        <div class="col-xs-12 col-md-6 col-lg-6">
                            <div class="row q-col-gutter-sm">
                                <div class="col-md-12">
                                    <q-input v-model="form.date" filled mask="date" dense>
                                        <template #append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="form.date">
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
                        {{ empFilter }}
                        <div class="ra-mt-sm" />
                    </div>
                    <div class="col colspan-6">
                        <span class="title"> Customer: </span>
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
                            <th>Customer</th>
                            <th class="text-right">Amount</th>
                            <th class="text-right">Receive</th>
                            <th class="text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(doc, index) in reportData" :key="index">
                            <tr>
                                <th>{{ index + 1 }}</th>
                                <th colspan="6">{{ doc.groupName }}</th>
                            </tr>
                            <tr v-for="(it, key) in doc.details" :key="key">
                                <td></td>
                                <td>{{ formDate(it.tranDate) }}</td>
                                <td>{{ it.cusName }}</td>
                                <td class="text-right">{{ it.total }}</td>
                                <td class="text-right">{{ it.receive }}</td>
                                <td class="text-right">{{ it.balance }}</td>
                            </tr>
                            <tr>
                                <th class="text-right" colspan="3">Total</th>
                                <th class="text-right">{{ doc.totalAmount }}</th>
                                <th class="text-right">{{ doc.totalReceived }}</th>
                                <th class="text-right">{{ doc.totalBalance }}</th>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <span class="float-right text-md font-medium mt-2 font-bold">
                       Total Amount: {{ grandTotalAmount }}
                        <br>
                        Total Receive: {{ grandTotalReceived }}
                        <br>
                       Total Balance {{ grandTotalBalance }}
                        </span>
            </div>
        </ReportLayoutVue>
    </div>
</template>
<script setup>
import moment from 'moment'
import { includes } from 'lodash'
import { ref, onMounted, computed } from 'vue'
import ReportLayoutVue from '../layouts/ReportLayout.vue'

const execTime = ref(0)
const paperSize = ref('a4-p')
const reportName = ref('Open Invoice Report')
const columns = ref([
    { label: 'Employee', value: 'empname' },
    { label: 'Customer', value: 'cusname' },
])
const checkedColumns = ref(['gender', 'address'])
const reportData = ref([])
const grandTotalAmount = ref([])
const grandTotalReceived=ref([])
const grandTotalBalance=ref([])
const cssText = ref(``)
const form = ref({
    categoryIds: [],
    itemIds: [],
    customerIds: [],
    employeeIds: [],
    date: moment(new Date()).format('YYYY/MM/DD'),
})
const employeeOpts = ref([])
const customerOpts = ref([])

// Filter Employee
const empFilter = computed(() => {
    const selected = employeeOpts.value.filter(it => {
        return form.value.employeeIds.includes(it._id)
    })
    if (selected.length) {
        return selected.map(it => it.name)
    }
    return '[All]'
})
// Filter Customer
const cusFilter = computed(() => {
    const selected = customerOpts.value.filter(it => {
        return form.value.customerIds.includes(it._id)
    })
    if (selected.length) {
        return selected.map(it => it.name)
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
        reportDate: moment(form.value.date).endOf('day').toDate(),
    }
    if (form.value.customerIds.length) {
        selector.customerIds = form.value.customerIds
    }
    if (form.value.employeeIds.length) {
        selector.employeeIds = form.value.employeeIds
    }

    reportData.value = []
    Meteor.call('OpenInvoice', { ...selector }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            reportData.value = res.data
            grandTotalAmount.value = res.grandTotalAmount
            grandTotalReceived.value=res.grandTotalReceived
            grandTotalBalance.value=res.grandTotalBalance
            
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
// To find value item 
onMounted(() => {
    getEmployeeOpts()
    getCustomerOpts()
})
</script>
<style lang="scss" scoped>
@import './imports/ui/styles/report.scss';
</style>
  