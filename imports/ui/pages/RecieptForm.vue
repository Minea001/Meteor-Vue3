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
                <q-select  dense v-model="form.customerId" :options="customerOpts"
                  :rules="rules.customerId" outlined emit-value map-options option-value="_id" option-label="name"
                  label="Customer *" />
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
                <q-select  dense v-model="form.saleId" :options="saleOpts" :rules="rules.saleId"
                  outlined emit-value map-options option-value="value" option-label="label" label="Sale ID *" />
              </div>

            </div>
          </div>
          <!-- LINE 3 -->
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-6" style="padding-right: 10px">
                <q-label>Recieve*</q-label>
                <q-input
                  @change="handleReceiveChange"
                dense outlined placeholder="Recieve*" :rules="rules.recieve" v-model.number="form.recieve"></q-input>
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
                <q-input v-model="openAmount" dense outlined placeholder="Open" readonly></q-input>
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
          <q-btn color="pink" label="Save Close"  @click="saveForm('close')"/>
          <q-btn class="q-ml-sm" v-if="!showId" color="warning" label="Save New" @click="saveForm" />
          <q-btn v-if="showId" class="q-ml-sm" color="red" label="Remove" @click="remove" />
          <q-btn class="q-ml-sm" color="secondary" label="Cancel" @click="cancel" />
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

const dateStr = ref(moment().format('DD/MMM/YYYY'))
const refForm = ref()
const employeeOpts = ref([{}])
const customerOpts = ref([{}])
const saleOpts = ref([{}])

const showId = ref(route.query.id)
const openAmount = ref(0)
const form = ref({
  tranDate: '',
  employeeId: '',
  customerId: '',
  saleId: '',
  recieve: 0,
  discount: 0,
  memo: ''
})
// Validate textbox
const rules = {
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
// Get Employee
const getEmployeeOpts = () => {
  Meteor.call('ShowEmployee', (err, res) => {
    employeeOpts.value = res
  })
}
// Get Customer
const getCustomerOpts = () => {
  Meteor.call('ShowCustomer', (err, res) => {
    customerOpts.value = res
  })
}
//To show value of amount in open textbox
//It watch to get value from select list of saleId
watch(() => form.value.saleId, () => {
  const doc = saleOpts.value.find(it => it.value == form.value.saleId)
  if (doc) {
    openAmount.value = doc.balance
  }
})
//To set validate in textbox 'recieve' if it greater that open amount so set value to equal open amount
//this method call in recieve textbox
const handleReceiveChange = ()=>{
  if(form.value.recieve>openAmount.value){
    form.value.recieve = openAmount.value
  }
}

const getSaleOpts = () => {
  form.value.saleId = ''
//set when start អោយតម្លៃវាស្មើទទេដើម្បីពេលយើងប្ដូរ customer ថ្មីវាclear textbox អោយយើងរើសថ្មី
  saleOpts.value = []
  const date = moment(dateStr.value).endOf('day').toDate()
  const selector = {
  //less than tranDate
    tranDate: {
      $lte: date
    },
    customerId: form.value.customerId,
    //យកstatus ណាដែលមិនស្មើclose
    status: { $ne: 'Closed' } //if not equal close
  }
  //accessing method 'getSaleOpts'
  Meteor.call('getSaleOpts', { selector }, (err, res) => {
    saleOpts.value = res || []
  })
}
//watch on date value
watch(() => dateStr.value, () => {
  getSaleOpts()
})
//watch on customer value
watch(() => form.value.customerId, () => {
  getSaleOpts()
})
//method save form
const saveForm = (type) => {
  //for validate form
  const valid = refForm.value.validate()
  form.value.tranDate = wrapCurrentTime(moment(dateStr.value).toDate())
  let methodName = 'insertReciept'
  if (valid) {
    if (showId.value) methodName = 'updateReciept'
  }
  Meteor.call(
    methodName,
    { doc: form.value },
    (err, res) => {
      if (err) {
        console.log('err', err)
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        if (type == 'close' || showId.value) {
          router.go(-1)
        } else {
          form.value = {
            tranDate: '',
            employeeId: '',
            customerId: '',
            saleId: '',
            recieve: 0,
            discount: 0,
            memo: ''
          }
        }
      }
    }
  )
}
const remove = () => {
  $q.dialog({
    title: 'Comfirm',
    message: `Do you want to remove?`,
    cancel: true,
    ok: {
      push: true
    },

  }).onOk(() => {
    Meteor.call('removeReciept', { id: showId.value }, (err, res) => {
      if (err) {
        Notify.error({ message: err.reason || err })

      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
  })
}
onMounted(() => {
  getEmployeeOpts()
  getCustomerOpts()

})
const cancel = () => {
  router.go(-1)
}
</script>