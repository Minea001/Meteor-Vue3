<template>
  <q-card>
    <q-card-section>
      <h6 style="color: rebeccapurple"><strong>RECIEPT FORM</strong></h6>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent ref="refForm">
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-6" style="padding-right: 10px">
                <q-label>Date*</q-label>
                <q-input outlined dense v-model="dateStr" :rules="rules.tranDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateStr" mask="DD/MMM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6" style="padding-right: 10px">
                <q-label>Customer*</q-label>
                <q-select dense v-model="form.customerId" :options="customerOpts" :rules="rules.customerId" outlined
                  emit-value map-options option-value="_id" option-label="name" label="Customer *" />
              </div>
          
            </div>
          </div>
          <!-- LINE 2 -->
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-6" style="padding-right: 10px">
                <q-label>Employee*</q-label>
                <q-select dense v-model="form.employeeId" outlined :rules="rules.employeeId" :options="employeeOpts"
                  emit-value map-options option-value="_id" option-label="name" label="Employee *" />
              </div>
              <div class="col-6" style="padding-right: 10px">
                <q-label>Sale ID*</q-label>
                <q-select dense v-model="form.saleId" :options="saleOpts" :rules="rules.saleId" outlined
                  emit-value map-options option-value="_id" option-label="name" label="Sale ID *" />
              </div>
            
            </div>
          </div>
             <!-- LINE 3 -->
             <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-6" style="padding-right: 10px">
                <q-label>Recieve*</q-label>
                <q-input dense outlined placeholder="Recieve*" :rules="rules.recieve" v-model="form.recieve"></q-input>
              </div>
              <div class="col-6" style="padding-right: 10px">
                <q-label>Discount</q-label>
                <q-input dense outlined placeholder="Discount" v-model="form.discount"></q-input>
              </div>
            
            </div>
          </div>
              <!-- LINE 4 -->
              <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-6" style="padding-right: 10px">
                <q-label>Memo</q-label>
                <q-input dense outlined placeholder="Memo" v-model="form.memo"></q-input>
              </div>
              <div class="col-6" style="padding-right: 10px">
                <q-label>Open</q-label>
                <q-input dense outlined placeholder="Open" readonly ></q-input>
              </div>
            
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
<q-card-section>
  <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
        <div class="col-12">
       <br>
          <q-btn  color="pink" label="Save Close" />
          <q-btn class="q-ml-sm" v-if="!showId" color="warning" label="Save New"/>
          <q-btn v-if=" showId " class="q-ml-sm" color="red"  label="Remove" />
          <q-btn class="q-ml-sm" color="secondary" label="Cancel" />
        </div>
      </div>

</q-card-section>
  </q-card>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import Notify from '/imports/ui/lib/notify'
import wrapCurrentTime from '/imports/ui/lib/wrap-current-time.js'
import { ref, watch, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
// To call moment package
import moment from 'moment'
const route = useRoute()
const router = useRouter()

const dateStr=ref(moment().format('DD/MMM/YYYY'))
const refForm=ref()
const employeeOpts = ref([{}])
const customerOpts = ref([{}])
const saleOpts=ref([{}])

const shwoId=ref(route.query.id)
const form =ref({
  tranDate:'',
  employeeId: '',
  customerId: '',
  saleId:'',
    recieve:0,
    discount:0,
    memo:''
})
const rules={
  employeeId: [
    (v) => !!v || 'Employee is required!',

  ],
  customerId: [
    (v) => !!v || 'Customer is required!',

  ],
  saleId: [
    (v) => !!v || 'Sale Id is required!',

  ],
  recieve: [
    (v) => !!v || 'Recieve is required!',

  ],
  tranDate: [
    (v) => !!v || 'Date is required!',

  ]
}
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
const getSaleOpts=()=>{
  Meteor.call('ShowSale',(err,res)=>{
    saleOpts.value=res
  })
}
onMounted(()=>{
  getEmployeeOpts()
  getCustomerOpts()
  getSaleOpts()
})
</script>