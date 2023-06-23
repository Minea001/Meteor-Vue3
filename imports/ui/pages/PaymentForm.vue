<template>
    <q-card>
      <q-card-section>
        <h6 style="color: rebeccapurple"><strong>PAYMENT FORM</strong></h6>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent ref="refForm">
          <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
            <div class="col-xs-12 col-md-12 col-lg-12">
              <div class="row q-col-gutter-y-sm">
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Date*</q-label>
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
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Vendor*</q-label>
                  <q-select  dense v-model="form.vendorId" :options="vendorOpts"
                    :rules="rules.vendorId" outlined emit-value map-options option-value="_id" option-label="name"
                    label="Vendor *" />
                </div>
  
              </div>
            </div>
            <!-- LINE 2 -->
            <div class="col-xs-12 col-md-12 col-lg-12">
              <div class="row q-col-gutter-y-sm">
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Employee*</q-label>
                  <q-select dense v-model="form.employeeId" outlined :rules="rules.employeeId" :options="employeeOpts"
                    emit-value map-options option-value="_id" option-label="name" label="Employee *" />
                </div>
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Purchase ID*</q-label>
                  <q-select  dense v-model="form.purchaseId" :options="purchaseOpts" :rules="rules.purchaseId"
                    outlined emit-value map-options option-value="value" option-label="label" label="Purchase ID *" />
                </div>
  
              </div>
            </div>
            <!-- LINE 3 -->
            <div class="col-xs-12 col-md-12 col-lg-12">
              <div class="row q-col-gutter-y-sm">
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Paid*</q-label>
                  <q-input
                    @change="handleReceiveChange"
                  dense outlined placeholder="Paid*" :rules="rules.paid" v-model.number="form.paid"></q-input>
                </div>
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Discount</q-label>
                  <q-input dense outlined placeholder="Discount" v-model.number="form.discount"></q-input>
                </div>
              </div>
            </div>
            <!-- LINE 4 -->
            <div class="col-xs-12 col-md-12 col-lg-12">
              <div class="row q-col-gutter-y-sm">
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Memo</q-label>
                  <q-input dense outlined placeholder="Memo" v-model="form.memo"></q-input>
                </div>
                <div class="col-6" style="padding-right: 10px">
                  <q-label>Open</q-label>
                  <q-input v-model="openAmount" dense outlined placeholder="Open" readonly></q-input>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-12">
            <br>
            <q-btn color="pink" label="Save Close"  @click="saveForm('close')"/>
            <q-btn class="q-ml-sm" v-if="!showId" color="warning" label="Save New" @click="saveForm" />
            <q-btn v-if="showId" class="q-ml-sm" color="red" label="Remove" @click="remove" />
            <q-btn class="q-ml-sm" color="secondary" label="Cancel" @click="cancel" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import Notify from '/imports/ui/lib/notify'
import wrapCurrentTime from '/imports/ui/lib/wrap-current-time.js'
import {ref,watch,onMounted,computed} from 'vue'
import { useQuasar } from 'quasar';
import moment, { months } from 'moment';

const $q=useQuasar()
const route=useRoute()
const router=useRouter()

const dateStr=ref(moment().format('DD/MMM/YYYY'))
const refForm=ref()
const employeeOpts=ref([{}])
const vendorOpts=ref([{}])
const purchaseOpts=ref([{}])

