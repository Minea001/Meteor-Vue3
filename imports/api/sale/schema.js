import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

// For this schema use to store data on parent (access to saleSchema)
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
    //for check Status date (Open , partial , or closed)
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
    totalReceived:{
      type:Number,
      optional:true
    }
})
// Use to store data on child (access to saleDetailSchema)
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