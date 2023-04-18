import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Sale=new Mongo.Collection('sales')

Sale.schema=new SimpleSchema({
    tranDate:Date,
    employeeId:String,
    customerId:String,
    subTotal:Number,
    discount:Number,
    total:Number,
    status:String,
    // Object
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
    totalReceived:{
      type:Number,
      defaultValue:0,
    }
})
Sale.attachSchema(Sale.schema)
export default Sale