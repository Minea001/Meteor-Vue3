import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const purchaseSchema=new SimpleSchema({
    _id:{type:String,optional:true},
    tranDate:Date,
    vendorId:String,
    employeeId:String,
    subTotal:Number,
    discount:Number,
    total:Number,
    status:String,
    statusDate:{
        type:Object
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
    totalPaid:{
        type:Number,
       optional:true
    }
})

export const purchaseDetailSchema=new SimpleSchema({

    itemId:String,
    unitId:String,
    qty:Number,
    cost:Number,
    amount:Number,
    memo:{
        type:String,
        optional:true
      },
})