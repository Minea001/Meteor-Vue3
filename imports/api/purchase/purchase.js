import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Purchase=new Mongo.Collection('purchase')

Purchase.schema=new SimpleSchema({
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
        defaultValue:0
    }

})
Purchase.attachSchema(Purchase.schema)
export default Purchase
