<template>
    <q-markup-table>
        <thead>
            <tr>
        <th class="text-center">No</th>
        <th class="text-center" style="width: 50vh">Item</th>
        <th class="text-center">Qty</th>
        <th class="text-center">Cost</th>
        <th class="text-center">Unit</th>
        <th class="text-center">Amount</th>
        <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(it,index) in listForm" :key="index">
            <td>
                {{ index+1 }}
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
                @update:model-value="changeRow(it,'Item')">

                </q-select>

            </td>
            <td class="text-center">
                <q-input 
                dense
                v-model.number="it.qty"
                outlined
                @update:model-value="changeRow(it)"
                >

                </q-input>
            </td>
            <td>
          <div class="text-center">
            <q-input
              dense
              v-model.number="it.cost"
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
                    <q-text dense outlined v-model="it.amount">{{ it.amount }}</q-text>
                </div>
            </td>
            <td class="text-center">
                <q-btn dense color="primary" v-if="index==listForm.length-1"
                @click="add"
                style="font-weight: bold; margin-right: 5px"
            round
            size="md"
                >
                <i class="fa-solid fa-plus"></i>
                </q-btn>
                <q-btn 
                round
                dense
                color="negative"
                size="md"
                @click="remove(index)"
                style="font-weight: bold; margin-right: 5px;"
               v-if="listForm.length>1"
                >
                <i class="fa-solid fa-minus"></i>
                </q-btn>
            </td>
            </tr>
        </tbody>
    </q-markup-table>
</template>
<script setup>
import {ref,watch,onMounted} from 'vue'
//declear in child
const props=defineProps({
    rows:Number,
    items:Array,
})
const emit=defineEmits(['itemChanged'])
//opts
const itemOpts=ref([])
const listForm=ref([])

const initForm=ref({
    itemId:'',
    memo:'',
    qty:1,
    cost:0,
    unitLabel:'',
    unitId:'',
    amount:0,
})
//method
const getItemOpts=()=>{
    Meteor.call('ShowItem',(err,res)=>{
        itemOpts.value=res
    })
}
const changeRow=(row,type='')=>{
    //declear current Item
    const currentItem=itemOpts.value.find((it)=>it._id==row.itemId)// 
    if(currentItem && type=='Item'){
        row.cost=currentItem.cost
        row.unitId=currentItem.unitId
        row.unitLabel=currentItem.unitLabel
    }
    row.amount=row.qty*row.cost
}
const add = () => {
  listForm.value.push({ ...initForm.value })
}
const remove=(index)=>{
    listForm.value.splice(index,1)
}
watch(
    ()=>props.items,
    (items)=>{
        //set default value=[]
        listForm.value=[]
        if(items.length){
            //update form 
            listForm.value=items
        }else{
            for (let i=0; i<props.rows;i++){
                add()
            }
        }
    },
    {
        immediate:true,
        deep:true
    }
)
watch(
    ()=>listForm.value,
    (newValue)=>{
        let subTotal=0
        const itemDetails=[]
        for (let it of newValue){
            subTotal+=it.amount
            if(it.itemId&&it.qty>0){
                itemDetails.push({
                    itemId:it.itemId,
                    cost:it.cost,
                    qty:it.qty,
                    amount:it.amount,
                    unitId:it.unitId,
                })
            }
        }
        //emit to parent
        emit ('itemChanged',{subTotal,itemDetails})
    },
    {deep:true,immediate:true}
)
onMounted(()=>{
    getItemOpts()
})
</script>