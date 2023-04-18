<template>
   <q-table class="q-pa-md"
   v-model:pagination="pagination"
        bordered
        flat
        :rows="data" 
        :columns="columns"
        :filter="filter"
        :loading="loading"
        row-key="_id"
        @request="onChangePagination"
        >
        <template #top>
           <div class="q-gutter-x-md">
            <q-btn color="brown-5" no-caps icon="add" @click.prevent="addNew">
                Add New Employee
            </q-btn>
            </div>

            <q-space/>
            <q-input
            v-model="filter"
            outlined
            dense
            debounce="300"
            placeholder="Search">
           <template #append>
            <q-icon name="search"/>
           </template>
            </q-input>
          
        </template>
        <template #body-cell-name="props">
            <q-td :props="props">
                <span @click="edit(props.row)" class="ra-text-link">
                {{ props.row.name }}
                </span>
            </q-td>
        </template>    
   </q-table>

<EmployeeForm
    :dialog="visibleDialog"
    :show-id="showId"
    @closed="handleClosedDialog"
   /> 
</template>
<script setup>
import { onMounted,ref } from 'vue';
import  Notify  from '/imports/ui/lib/notify';
import EmployeeForm from './EmployeeForm.vue'

const columns=[
    {
        name:'name',
        label:'Name',
        align:'left',
        field:'name'
    },
    {name:'telephone',label:'Telephone',field:'telephone'},
    {name:'address',label:'Address',field:'address'},
    {name:'status',label:'Status',field:'status'}

]
const visibleDialog=ref(false)
const loading=ref(false)
// pagination
const pagination=ref({
    sortBy:'name',
    descending:false,
    page:1,
    rowsPerPage:10,
    rowsNumber:0,
})
const filter=ref('')
const data=ref([])
const showId=ref('')
const addNew=()=>{
    visibleDialog.value=true
}
// method
const fetchData=()=>{
    loading.value=true
  const {page,rowsPerPage}=pagination.value
  let exp=new RegExp (filter.value)
  const query={}
  if(filter.value){
    query['$or']=[
      {name:{$regex:exp,$options:'i'}},
      {telephone:{$regex:exp,$options:'i'}},
      {address:{$regex:exp,$options:'i'}},
    ]
  }
    const match={
        page,
        rowsPerPage,
        slector:query,
    }
    Meteor.call('findEmployees',{...match},(err,res)=>{
        if(err){
            console.log('error', err)
            Notify.error({message:err.reason || err})
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
const edit=(row)=>{
    visibleDialog.value=true
    showId.value=row._id
}
const handleClosedDialog=(value)=>{
    visibleDialog.value=value
    showId.value=''
    fetchData()
}
onMounted(()=>{
    fetchData()
})

</script>