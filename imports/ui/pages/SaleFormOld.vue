<template>
  <q-card style="width: 100%; max-width: 80vw; height: 100%">
    <q-card-section>
      <h6 style="color: rebeccapurple"><strong>SALE FORM</strong></h6>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-xs-12 col-md-12 col-lg-12">
            <div class="row q-col-gutter-y-sm">
              <div class="col-4" style="padding-right: 10px">
                <q-input outlined dense v-model="date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
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
                  :options="showCustomer"
                  outlined
                  emit-value
                  map-options
                  option-value="_id"
                  option-label="name"
                  label="Select Customer Name"
                />
              </div>
              <div class="col-4" style="padding-right: 10px">
                <q-select
                  dense
                  v-model="form.employeeId"
                  outlined
                  :options="showEmployee"
                  emit-value
                  map-options
                  option-value="_id"
                  option-label="name"
                  label="Select Employee Name"
                />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-center">No</th>
            <th class="text-center">Item</th>
            <th class="text-center">Qty</th>
            <th class="text-center">Price</th>
            <th class="text-center">Unit</th>
            <th class="text-center">Amount</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, index) in list_form" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td class="text-center">
              <q-select
                dense
                v-model="it.itemId"
                :options="showItem"
                outlined
                emit-value
                map-options
                option-value="_id"
                option-label="name"
                @update:model-value="changerow(it, 'Item')"
              >
              </q-select>
              <!-- 'Item' is when select and it was type item -->
            </td>

            <td class="text-center">
              <q-input
                dense
                v-model.number="it.qty"
                outlined
                @update:model-value="changerow(it)"
              ></q-input>
            </td>

            <td>
              <div class="text-center">
                <q-input
                  dense
                  v-model.number="it.price"
                  outlined
                  @update:model-value="changerow(it)"
                ></q-input>
              </div>
            </td>
            <td>
              <div class="text-center">
                <q-text dense outlined v-model="it.unit">{{
                  it.unitLabel
                }}</q-text>
              </div>
            </td>
            <td>
              <div class="text-center">
                <q-text dense v-model="it.amount" outlined disable>{{
                  it.amount
                }}</q-text>
              </div>
            </td>
            <td class="text-center">
              <q-btn
                dense
                color="primary"
                v-if="index == list_form.length - 1"
                @click="add"
                style="font-weight: bold; margin-right: 5px"
                >Add</q-btn
              >
              <q-btn
                dense
                color="red"
                @click="add"
                style="font-weight: bold; margin-right: 5px"
                >Del</q-btn
              >
            </td>
          </tr>
        </tbody>
      </q-markup-table>
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
                <div class="col-6">Discount:</div>
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
    </q-card-section>
  </q-card>
</template>
<script setup>
import Notify from '/imports/ui/lib/notify'
import { ref, watch, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
// To call moment package
import moment from 'moment'
const formatDate = (value) => {
  return moment(value).format('DD/MM/YYYY')
}
const refForm = ref()
const showEmployee = ref([{}])
const showCustomer = ref([{}])
const showItem = ref([{}])
const list_form = ref([])
const Amount = ref()
const itemform = ref({
  itemId: '',
  memo: '',
  qty: 0,
  price: 0,
  unitLabel: '',
  unit: '',
  amount: 0,
})
const form = ref({
  tranDate: '',
  message: '',
  employeeId: '',
  customerId: '',
  subTotal: 0,
  discount: 0,
  total: 0,
  status: '',
  statusDate: '',
  totalReceived: 0,
})

const selectEmployee = () => {
  Meteor.call('ShowEmployee', (err, res) => {
    showEmployee.value = res
    console.log(res)
  })
}
const selectCustomer = () => {
  Meteor.call('ShowCustomer', (err, res) => {
    showCustomer.value = res
    console.log(res)
  })
}
const selectItem = () => {
  Meteor.call('ShowItem', (err, res) => {
    showItem.value = res
  })
}
// To find data by id when selected item
const changerow = (row, type = '') => {
  //declear current Item
  const currentItem = showItem.value.find((it) => it._id == row.itemId) // find array ?
  //check if current Item and Item
  if (currentItem && type == 'Item') {
    row.price = currentItem.price
    row.unitLabel = currentItem.unitLabel
  }
  row.amount = row.qty * row.price
}
const add = () => {
  list_form.value.push({ ...itemform.value })
}
onMounted(() => {
  selectEmployee()
  selectCustomer()
  selectItem()
  add()
})

watch(
  () => list_form.value,
  (newValue) => {
    // do something with newValue and oldValue.
    console.log(newValue)
    let subTotal = 0
    let total
    let discount
    for (let i of newValue) {
      subTotal += i.amount
    }
    total = subTotal - (subTotal * form.value.discount) / 100
    form.value.subTotal = subTotal
    form.value.total = total
  },
  { deep: true }
)
</script>
