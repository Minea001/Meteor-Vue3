<template>
    <q-dialog 
    no-esc-dismiss
    no-backdrop-dismiss
    v-model="visableDialog"
    @hide="$event=>cancel"
    >
    <q-card style="width:70%; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Vendor</div>
      </q-card-section>
  
    <q-card-section>
      <q-form ref="refForm">
          <div class="row q-col-gutter-sm">
              <div class="col">
                <q-input
                v-model="form.name"
                  label="Name *"
                  :rules="rules.name"
                  required
                >
                </q-input>
                
                <q-input
                  label="Telephone *"
                  v-model="form.telephone"
                  required
                >      
                </q-input>
                <q-input
                v-model="form.address"
                  label="Address"
                  required
                >      
                </q-input>
                <div label="Status">
                  <fieldset>
                    <legend>Sale type</legend>
                    <q-radio 
                    v-model="form.status"
                      label="Active"
                      val="active"
                    >
                    </q-radio>
                    <q-radio
                      v-model="form.status"
                      label="Inactive"
                      val="inactive"
                      ></q-radio>
                  </fieldset>
                </div>
  
              </div>
          </div>
      </q-form>
    </q-card-section>
  
    <q-card-actions align="right" class="bg-white text-teal">
      <div class="text-right q-gutter-sm">
        <q-btn color="primary" @click="submit">Save</q-btn>
        <q-btn color="red" v-if="showId" @click="remove">Remove</q-btn>
        <q-btn outline color="primary" @click="cancel">Cancel</q-btn>
      </div>
  
    </q-card-actions>
  </q-card>
    </q-dialog>
  </template>
  <script>
    export default{
      name: 'ComA',
    }
  </script>
  <script setup>
  
  import Notify from '/imports/ui/lib/notify'
  import {ref,watch} from 'vue'
  import { useQuasar } from 'quasar';
  
  
  const $q=useQuasar()
  const props=defineProps({
    dialog:{
      type: Boolean,
      default: true,
    },
    showId:{
      type: String,
      default:null,
    }
  })
  const emit=defineEmits(['closed'])
  // data properties
  const refForm=ref()
  const form=ref({
    name: '',
    telephone: '',
    address: '',
    status: 'active',
 
  })
  const visableDialog=ref(false)
  
  const rules={
    name:[
    (v)=>!!v || 'Name is required',
    async (value)=>{
      let selector={
        name:value
      }
      if(props.showId){
        selector._id={$ne: props.showId}
      }
      const res=await checkExist(selector)
      return !res || 'Exist name'
    }
  ]
  }
  const checkExist=(selector)=>{
    return new Promise((resolve,reject)=>{
      Meteor.call('checkVendorExist',{selector},(err,res)=>{
        if(err){
          reject(err)
        }else{
          resolve(res)
        }
      })
    })
  }
  
  const submit =async()=>{
    const valid=await refForm.value.validate()
    if(valid){
      if(form.value._id){
      update()
      }else{
        insert()
      }
    }
  }
  
  const insert=()=>{
    Meteor.call('insertVendor',form.value,(err,res)=>{
      if(err){
        console.log(err)
        Notify.error({message: err.reason || err})
      }else{
        Notify.success({message: 'Success'})
        reset()
        cancel()
      }
    })
  }
  // update
  const update=()=>{
    Meteor.call('updateVendor',form.value,(err,res)=>{
      if(err){
        Notify.error({ message: err.reason || err })
  
      }else{
        Notify.success({ message: 'Success' })
        cancel()
      }
    }
  )}
  //remove
  const remove =()=>{
    $q.dialog({
      title: 'Confirm',
      message:'Do you want to remove [${form.value.name}] ?',
      cancel:true,
      ok:{
        push:true,
      },
    }).onOk(()=>{
      Meteor.call('removeVendor',{id:props.showId},(err,res)=>{
        if (err) {
          Notify.error({ message: err.reason || err })
        } else {
          Notify.success({ message: 'Success' })
        // Call method Cancel to close dialog
          cancel()
        }
      })
    })
  }
  // method reset 
  const reset =()=>{
  
    // refForm.value?.reset()
    if(props.showId){
        delete form.value._id
    }
    form.value={
    name: '',
    telephone: '',
    address: '',
    status: 'active',
  
    }
    // form.value.status='active'
  }
  // for cancel
  const cancel=()=>{
    reset()
    emit('closed',false)
  }
  watch(
    ()=>props.dialog,
    (value)=>{
      visableDialog.value=value
      console.log(value)
    }
  )
  watch(
    ()=>props.showId,
    (value)=>{
      if(value){
        Meteor.call('getVendorById',props.showId,(err,res)=>{
          form.value=res
          console.log(res)
        })
      }
    }
  )
  </script>