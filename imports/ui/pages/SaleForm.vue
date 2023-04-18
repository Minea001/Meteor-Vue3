<template>
  <q-card>
    <q-card-section>
      <h6 style="color: rebeccapurple"><strong>SALE FORM</strong></h6>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-4" style="padding-right: 10px">
                <q-input outlined dense v-model="dateStr">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateStr" mask="YYYY/MM/DD">
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
              <div class="col-4" style="padding-right: 10px">
                <q-select
                  dense
                  v-model="form.customerId"
                  :options="customerOpts"
                  outlined
                  emit-value
                  map-options
                  option-value="_id"
                  option-label="name"
                  label="Customer"
                />
              </div>
              <div class="col-4" style="padding-right: 10px">
                <q-select
                  dense
                  v-model="form.employeeId"
                  outlined
                  :options="employeeOpts"
                  emit-value
                  map-options
                  option-value="_id"
                  option-label="name"
                  label="Employee"
                />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <!-- Details -->
    <q-card-section>
      <SaleItemDetails
        :rows="2"
        :items="initItemDetails"
        @item-changed="handleItemChanged"
      />
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
          <q-btn color="primary" label="Save" @click="saveForm" />
          <q-btn
            v-if="showId"
            class="q-ml-sm"
            color="red"
            @click="remove"
            label="Remove"
          />
          <q-btn class="q-ml-sm" label="Cancel" @click="cancel" />
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
import SaleItemDetails from '../components/SaleItemDetails.vue'
import { useQuasar } from 'quasar'
// To call moment package
import moment from 'moment'

const route = useRoute()
const router = useRouter()

const dateStr = ref(moment().format('YYYY/MM/DD'))
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

const saveForm = () => {
  form.value.tranDate = wrapCurrentTime(moment(dateStr.value).toDate())
  form.value.statusDate = {
    open: form.value.tranDate,
  }

  if (!itemResultDetails.length) {
    Notify.warning({ message: 'Check item detail again.' })
    return false
  }

  let methodName = 'insertSale'
  if (showId.value) methodName = 'updateSale'

  Meteor.call(
    methodName,
    { doc: form.value, itemDetails: itemResultDetails },
    (err, res) => {
      if (err) {
        console.log('err', err)
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        if (showId.value) {
          router.go(-1)
        }
      }
    }
  )
}

const remove = () => {
  Meteor.call('removeSale', { id: showId.value }, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      cancel()
    }
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
  getCustomerOpts()
  if (showId.value) {
    getDataUpdate()
  }
})
</script>
