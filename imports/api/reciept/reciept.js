import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
const Reciept=new Mongo.Collection('reciept')
Reciept.schema=new SimpleSchema({
    tranDate:Date,
    customerId:String,
    employeeId:String,
    saleId:String,
    recieve:Number,
    discount:Number,
    memo:String
})
Reciept.attachSchema(Reciept.schema)
export default Reciept