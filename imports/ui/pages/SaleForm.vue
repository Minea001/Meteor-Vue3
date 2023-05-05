<template>
  <q-card>
    <q-card-section>
      <h6 style="color: rebeccapurple"><strong>SALE FORM</strong></h6>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent ref="refForm">
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-4" style="padding-right: 10px">
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
              <div class="col-4" style="padding-right: 10px">
                <q-select dense v-model="form.customerId" :options="customerOpts" :rules="rules.customerId" outlined
                  emit-value map-options option-value="_id" option-label="name" label="Customer *" />
              </div>
              <div class="col-4" style="padding-right: 10px">
                <q-select dense v-model="form.employeeId" outlined :rules="rules.employeeId" :options="employeeOpts"
                  emit-value map-options option-value="_id" option-label="name" label="Employee *" />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <!-- Details -->
    <q-card-section>
      <SaleItemDetails :rows="2" :items="initItemDetails" @item-changed="handleItemChanged" />
    </q-card-section>

    <q-card-section>
      <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Sub Total: {{ form.subTotal }}</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Discount ($) :</q-item-label>
       
        </q-item-section>
        <q-item-section>
 
       
             <q-input outlined dense v-model.number="form.discount"/>
         
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label >Total: {{ form.total }} </q-item-label>
          
        </q-item-section>
      </q-item>
    </q-list>
  </div>

      <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
        <div class="col-12">
       <br>
          <q-btn  color="primary" label="Save Close"  @click="saveForm('close')" />
          <q-btn class="q-ml-sm" v-if="!showId" color="warning" label="Save New" @click="saveForm('new')" />
          <q-btn v-if=" showId " class="q-ml-sm" color="red" @click=" remove " label="Remove" />
          <q-btn class="q-ml-sm" label="Cancel" @click=" cancel " />
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
// import for use prop in child 
import SaleItemDetails from '../components/SaleItemDetails.vue'
import { useQuasar } from 'quasar'
// To call moment package
import moment from 'moment'
// To declear variable to show dialog
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const dateStr = ref(moment().format('DD/MMM/YYYY'))
const refForm = ref()
const employeeOpts = ref([{}])
const customerOpts = ref([{}])

const showId = ref(route.query.id)
const form = ref({
  tranDate: '',
  employeeId: '',
  customerId: '',
  subTotal: 0,
  discount: 0,
  total: 0,
  status: 'Open',
  statusDate: '',
})
//rule validate
const rules = {
  employeeId: [
    (v) => !!v || 'Employee is required!',

  ],
  customerId: [
    (v) => !!v || 'Customer is required!',

  ],
  tranDate: [
    (v) => !!v || 'Date is required!',

  ]
}
const initItemDetails = ref([])
let itemResultDetails = []

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
// Get value from child
const handleItemChanged = ({ subTotal, itemDetails }) => {
  itemResultDetails = itemDetails
  form.value.subTotal = subTotal
  form.value.total = form.value.subTotal - form.value.discount
}

const getDataUpdate = () => {
  Meteor.call('getSaleById', showId.value, (err, res) => {
    if (err) {
      console.log('err', err)
    } else {
      dateStr.value = moment(res.doc.tranDate).format('YYYY/MM/DD')
      form.value = res.doc
      initItemDetails.value = res.itemDetails
    }
  })
}

const saveForm = async (type) => {
  //for validate form
  const valid = await refForm.value.validate()
  console.log(valid)
  form.value.tranDate = wrapCurrentTime(moment(dateStr.value).toDate())
  // To set statusDate=trandate
  form.value.statusDate = {
    open: form.value.tranDate,
  }

  if (!itemResultDetails.length) {
    Notify.warning({ message: 'Check item detail again.' })
    return false
  }

  let methodName = 'insertSale'
  //if have id Call method updateSale
  if (valid) {
    if (showId.value) methodName = 'updateSale'
  }

  Meteor.call(
    methodName,
    { doc: form.value, itemDetails: itemResultDetails },
    (err, res) => {
      if (err) {
        console.log('err', err)
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        if (type == 'close' || showId.value) {
          router.go(-1)
        } else {
          initItemDetails.value = []
          itemResultDetails=[]
          form.value = {
            tranDate: '',
            employeeId: '',
            customerId: '',
            subTotal: 0,
            discount: 0,
            total: 0,
            status: 'Open',
            statusDate: '',
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
    Meteor.call('removeSale', { id: showId.value }, (err, res) => {

      if (err) {
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
  })
}

const cancel = () => {
  // turn back 1 router
  router.go(-1)
}

watch(
  () => form.value.discount,
  () => {
    form.value.total = form.value.subTotal - form.value.discount
  }
)

onMounted(() => {
  getEmployeeOpts()
  getCustomerOpts()
  if (showId.value) {
    getDataUpdate()
  }
})
</script>