const firstShow =ref(false)
const firstTmpPurchaseId=ref(false)
const showId=ref(route.query.id)
const openAmount=ref(0)
const form=ref({
  tranDate: '',
  employeeId: '',
  vendorId: '',
  purchaseId: '',
  paid: 0,
  discount: 0,
  memo: ''
})
// Validate
const rules={
    employeeId:[
        (v)=>!!v || 'Employee is required!'
    ],
    vendorId:[
        (v)=>!!v || 'Vendor is required!'
    ],
    purchaseId:[
        (v)=>!!v || 'Purchase is required!'
    ],
    paid:[
        (v)=>!!v || 'Paid is required!'
    ],
    tranDate:[
        (v)=>!!v || 'Date is required!'
    ]
}
// get employee option
const getEmployeeOpts=()=>{
    Meteor.call('ShowEmployee',(err,res)=>{
        employeeOpts.value=res
    })
}
// get vendor option
const getVendorOpts=()=>{
    Meteor.call('ShowVendor',(err,res)=>{
        vendorOpts.value=res
    })
}
// save form
const saveForm=(type)=>{
  //validate
  const valid=refForm.value.validate()
  form.value.tranDate=wrapCurrentTime(moment(dateStr.value).toDate())
  let methodName='insertPayment'
  if(valid){
    if(showId.value) methodName='updatePayment'
  }
  Meteor.call(
    methodName,
    {doc:form.value},
    (err,res)=>{
      if(err){
        console.log('err', err)
        Notify.error({ message: err.reason || err })
      }else{
        Notify.success({ message: 'Success' })
        if(type=='close' || showId.value){
          router.go(-1)
        }else{
          firstTmpPurchaseId.value=""
          reset()
        }
      }
    }
  )
}
// method update data
const getDataUpdate=()=>{
  $q.loading.show()
  //set value
  firstShow.value=true
  Meteor.call('getPaymentById',showId.value,(err,res)=>{
    if(err){
      console.log('err',err)
    }else{
      firstTmpPurchaseId.value=res.purchaseId
      dateStr.value=moment(res.tranDate).format('DD/MMM/YYYY')
      form.value=res
    }
    setTimeout(() => {
      firstShow.value = false
      console.log('done')
      $q.loading.hide()
    },10)
  })
}
//to pass data to open-textbox
const getOpenAmount=()=>{
  const doc=purchaseOpts.value.find(it=>it.value==form.value.purchaseId)
    if(doc){
        openAmount.value=doc.balance
    }
}
watch(()=>form.value.purchaseId,()=>{
  getOpenAmount()
})
// to set validate to paid could not greater than amount
const handleReceiveChange=()=>{
    if(form.value.paid>openAmount.value){
        form.value.paid=openAmount.value
    }
}
// get purchase option
const getPurchaseOpts=()=>{
    purchaseOpts.value=[]
    const date=moment(dateStr.value).endOf('day').toDate()
    const selector={
        tranDate:{
            $lte:date
        },
        vendorId:form.value.vendorId,
        $or:[
       { status:{$ne:'Closed'}},
      ]
    }
    if(showId.value){
      selector.$or.push(
        {_id:firstTmpPurchaseId.value}
      )
    }
    //accessing method 'getPurchaseOpts'
    Meteor.call('getPurchaseOpts',{ selector,paymentId:showId.value },(err,res)=>{
        purchaseOpts.value=res || []
        getOpenAmount()
    })
}
//watch Date value
watch(()=>dateStr.value,()=>{
  if(!firstShow.value){
    form.value.purchaseId=''
  }
    getPurchaseOpts()
})
// watch vendor value
watch(()=>form.value.vendorId,()=>{
  if(!firstShow.value){
    form.value.purchaseId=''
  }
  getPurchaseOpts()
})
const reset=()=>{
  form.value={
  tranDate: '',
  employeeId: '',
  vendorId: '',
  purchaseId: '',
  paid: 0,
  discount: 0,
  memo: ''
}
}
// delete record
const remove=()=>{
  $q.dialog({
    title:"Confirm",
    message: `Do you want to remove?`,
    cancel:true,
    ok:{
      push:true
    },
  }).onOk(()=>{
    Meteor.call('removePayment',{id:showId.value},(err,res)=>{
      if(err){
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
  })
}
// Mount
onMounted(()=>{
    getEmployeeOpts()
    getVendorOpts()
    if(showId.value){
      getDataUpdate()
    }

})
const cancel = () => {
  router.go(-1)
}
</script>