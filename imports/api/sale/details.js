import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Sale=new Mongo.Collection('saleDetails')

Sale.schema=new SimpleSchema({
    saleId:String,
    tranDate:Date,
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
Sale.attachSchema(Sale.schema)
export default Sale