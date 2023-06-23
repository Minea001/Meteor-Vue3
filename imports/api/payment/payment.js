import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
const Payment=new Mongo.Collection('payment')
Payment.schema=new SimpleSchema({
    tranDate:Date,
    vendorId:String,
    employeeId:String,
    purchaseId:String,
    paid:Number,
    discount:Number,
    memo:{
        optional:true,
        type:String
    }
})
Payment.attachSchema(Payment.schema)
export default Payment