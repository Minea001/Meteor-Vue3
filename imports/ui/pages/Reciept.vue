<template>
   <q-table
   bordered
   flat
    :rows="data"
    :columns="columns"
    :filter="filter"
    :loading="loading"
    row_key="_id"
    @request="onChangePagination"
   >
    <template #top>
        <div class="q-gutter-x-md">
            <q-btn label="Add" color="pink" @click="add()"></q-btn>
        </div>
        <q-space/>
        <q-input
        v-model="filter"
        outlined
        dense
        debounce="300"
        placeholder="Search"
        >
        <template #append>
            <q-icon name="search" />
        </template>
    </q-input>
    </template>

    <template #body-cell-tranDate="props">
        <q-td :props="props">
        <span class="ra-text-link" @click="edit(props.row)">
          {{ formatDate(props.row.tranDate) }}
        </span>
      </q-td>
    </template>
   </q-table>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { onMounted,ref } from 'vue';
import Notify from '/imports/ui/lib/notify'
import moment from 'moment'

const filter=ref('')
const router=useRouter()

const columns=[
{name:'tranDate',label:'Transition Date',field:'tranDate'},
  {name:'customerId',label:'Customer Name',field:'customerId'},
  {name:'employeeId',label:'Employee Name',field:'employeeId'},
  {name:'saleId',label:'Sale ID',field:'saleId'},
  {name:'recieve',label:'Recieve',field:'recieve'},
  {name:'discount',label:'Discount',field:'discount'},
  {name:'memo',label:'Memo',field:'memo'},
]
const loading =ref(false)
const data=ref([])
//pagination
const pagination=ref({
  sortBy:'name',
  descending:false,
  page:1,
  rowsPerPage:10,
  rowsNumber:0,
})
const formatDate=(value)=>{
  return moment(value).format('DD/MM/YYYY')
}
const fetchData=()=>{
  loading.value=true
  const {page,rowsPerPage}=pagination.value
  let exp=new RegExp(filter.value)
  const query={}
  if(filter.value){
    query['$or']=[
      {tranDate:{$regex:exp,$options:'i'}},
      {customerId:{$regex:exp,$options:'i'}},
      {employeeId:{$regex:exp,$options:'i'}},
      {saleId:{$regex:exp,$options:'i'}},
      {recieve:{$regex:exp,$options:'i'}},
      {discount:{$regex:exp,$options:'i'}},
      {memo:{$regex:exp,$options:'i'}},
     
    ]
  }
  const match={
    page,
    rowsPerPage,
    selector:query,
  }
  Meteor.call('findReciept',{...match},(err,res)=>{
    if(err){
      console.log('error',err)
      Notify.error({ message: err.reason || err })
    }else{
      data.value=res.data || []
      pagination.value.rowsNumber=res.total || 0
    }
    loading.value=false
  })
}
const onChangePagination=(val)=>{
  pagination.value=val.pagination
  fetchData()
}
const add=()=>{
  router.push({
    name:'RecieptForm',

  })
}
const edit=(row)=>{
  router.push({
    name:'RecieptForm',
    query:{
      id:row._id,
    }
  })
}
onMounted(()=>{
  fetchData()
})
</script>