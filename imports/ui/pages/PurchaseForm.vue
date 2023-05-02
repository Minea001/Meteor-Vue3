<template>
  <q-card>
    <q-card-section>
      <h6 style="color: rebeccapurple"><strong>PURCHASE FORM</strong></h6>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent ref="refForm">
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-4" style="padding-right:10px;">
                <q-input outlined dense v-model="dateStr" :rules="rules.tranDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cusor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale" cover>
                        <q-date v-model="dateStr" mask="YYYY/MM/DD">
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
                <q-select dense v-model="form.vendorId" outlined :rules="rules.vendorId" :options="vendorOpts" emit-value
                  map-options option-value="_id" option-label="name" label="Vendor *" />
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
      <PurchaseItemDetails :rows="2" :items="initItemDetails" @item-changed="handleItemChanged" />
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
        <div class="col-xs-4 col-md-2 col-lg-2">
          <div class="row q-col-gutter-y-sm">
            <div class="col-12">
              <text-h5> Sub Total: {{ form.subTotal }} </text-h5>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col-6">Discount ($) :</div>
                <div class="col-6">
                  <q-input outlined dense v-model.number="form.discount" />
                </div>
              </div>
            </div>
            <div class="col-12">
              <text-h5> Total: {{ form.total }} </text-h5>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
        <div class="col-12">
          <br>
          <!-- To save new and close we have to set parametter -->
          <q-btn v-if="!showId" color="primary" label="Save New" @click="saveForm('new')" />
          <q-btn class="q-ml-sm" color="warning" label="Save Close" @click="saveForm('close')" />
          <q-btn v-if="showId" class="q-ml-sm" color="red" @click="remove" label="Remove" />
          <q-btn class="q-ml-sm" label="Cancel" @click="cancel" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import Notify from '/imports/ui/lib/notify';
import wrapCurrentTime from '/imports/ui/lib/wrap-current-time.js'
import { ref, watch, onMounted, computed } from 'vue'
//import for use prop in child
import PurchaseItemDetails from '../components/PurchaseItemDetails.vue'
import { useQuasar } from 'quasar';
// to call moment
import moment from 'moment'
//To declear variable to show dialog
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const dateStr = ref(moment().format('DD/MMM/YYYY'))
const refForm = ref()
const employeeOpts = ref([{}])
const vendorOpts = ref([{}])

const showId = ref(route.query.id)
const form = ref({
  tranDate: '',
  employeeId: '',
  vendorId: '',
  subTotal: 0,
  discount: 0,
  total: 0,
  status: 'Open',
  statusDate: ''

})
//rules validate
const rules = {
  employeeId: [
    (v) => !!v || 'Employee is required!',

  ],
  vendorId: [
    (v) => !!v || 'Vendor is required!',

  ],
  tranDate: [
    (v) => !!v || 'Date is required!',

  ],
}
const initItemDetails = ref([])
let itemResultDetails = []

const getEmployeeOpts = () => {
  Meteor.call('ShowEmployee', (err, res) => {
    employeeOpts.value = res
  })
}
const getvendorOpts = () => {
  Meteor.call('ShowVendor', (err, res) => {
    vendorOpts.value = res
  })
}
//get valur from child
const handleItemChanged = ({ subTotal, itemDetails }) => {
  itemResultDetails = itemDetails
  form.value.subTotal = subTotal
  form.value.total = form.value.subTotal - form.value.discount

}
const getDataUpdate = () => {
  Meteor.call('getPurchaseById', showId.value, (err, res) => {
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

  let methodName = 'insertPurchase'
  //if have id Call method updateSale
  if (valid) {
    if (showId.value) methodName = 'updatePurchase'
  }

  Meteor.call(
    methodName,
    { doc: form.value, itemDetails: itemResultDetails },
    (err, res) => {
      if (err) {
        console.log('res', res)
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        if (type == 'close' || showId.value) {
          router.go(-1)
        } else {
          //set item child form=[]
          initItemDetails.value = []
          itemResultDetails=[]
          form.value = {
            tranDate: '',
            employeeId: '',
            vendorId: '',
            subTotal: 0,
            discount: 0,
            total: 0,
            status: 'Open',
            statusDate: ''
          }
        }
      }
    }
  )
}
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Do you want to remove?',
    cancel: true,
    ok: {
      push: true
    },
  }).onOk(() => {
    Meteor.call('removePurchase', { id: showId.value }, (err, res) => {
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
  getvendorOpts()
  if (showId.value) {
    getDataUpdate()
  }
})

</script>