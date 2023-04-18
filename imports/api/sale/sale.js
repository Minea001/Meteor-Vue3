import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Sale=new Mongo.Collection('sale')

Sale.schema=new SimpleSchema({
    tranDate:Date,
    employeeId:String,
    customerId:String,
    itemId:String,
    memeo:String,
    qty:Number,
    price:Number,
    unit:String,
    amount:Number,
    subTotal:Number,
    discount:Number,
    total:Number,
    status:String,
    statusDate:Object,
    totalReceived:Number
})
Sale.attachSchema(Sale.schema)
export default Sale