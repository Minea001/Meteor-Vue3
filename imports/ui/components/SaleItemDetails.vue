<template>
  <q-markup-table>
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th class="text-center" style="width: 50vh">Item</th>
        <th class="text-center">Qty</th>
        <th class="text-center">Price</th>
        <th class="text-center">Unit</th>
        <th class="text-center">Amount</th>
        <th class="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, index) in listForm" :key="index">
        <td>
          {{ index + 1 }}
        </td>
        <td class="text-center">
          <q-select
            dense
            v-model="it.itemId"
            :options="itemOpts"
            outlined
            emit-value
            map-options
            option-value="_id"
            option-label="name"
            @update:model-value="changeRow(it, 'Item')"
          >
          </q-select>
          <!-- 'Item' is when select and it was type item -->
        </td>

        <td class="text-center">
          <q-input
            dense
            v-model.number="it.qty"
            outlined
            @update:model-value="changeRow(it)"
          ></q-input>
        </td>

        <td>
          <div class="text-center">
            <q-input
              dense
              v-model.number="it.price"
              outlined
              @update:model-value="changeRow(it)"
            ></q-input>
          </div>
        </td>
        <td>
          <div class="text-center">
            <q-text dense outlined v-model="it.unit">{{ it.unitLabel }}</q-text>
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
            v-if="index == listForm.length - 1"
            @click="add"
            style="font-weight: bold; margin-right: 5px"
            >Add</q-btn
          >
          <q-btn
            dense
            color="red"
            @click="remove(index)"
            style="font-weight: bold; margin-right: 5px"
            v-if="listForm.length > 1"
          >
            Del
          </q-btn>
        </td>
      </tr>
    </tbody>
  </q-markup-table>  
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
//declare in child 
// Prop for bos data pi parent tov child
const props = defineProps({
  rows: Number,
  items: Array, 
})

const emit = defineEmits(['itemChanged'])
// opts
const itemOpts = ref([])
const listForm = ref([])

const initForm = ref({
  itemId: '',
  memo: '',
  qty: 1,
  price: 0,
  unitLabel: '',
  unitId: '',
  amount: 0,
})
// Method
const getItemOpts = () => {
  Meteor.call('ShowItem', (err, res) => {
    itemOpts.value = res
  })
}
const changeRow = (row, type = '') => {
  //declear current Item
  const currentItem = itemOpts.value.find((it) => it._id == row.itemId) // find array ?
  //check if current Item and Item
  if (currentItem && type == 'Item') {
    row.price = currentItem.price
    row.unitId = currentItem.unitId
    row.unitLabel = currentItem.unitLabel
  }
  row.amount = row.qty * row.price
}
const add = () => {
  listForm.value.push({ ...initForm.value })
}
const remove = (index) => {
  listForm.value.splice(index, 1)
}

watch(
  () => props.items,
  (items) => {
    if (items.length) {
      // For update form
      listForm.value = items
    } else {
      for (let i = 0; i < props.rows; i++) {
        add()
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
watch(
  () => listForm.value,
  (newValue) => {
    // do something with newValue and oldValue.
    let subTotal = 0
    const itemDetails = []
    for (let it of newValue) {
      subTotal += it.amount

      if (it.itemId && it.qty > 0) {
        itemDetails.push({
          itemId: it.itemId,
          price: it.price,
          qty: it.qty,
          amount: it.amount,
          unitId: it.unitId,
        })
      }
    }
    // Emit to parent
    emit('itemChanged', { subTotal, itemDetails })
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  getItemOpts()
})
</script>
