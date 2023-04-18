<template>
    <q-table
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
            Add
          </q-btn>
        </div>
        <q-space />
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
      <template #body-cell-name="props">
        <q-td :props="props">
  <span @click="edit(props.row)" class="ra-text-link">{{ props.row.name }}</span>
        </q-td>
      </template>
    </q-table>
  <ItemForm
    :dialog="visibleDialog"
    :show-id="showId"
    @closed="handleClosedDialog"
  >
  </ItemForm>
  
  </template>
  <script setup>
  import { onMounted,ref } from 'vue';
  import  Notify from '/imports/ui/lib/notify'
  import ItemForm from './ItemForm.vue';
  
  const columns=[
    {
        name: 'name',
        required: true,
        label: 'Item Name',
        align: 'left',
        sortable: true
    },
    {name:'catId',label:'CatID',field:'catName'},
    {name:'unitId',label:'UnitID',field:'unitName'},
    {name:'price',label:'Price',field:'price'},
    {name:'cost',label:'Cost',field:'cost'},
    {name:'memo',label:'Memo',field:'memo'},
    {name:'status',label:'Status',field:'status'}

]
  
  // declear data properties
  // to set dialog=false 
  const visibleDialog=ref(false)
  const loading=ref(false)
  const data=ref([])
  const showId=ref('')
  const filter=ref('')
  //paginatte
  const pagination=ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage:10,
    rowsNumber:0,
  })
  // to set when addnew data and it will change visible value to true because the default one is false
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
        {catId:{$regex:exp,$options:'i'}},
        {unitId:{$regex:exp,$options:'i'}},
        {price:{$regex:exp,$options:'i'}},
        {cost:{$regex:exp,$options:'i'}},
        {status:{$regex:exp,$options:'i'}},
      ]
    }
  const match={
    page,rowsPerPage, selector:query
  }
  Meteor.call('findItems', {...match},(err,res)=>{
    if(err){
      console.log('error',err)
      Notify.error({message:err.reason || err})
    }else{
      data.value=res.data || []
      pagination.value.rowsNumber=res.total||0
      console.log(res)
  
    }
    loading.value=false
    console.log(res)
  })
  
  }
  const onChangePagination=(val)=>{
    pagination.value=val.pagination
    fetchData()
  }
  //to edit
  const edit=(row)=>{
    visibleDialog.value=true
    showId.value=row._id
  }
  const handleClosedDialog=(value)=>{
    visibleDialog.value=value
    showId.value=''
    fetchData()
  }
  //life cycle
  onMounted(()=>{
    fetchData()
    
  })
  </script>