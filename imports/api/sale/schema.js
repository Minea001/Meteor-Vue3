import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";


export const saleSchema=new SimpleSchema({
  _id:{type:String,optional:true},
    tranDate:Date,
    employeeId:String,
    customerId:String,
    subTotal:Number,
    discount:Number,
    total:Number,
    status:String,
    // Object
    statusDate:{
      type:Object,
      optional:true
    },
    'statusDate.open':{
      type:Date,
      optional:true
    },
    'statusDate.partial':{
      type:Date,
      optional:true
    },
    'statusDate.closed':{
      type:Date,
      optional:true
    },
})

export const saleDetailSchema=new SimpleSchema({
  itemId:String,
  memo:{
    type:String,
    optional:true
  },
  qty:Number,
  price:Number,
  unitId:String,
  amount:Number,
})